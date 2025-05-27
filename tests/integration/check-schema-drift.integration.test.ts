// tests/integration/check-schema-drift.integration.test.ts
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local'), override: true });
config({ path: resolve(process.cwd(), '.env'), override: true });

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';

const PROJECT_ROOT = process.cwd();
const checkScriptPath = resolve(PROJECT_ROOT, 'scripts/check-schema-drift.sh');
const generateScriptPath = resolve(PROJECT_ROOT, 'scripts/generate-supabase-types.sh');
const typesFilePath = resolve(PROJECT_ROOT, 'types/supabase.ts');

const execOpts: ExecSyncOptionsWithStringEncoding = {
  cwd: PROJECT_ROOT,
  env: { ...process.env },
  encoding: 'utf-8',
  stdio: 'pipe'
};

const shellSleep = (seconds: number) => {
  try {
    if (seconds > 0) {
      execSync(`sleep ${seconds}`, { stdio: 'pipe' });
    }
  } catch (e) {
    console.warn(`Sleep command failed: ${e}`);
  }
};

describe('check-schema-drift.sh Integration Test', () => {
  let originalTypesContent: string | null = null;
  let typesFileExistedBeforeTest: boolean = false;

  beforeAll(() => {
    typesFileExistedBeforeTest = existsSync(typesFilePath);
    if (typesFileExistedBeforeTest) {
        try {
            originalTypesContent = readFileSync(typesFilePath, 'utf-8');
        } catch (e: any) {
            console.warn(`Integration Test Global Setup: Could not read initial ${typesFilePath}. Error: ${e.message}`);
            originalTypesContent = null;
        }
    }
    console.log('Integration Test Setup: Running generate-supabase-types.sh to establish baseline...');
    try {
        execSync(`bash ${generateScriptPath}`, execOpts);
    } catch (error: any) {
        console.error("Integration Test Setup FAILED to run generate-supabase-types.sh. Stdout:", error.stdout, "Stderr:", error.stderr);
        throw error;
    }
  }, 120000); // Increased timeout for beforeAll

  afterAll(() => {
    if (originalTypesContent !== null && typesFileExistedBeforeTest) {
        console.log('Integration Test Teardown: Restoring original types/supabase.ts...');
        writeFileSync(typesFilePath, originalTypesContent, 'utf-8');
    } else if (!typesFileExistedBeforeTest && existsSync(typesFilePath)) {
        console.log(`Integration Test Teardown: ${typesFilePath} was created by tests. Consider removal.`);
        // rmSync(typesFilePath); // Uncomment if you want to auto-delete if created by test
    } else {
        console.log(`Integration Test Teardown: No specific cleanup/restore action for ${typesFilePath}.`);
    }
  }, 60000);

  it('should run successfully and report no drift after syncing types', () => {
    let scriptOutput = '';
    let scriptError = '';
    let executionError: Error | null = null;

    console.log('Integration No-Drift Test: Forcing fresh sync of types/supabase.ts...');
    try {
        if (existsSync(typesFilePath)) rmSync(typesFilePath); // Delete before generating
        execSync(`bash ${generateScriptPath}`, execOpts); // Re-sync
        
        if (!existsSync(typesFilePath) || readFileSync(typesFilePath, 'utf-8').trim().length < 50) { // Check it's non-empty and has some substance
             const content = existsSync(typesFilePath) ? readFileSync(typesFilePath, 'utf-8') : "File does not exist.";
             throw new Error(`Integration No-Drift Test: ${generateScriptPath} failed to create a substantial ${typesFilePath}. Content: ${content.substring(0,100)}`);
        }
        console.log(`Integration No-Drift Test: ${typesFilePath} explicitly re-synced and verified (Node.js).`);
        shellSleep(1); // More significant pause
    } catch (syncError: any) {
        console.error("Integration No-Drift Test: Failed to re-sync or verify types. Stdout:", syncError.stdout, "Stderr:", syncError.stderr, "Error:", syncError);
        throw syncError;
    }

    try {
      scriptOutput = execSync(`bash ${checkScriptPath}`, execOpts);
    } catch (error: any) {
      executionError = error;
      scriptOutput = error.stdout || '';
      scriptError = error.stderr || '';
      console.error("Integration No-Drift Test: check-schema-drift.sh executionError. Status:", error.status);
      console.error("Integration No-Drift Test: Script STDOUT:", scriptOutput);
      console.error("Integration No-Drift Test: Script STDERR:", scriptError);
    }

    expect(executionError, `Script should succeed. Exit: ${((executionError||{})as any)?.status}. Stderr: ${scriptError}. Stdout: ${scriptOutput}`).toBeNull();
    expect(scriptOutput).toContain('✅ No schema drift detected');
  }, 120000); // Increased timeout

  it('should report drift and exit non-zero if types file is modified', () => {
    let scriptOutput = '';
    let scriptError = '';
    let executionError: Error | null = null;

    console.log('Integration Drift Test: Ensuring types/supabase.ts is freshly synced before modification...');
    try {
        execSync(`bash ${generateScriptPath}`, execOpts); // Re-sync
        if (!existsSync(typesFilePath) || readFileSync(typesFilePath, 'utf-8').trim().length < 50) {
            throw new Error(`Integration Drift Test: Pre-modification sync failed to create a substantial ${typesFilePath}.`);
        }
    } catch (syncError: any) {
        console.error("Integration Drift Test: Failed to re-sync types prior to modification. Stdout:", syncError.stdout, "Stderr:", syncError.stderr);
        throw syncError;
    }

    const knownDriftContent = `// Integration Test: This is known different content to GUARANTEE drift.\n// Timestamp: ${new Date().toISOString()}\nexport type DeliberateDriftEnsuredByIntegrationTest = {};\n`;
    try {
        writeFileSync(typesFilePath, knownDriftContent, 'utf-8');
        console.log(`Integration Test: Overwritten ${typesFilePath} with known distinct drift content.`);
        
        const readBackContent = readFileSync(typesFilePath, 'utf-8');
        if (!readBackContent.includes("DeliberateDriftEnsuredByIntegrationTest")) {
            console.error("Integration Drift Test: Modification not reflected by Node.js readFileSync. Content:", readBackContent.substring(0, 200));
            throw new Error("Integration Drift Test: File modification verification by Node.js read failed.");
        }
        console.log('Integration Drift Test: Modification verified by Node.js readFileSync.');
        shellSleep(1); // More significant pause
    } catch(e: any) {
        console.error(`Integration Drift Test: Failed to write or verify known drift content: ${e.message}`);
        throw e;
    }

    try {
        scriptOutput = execSync(`bash ${checkScriptPath}`, execOpts);
        console.error("Integration Drift Test FAIL: Script unexpectedly exited 0. STDOUT:", scriptOutput);
    } catch (error: any) {
        executionError = error;
        scriptOutput = error.stdout || '';
        scriptError = error.stderr || '';
    }

    expect(executionError, "Script should fail (exit non-zero) when drift is detected.").not.toBeNull();
    if (executionError && 'status' in executionError) {
      expect((executionError as any).status, "Script exit code should be 1 for drift").toBe(1);
    }
    const combinedOutput = scriptOutput + scriptError;
    expect(combinedOutput).toContain('🚨 Schema drift detected!');
  }, 120000); // Increased timeout
});