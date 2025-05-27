// tests/unit/check-schema-drift.test.ts
import { statSync, existsSync, writeFileSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { test, expect, describe, beforeAll, afterAll, beforeEach } from 'vitest';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';

const PROJECT_ROOT = process.cwd();
const scriptPath = resolve(PROJECT_ROOT, 'scripts/check-schema-drift.sh');
const typesDir = resolve(PROJECT_ROOT, 'types');
const typesFilePath = resolve(typesDir, 'supabase.ts');
const generateTypesScriptPath = resolve(PROJECT_ROOT, 'scripts/generate-supabase-types.sh');

const execOpts: ExecSyncOptionsWithStringEncoding = {
  cwd: PROJECT_ROOT,
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

describe('check-schema-drift.sh Unit Tests', () => {
  let initialTypesFileExisted: boolean = false;
  let originalTypesFileContentBeforeTestSuite: string | null = null;

  beforeAll(async () => {
    initialTypesFileExisted = existsSync(typesFilePath);
    if (initialTypesFileExisted) {
      try {
        originalTypesFileContentBeforeTestSuite = readFileSync(typesFilePath, 'utf-8');
      } catch (e: any) {
        console.warn(`Unit Test Global Setup: Could not read initial ${typesFilePath}. Error: ${e.message}`);
      }
    }
    if (!existsSync(typesDir)) {
      mkdirSync(typesDir, { recursive: true });
    }
    console.log('Unit Test Global Setup: Initial generation of types/supabase.ts...');
    try {
      execSync(`bash ${generateTypesScriptPath}`, execOpts);
    } catch (error: any) {
      console.error("Unit Test Global Setup FAILED. Stdout:", error.stdout, "Stderr:", error.stderr);
      throw error;
    }
  }, 120000);

  beforeEach(async () => {
    // While individual tests will do explicit setup, a beforeEach can establish a common baseline
    // or ensure the file exists if a test doesn't explicitly delete-then-create.
    // console.log(`Unit Test beforeEach: Attempting re-sync of ${typesFilePath}...`);
    // For now, let individual tests manage the file state completely for check-schema-drift tests
    // to avoid potential interference if generateTypesScriptPath is flaky here.
    // If generateTypesScriptPath were perfectly reliable, this would be the main place.
  });

  afterAll(async () => {
    if (initialTypesFileExisted && originalTypesFileContentBeforeTestSuite !== null) {
      console.log('Unit Test Global Teardown: Restoring types/supabase.ts to its pre-suite state...');
      writeFileSync(typesFilePath, originalTypesFileContentBeforeTestSuite, 'utf-8');
    } else if (!initialTypesFileExisted && existsSync(typesFilePath)) {
      console.log(`Unit Test Global Teardown: ${typesFilePath} created by tests. Removing.`);
       try { rmSync(typesFilePath); } catch(e) { console.warn(`Failed to remove ${typesFilePath} in teardown.`) }
    }
  }, 60000);

  test('script file exists and is executable', () => {
    const stats = statSync(scriptPath);
    expect(stats.isFile()).toBe(true);
    expect(stats.mode & 0o111, 'Script should be executable').toBeTruthy();
  });

  test('script should report no drift when types are in sync', async () => {
    let output = '';
    let errorOutputIfScriptFails = '';
    let executionError: Error | null = null;

    console.log("Unit Test 'no drift': Explicitly re-generating types/supabase.ts...");
    try {
      if (existsSync(typesFilePath)) {
        rmSync(typesFilePath);
      }
      execSync(`bash ${generateTypesScriptPath}`, execOpts);
      
      if (!existsSync(typesFilePath) || readFileSync(typesFilePath, 'utf-8').trim().length < 50) {
        const content = existsSync(typesFilePath) ? readFileSync(typesFilePath, 'utf-8') : "File does not exist.";
        throw new Error(`Unit Test 'no drift' setup: ${generateTypesScriptPath} failed to create a substantial ${typesFilePath}. Content: ${content.substring(0,100)}`);
      }
      const regeneratedContent = readFileSync(typesFilePath, 'utf-8');
      if (regeneratedContent.includes("DeliberateDrift")) {
          throw new Error(`Unit Test 'no drift' setup: ${typesFilePath} contains drift content after regeneration attempt.`);
      }
      console.log(`Unit Test 'no drift': ${typesFilePath} explicitly re-synced and verified (Node.js).`);
      shellSleep(1); // More significant pause
    } catch (setupError: any) {
      console.error("Unit Test 'no drift' FAILED during setup. Error:", setupError.message, "Stdout:", setupError.stdout, "Stderr:", setupError.stderr);
      throw setupError;
    }

    try {
      output = execSync(`bash ${scriptPath}`, execOpts);
    } catch (error: any) {
        executionError = error;
        output = error.stdout || '';
        errorOutputIfScriptFails = error.stderr || '';
        console.error("Unit Test 'no drift': check-schema-drift.sh executionError. Status:", error.status);
        console.error("Unit Test 'no drift': Script STDOUT:", output);
        console.error("Unit Test 'no drift': Script STDERR:", errorOutputIfScriptFails);
    }
    expect(executionError, `Script should exit successfully. Exit: ${((executionError||{})as any)?.status}. Stderr: ${errorOutputIfScriptFails}. Stdout: ${output}`).toBeNull();
    expect(output).toContain('✅ No schema drift detected');
  }, 120000); // Increased timeout

  test('script should report drift when types are modified', async () => {
    let output = '';
    let errorOutputIfScriptFails = '';
    let executionError: Error | null = null;
    
    console.log(`Unit Test 'drift': Ensuring ${typesFilePath} is fresh before modification...`);
    let contentBeforeThisTestModification = "";
    try {
        execSync(`bash ${generateTypesScriptPath}`, execOpts); // Fresh baseline
        contentBeforeThisTestModification = readFileSync(typesFilePath, 'utf-8');
         if (contentBeforeThisTestModification.trim().length < 50) {
            throw new Error(`Unit Test 'drift' setup: Pre-modification sync failed to create a substantial ${typesFilePath}.`);
        }
    } catch (syncError: any) {
        console.error("Unit Test 'drift' FAILED during pre-modification sync. Stdout:", syncError.stdout, "Stderr:", syncError.stderr);
        throw syncError;
    }

    const knownDriftContent = `// Unit Test: This is known different content for drift.\n// Timestamp: ${new Date().toISOString()}\nexport type ThisIsADeliberateDriftForUnitTests = {};\n`;
    try {
        writeFileSync(typesFilePath, knownDriftContent, 'utf-8');
        console.log(`Unit Test 'drift': Overwritten ${typesFilePath} with known drift content.`);
        
        const readBackContent = readFileSync(typesFilePath, 'utf-8');
        if (!readBackContent.includes("ThisIsADeliberateDriftForUnitTests")) {
            throw new Error("Unit Test 'drift': File modification verification by Node.js read failed.");
        }
        console.log('Unit Test \'drift\': Modification verified by Node.js readFileSync.');
        shellSleep(1); // More significant pause
    } catch (writeError: any) {
        console.error(`Unit Test 'drift': Failed to write or verify drift content.`, writeError);
        throw writeError;
    }

    try {
      output = execSync(`bash ${scriptPath}`, execOpts);
      console.error("Unit Test 'drift' FAIL: Script unexpectedly exited 0. STDOUT:", output);
    } catch (error: any) {
        executionError = error;
        output = error.stdout || '';
        errorOutputIfScriptFails = error.stderr || '';
    }
    
    expect(executionError, "Script should exit with non-zero status for drift.").not.toBeNull();
    if (executionError && 'status' in executionError) {
        expect((executionError as any).status, "Exit code should be 1 for drift").toBe(1);
    }
    const combinedOutput = output + errorOutputIfScriptFails;
    expect(combinedOutput).toContain('🚨 Schema drift detected!');
  }, 120000); // Increased timeout
});