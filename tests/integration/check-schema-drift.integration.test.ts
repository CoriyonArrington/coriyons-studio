// tests/integration/check-schema-drift.integration.test.ts
import { config } from 'dotenv';
import { resolve } from 'path';
// Ensure .env is loaded if your scripts rely on env vars for Supabase CLI
config({ path: resolve(process.cwd(), '.env.local'), override: true });
config({ path: resolve(process.cwd(), '.env'), override: true });


import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const PROJECT_ROOT = process.cwd();
const checkScriptPath = resolve(PROJECT_ROOT, 'scripts/check-schema-drift.sh');
const generateScriptPath = resolve(PROJECT_ROOT, 'scripts/generate-supabase-types.sh');
const typesFilePath = resolve(PROJECT_ROOT, 'types/supabase.ts');

const execOpts: ExecSyncOptionsWithStringEncoding = {
  cwd: PROJECT_ROOT,
  env: { ...process.env }, // Pass environment
  encoding: 'utf-8',
  stdio: 'pipe' // Pipe stdio to capture output and prevent interactive prompts
};

describe('check-schema-drift.sh Integration Test', () => {
  let originalTypesContent: string | null = null;
  let typesFileExistedBeforeTest: boolean = false;

  beforeAll(() => {
    typesFileExistedBeforeTest = existsSync(typesFilePath);
    if (typesFileExistedBeforeTest) {
        try {
            originalTypesContent = readFileSync(typesFilePath, 'utf-8'); // Store original
        } catch (e) {
            console.warn(`Could not read original types file at ${typesFilePath}, though it exists. This might indicate a permissions issue or a race condition if another process deleted it. Error: ${e}`);
            originalTypesContent = null; // Ensure it's null if read fails
        }
    } else {
        originalTypesContent = null; // File didn't exist, so nothing to restore to specifically.
    }

    console.log('Integration Test Setup: Running generate-supabase-types.sh to ensure baseline...');
    try {
        execSync(`bash ${generateScriptPath}`, execOpts);
    } catch (error: any) {
        console.error("Integration Test Setup FAILED to run generate-supabase-types.sh:", error.stdout, error.stderr);
        throw error; // Fail fast if setup can't complete
    }
  }, 90000); // Extra long timeout for potential type generation

  afterAll(() => {
      if (originalTypesContent !== null) {
          console.log('Integration Test Teardown: Restoring original types/supabase.ts...');
          writeFileSync(typesFilePath, originalTypesContent);
      } else if (typesFileExistedBeforeTest) {
          // Original content was null (e.g. read error), but file existed.
          // This is an ambiguous state. For safety, we might not want to delete.
          // Or, if we know generateScriptPath creates it, and it was unreadable, this is tricky.
          // For now, let's assume if originalTypesContent is null, we don't try to restore.
          console.log(`Integration Test Teardown: Original types file content was not captured, or file was unreadable. Current types/supabase.ts left as is.`);
      } else {
          // File didn't exist before tests and originalTypesContent is null.
          // If tests created it, we might want to remove it, but for now, let's leave it.
          console.log('Integration Test Teardown: types/supabase.ts likely created by tests, leaving as is.');
      }
  });

  it('should run successfully and report no drift after syncing types', () => {
    let scriptOutput = '';
    let scriptError = ''; // stderr from the script itself
    let executionError: Error | null = null;

    // Ensure types are fresh right before this test, matching generateScriptPath's behavior
    try {
        console.log('No-Drift Test: Ensuring types/supabase.ts is freshly synced...');
        execSync(`bash ${generateScriptPath}`, execOpts);
    } catch (syncError: any) {
        console.error("No-Drift Test: Failed to re-sync types for no-drift check:", syncError.stdout, syncError.stderr);
        throw syncError;
    }

    try {
      scriptOutput = execSync(`bash ${checkScriptPath}`, execOpts);
    } catch (error: any) {
      executionError = error; // This will be populated if script exits non-zero
      scriptOutput = error.stdout || '';
      scriptError = error.stderr || ''; // Stderr from the script process
      // Log details if an unexpected error occurs
      console.error("No-Drift Test: executionError occurred. Status:", error.status);
      console.error("No-Drift Test: Script STDOUT:", scriptOutput);
      console.error("No-Drift Test: Script STDERR:", scriptError);
    }

    expect(executionError, `Script should succeed when types are in sync. Exit status: ${(executionError as any)?.status}. Stderr: ${scriptError}. Stdout: ${scriptOutput}`).toBeNull();
    expect(scriptOutput, "Script should report 'No schema drift detected'").toContain('✅ No schema drift detected');
  }, 60000);

  it('should report drift and exit non-zero if types file is modified', () => {
    let scriptOutput = '';
    let scriptError = '';
    let executionError: Error | null = null;

    // Step 1: Ensure types/supabase.ts is in a known, synced state first.
    try {
        console.log('Drift Test: Ensuring types/supabase.ts is freshly synced before modification...');
        execSync(`bash ${generateScriptPath}`, execOpts);
    } catch (syncError: any) {
        console.error("Drift Test: Failed to re-sync types prior to modification:", syncError.stdout, syncError.stderr);
        throw syncError;
    }

    // Step 2: Modify the types file with completely known, different content.
    const knownDriftContent = `// This is known different content to GUARANTEE drift.\n// Timestamp: ${new Date().toISOString()}\nexport type DeliberateDriftEnsured = {};\n`;
    try {
        writeFileSync(typesFilePath, knownDriftContent, 'utf-8');
        console.log(`Integration Test: Overwritten ${typesFilePath} with known distinct drift content.`);
        // Optional: Read back and verify immediately if extreme paranoia is needed
        // const tempRead = readFileSync(typesFilePath, 'utf-8');
        // if (tempRead !== knownDriftContent) {
        //   throw new Error("Modification did not stick immediately!");
        // }
    } catch(e) {
        throw new Error(`Failed to write known drift content to types file for drift test: ${e}`);
    }

    // Step 3: Run the drift check - it should now detect drift and fail (exit non-zero)
    try {
        scriptOutput = execSync(`bash ${checkScriptPath}`, execOpts);
        // If execSync doesn't throw, it means script exited 0, which is a failure for this test.
        console.error("Drift Test FAIL: Script unexpectedly exited 0 (SUCCESS). STDOUT:", scriptOutput);
    } catch (error: any) {
        // We EXPECT an error here because the script should exit non-zero
        executionError = error;
        scriptOutput = error.stdout || '';
        scriptError = error.stderr || ''; // Stderr from the script process
    }

    expect(executionError, "Script should fail (exit non-zero) when drift is detected.").not.toBeNull();
    if (executionError && 'status' in executionError) {
      expect((executionError as any).status, "Script exit code should be 1 for drift").toBe(1);
    } else if (executionError) {
      // If status isn't present but there was an error, it's unusual but still an error
      console.warn("Drift Test: executionError occurred but 'status' property is missing.", executionError);
    }
    
    const combinedOutput = scriptOutput + scriptError; // check-schema-drift.sh prints its findings to stdout
    expect(combinedOutput, "Script should report 'Schema drift detected!'").toContain('🚨 Schema drift detected!');
    expect(combinedOutput, "Script should suggest running types:generate").toContain("Run 'npm run types:generate'");
  }, 60000);
});