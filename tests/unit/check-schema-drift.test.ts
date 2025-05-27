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

describe('check-schema-drift.sh Unit Tests', () => {
  let initialTypesFileExisted: boolean = false;
  let originalTypesFileContentBeforeTestSuite: string | null = null;

  beforeAll(async () => { // Changed to async to potentially accommodate delays if needed, though not used yet
    initialTypesFileExisted = existsSync(typesFilePath);
    if (initialTypesFileExisted) {
      try {
        originalTypesFileContentBeforeTestSuite = readFileSync(typesFilePath, 'utf-8');
      } catch (e) {
        console.warn(`Unit Test Global Setup: Could not read initial types/supabase.ts. Error: ${e}`);
      }
    }

    if (!existsSync(typesDir)) {
      console.log(`Unit Test Global Setup: Creating directory ${typesDir}`);
      mkdirSync(typesDir, { recursive: true });
    }
    try {
      console.log('Unit Test Global Setup: Initial generation of types/supabase.ts...');
      execSync(`bash ${generateTypesScriptPath}`, execOpts);
    } catch (error: any) {
      console.error("Unit Test Global Setup FAILED to run generate-supabase-types.sh:", error.stdout, error.stderr);
      throw error;
    }
  }, 90000); // Increased timeout

  // beforeEach will attempt to sync, but individual tests might need to be more robust
  beforeEach(async () => { // Changed to async
    try {
      // console.log(`Unit Test beforeEach: Re-syncing ${typesFilePath}...`);
      execSync(`bash ${generateTypesScriptPath}`, execOpts);
    } catch (error: any) {
      console.error(`Unit Test beforeEach FAILED to re-sync ${typesFilePath}. This might leave stale content. Error: ${error.message}
Stdout: ${error.stdout}
Stderr: ${error.stderr}`);
      // Do not re-throw here to see if individual test setup can recover or to see the test's specific failure
    }
  });

  afterAll(async () => { // Changed to async
    if (initialTypesFileExisted && originalTypesFileContentBeforeTestSuite !== null) {
      console.log('Unit Test Global Teardown: Restoring types/supabase.ts to its pre-suite state...');
      writeFileSync(typesFilePath, originalTypesFileContentBeforeTestSuite, 'utf-8');
    } else if (!initialTypesFileExisted && existsSync(typesFilePath)) {
      console.log('Unit Test Global Teardown: types/supabase.ts was created by tests. Removing it.');
      try {
        rmSync(typesFilePath);
      } catch (e) {
        console.warn(`Unit Test Global Teardown: Could not remove ${typesFilePath}. Error: ${e}`);
      }
    }
  }, 60000);


  test('script file exists and is executable', () => {
    const stats = statSync(scriptPath);
    expect(stats.isFile()).toBe(true);
    expect(stats.mode & 0o111, 'Script should be executable').toBeTruthy();
  });

  test('script should report no drift when types are in sync', async () => { // Changed to async
    let output = '';
    let errorOutputIfScriptFails = '';
    let executionError: Error | null = null;

    // ---- MOST CRITICAL CHANGE HERE for this test case ----
    // Force a fresh generation of types/supabase.ts for this specific test
    // to ensure it's not using stale content from a previous test (e.g., "drift" content).
    console.log("Unit Test 'no drift': Explicitly re-generating types/supabase.ts for utmost freshness...");
    try {
      // Ensure it's deleted first to prevent issues with overwriting locked/problematic files
      if (existsSync(typesFilePath)) {
        rmSync(typesFilePath);
      }
      execSync(`bash ${generateTypesScriptPath}`, execOpts); // Run the generation script
      // Verify it's created and not empty
      if (!existsSync(typesFilePath) || readFileSync(typesFilePath, 'utf-8').trim() === '') {
        // For debugging, print what generateTypesScriptPath outputted if it failed to create the file
        let genOutput = "";
        try { const genResult = execSync(`bash ${generateTypesScriptPath}`, {...execOpts, stdio: 'pipe'}); genOutput = genResult.toString(); } catch (e:any) { genOutput = e.stdout + e.stderr; }
        throw new Error(`Setup for 'no drift' test failed: ${generateTypesScriptPath} did not create a non-empty ${typesFilePath}. Generation output: ${genOutput}`);
      }
      console.log(`Unit Test 'no drift': ${typesFilePath} explicitly re-synced.`);
    } catch (setupError: any) {
      console.error("Unit Test 'no drift' FAILED during explicit re-sync setup:", setupError.message);
      // If setup fails here, the test should also fail. We throw to make it clear.
      // Vitest will catch this and report the test as failed.
      throw setupError;
    }
    // ---- END CRITICAL CHANGE ----

    try {
      output = execSync(`bash ${scriptPath}`, execOpts);
    } catch (error: any) {
        executionError = error;
        output = error.stdout || '';
        errorOutputIfScriptFails = error.stderr || '';
        console.error("Unit Test 'no drift': executionError occurred. Status:", error.status);
        console.error("Unit Test 'no drift': Script STDOUT:", output);
        console.error("Unit Test 'no drift': Script STDERR:", errorOutputIfScriptFails);
    }
    expect(executionError, `Script should exit successfully when no drift. Status: ${(executionError as any)?.status}. Script stderr: ${errorOutputIfScriptFails}. Script stdout: ${output}`).toBeNull();
    expect(output, "Script should report 'No schema drift detected'").toContain('✅ No schema drift detected');
  }, 90000); // Increased timeout for this test due to extra generation step


  test('script should report drift when types are modified', async () => { // Changed to async
    let output = '';
    let errorOutputIfScriptFails = '';
    let executionError: Error | null = null;

    // types/supabase.ts is freshly synced by beforeEach.
    const contentBeforeThisTestModification = readFileSync(typesFilePath, 'utf-8');

    const knownDriftContent = `// Unit Test: This content is deliberately different to ensure drift.\n// Timestamp: ${new Date().toISOString()}\nexport type ThisIsADeliberateDriftForUnitTests = {};\n`;
    try {
        console.log(`Unit Test 'drift': Overwriting ${typesFilePath} with known distinct drift content.`);
        writeFileSync(typesFilePath, knownDriftContent, 'utf-8');
    } catch (writeError) {
        console.error(`Unit Test 'drift': Failed to overwrite ${typesFilePath} with drift content.`, writeError);
        throw writeError;
    }

    try {
      output = execSync(`bash ${scriptPath}`, execOpts);
      console.error("Unit Test 'drift' FAIL: Script unexpectedly exited 0 (SUCCESS). STDOUT:", output);
    } catch (error: any) {
        executionError = error;
        output = error.stdout || '';
        errorOutputIfScriptFails = error.stderr || '';
    } finally {
      // Restore to the state before this specific test's modification
      // (which should be the fresh types from beforeEach)
      // console.log(`Unit Test 'drift': Restoring ${typesFilePath} to its pre-modification state for this test.`);
      writeFileSync(typesFilePath, contentBeforeThisTestModification, 'utf-8');
    }

    expect(executionError, "Script should exit with non-zero status when drift is detected (i.e., an error object should be present).").not.toBeNull();
    if (executionError && 'status' in executionError) {
        expect((executionError as any).status, "Exit code should be 1 for drift").toBe(1);
    }
    
    const combinedOutput = output + errorOutputIfScriptFails;
    expect(combinedOutput, "Script output should report 'Schema drift detected'").toContain('🚨 Schema drift detected!');
  }, 60000);
});