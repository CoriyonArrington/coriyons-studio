// tests/unit/verify-schema-types.test.ts
import { describe, test, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { writeFileSync, rmSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path'; // Added dirname

const PROJECT_ROOT = process.cwd();
const scriptPath = resolve(PROJECT_ROOT, 'scripts/verify-schema-types.sh');

// Dedicated temporary directory for this test's mock files
const testSessionDir = resolve(PROJECT_ROOT, 'tests/unit/temp-verify-schema-test');

// The script verify-schema-types.sh now expects "src/types/supabase.ts" relative to its CWD.
// So, we need to create this structure within testSessionDir.
const localTypesFilePathForTest = resolve(testSessionDir, 'src', 'types', 'supabase.ts');
const typesTestDirForScript = dirname(localTypesFilePathForTest); // This will be testSessionDir/src/types

const mockSupabaseBinDir = resolve(testSessionDir, 'mocks/bin');
const mockSupabaseScriptPath = resolve(mockSupabaseBinDir, 'supabase');
const originalPath = process.env.PATH;

// execOpts will run the script from testSessionDir.
// The script will look for "src/types/supabase.ts" relative to testSessionDir.
const execOpts: ExecSyncOptionsWithStringEncoding = {
  cwd: testSessionDir, 
  encoding: 'utf-8',
  stdio: 'pipe',
  env: { 
    ...process.env, 
    PATH: `${mockSupabaseBinDir}:${originalPath}`,
  } 
};

const mockRemoteTypesContent_A = "export type Json = string;\nexport type Database = { public: { Tables: { table_A: { Row: { id: string; } } } } };";
const mockRemoteTypesContent_B = "export type Json = number;\nexport type Database = { public: { Tables: { table_B: { Row: { id: number; } } } } };";


describe('verify-schema-types.sh Unit Tests (with Mocked Supabase CLI)', () => {
  beforeAll(() => {
    mkdirSync(mockSupabaseBinDir, { recursive: true });
    // Ensure the src/types directory structure exists within the test session directory
    mkdirSync(typesTestDirForScript, { recursive: true });
  });

  beforeEach(() => {
    // Clean up local types file (in our test specific dir) before each test
    if (existsSync(localTypesFilePathForTest)) {
      rmSync(localTypesFilePathForTest);
    }
    // Default mock supabase CLI: successful generation of mockRemoteTypesContent_A
    writeFileSync(mockSupabaseScriptPath, `#!/bin/bash\necho -n "${mockRemoteTypesContent_A}"\nexit 0`, { mode: 0o755 });
  });

  afterEach(() => {
    if (existsSync(localTypesFilePathForTest)) {
      rmSync(localTypesFilePathForTest);
    }
    if (existsSync(mockSupabaseScriptPath)) {
        rmSync(mockSupabaseScriptPath);
    }
  });

  test('should report no drift if local types match mock remote types', () => {
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_A, 'utf-8'); 
    
    let output = '';
    let executionError: Error | null = null;
    try {
      output = execSync(`bash ${scriptPath}`, execOpts);
    } catch (e: any) {
      executionError = e; 
      console.error("Unit No Drift - Error STDOUT:", e.stdout?.toString());
      console.error("Unit No Drift - Error STDERR:", e.stderr?.toString());
    }
    expect(executionError, "Script should succeed when types match").toBeNull();
    expect(output).toContain("✅ No schema drift detected.");
  });

  test('should report drift if local types differ from mock remote types', () => {
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_B, 'utf-8'); 

    let executionError: Error | null = null;
    let scriptStderr = '';
    try {
      execSync(`bash ${scriptPath}`, execOpts);
    } catch (e: any) {
      executionError = e;
      scriptStderr = (e as any).stderr?.toString() || '';
    }
    expect(executionError, "Script should fail with exit code 1 when types differ").not.toBeNull();
    if (executionError) expect((executionError as any).status).toBe(1);
    expect(scriptStderr).toContain("🚨 Schema drift DETECTED!");
    // Updated to check for the new path in the diff output
    expect(scriptStderr).toContain("--- src/types/supabase.ts"); 
  });

  test('should fail and instruct to generate if local types file is missing', () => {
    let executionError: Error | null = null;
    let scriptStderr = '';
    try {
      execSync(`bash ${scriptPath}`, execOpts);
    } catch (e: any) {
      executionError = e;
      scriptStderr = (e as any).stderr?.toString() || '';
    }
    expect(executionError, "Script should fail if local types file is missing").not.toBeNull();
    if (executionError) expect((executionError as any).status).toBe(1);
    // Updated to check for the new path in the error message
    expect(scriptStderr).toContain("Local types file 'src/types/supabase.ts' not found");
  });

  test('should fail if mock remote type generation (temp file) is empty', () => {
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_A, 'utf-8'); 
    writeFileSync(mockSupabaseScriptPath, `#!/bin/bash\necho -n ""\nexit 0`, { mode: 0o755 });
    
    let executionError: Error | null = null;
    let scriptStderr = '';
    try {
      execSync(`bash ${scriptPath}`, execOpts);
    } catch (e: any) {
      executionError = e;
      scriptStderr = (e as any).stderr?.toString() || '';
    }
    expect(executionError, "Script should fail if remote generation is empty").not.toBeNull();
    if (executionError) {
        expect((executionError as any).status).toBe(1); 
        expect(scriptStderr).toContain("CRITICAL: Failed to generate fresh remote types for comparison");
    }
  });

   test('should fail if mock remote type generation command fails (non-zero exit)', () => {
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_A, 'utf-8'); 
    writeFileSync(mockSupabaseScriptPath, `#!/bin/bash\necho "Mock CLI Error" >&2\nexit 7`, { mode: 0o755 });
    
    let executionError: Error | null = null;
    let scriptStderr = '';
    try {
      execSync(`bash ${scriptPath}`, execOpts);
    } catch (e: any) {
      executionError = e;
      scriptStderr = (e as any).stderr?.toString() || '';
    }
    expect(executionError, "Script should fail if remote generation command fails").not.toBeNull();
    if (executionError) {
      expect((executionError as any).status).toBe(1);
      expect(scriptStderr).toContain("CRITICAL: Failed to generate fresh remote types for comparison");
    }
  });
});