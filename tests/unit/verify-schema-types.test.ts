// tests/unit/verify-schema-types.test.ts
import { describe, test, expect, beforeAll, beforeEach, afterEach } from 'vitest';
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { writeFileSync, rmSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const scriptPath = resolve(PROJECT_ROOT, 'scripts/verify-schema-types.sh');

// Dedicated temporary directory for this test's types/supabase.ts to avoid conflicts
const testSessionDir = resolve(PROJECT_ROOT, 'tests/unit/temp-verify-schema-test');
const typesTestDir = resolve(testSessionDir, 'types'); // The script expects 'types/supabase.ts' relative to CWD
const localTypesFilePathForTest = resolve(typesTestDir, 'supabase.ts');

const mockSupabaseBinDir = resolve(testSessionDir, 'mocks/bin');
const mockSupabaseScriptPath = resolve(mockSupabaseBinDir, 'supabase');
const originalPath = process.env.PATH;

// execOpts will run the script from testSessionDir and use a PATH that prioritizes our mock supabase
const execOpts: ExecSyncOptionsWithStringEncoding = {
  cwd: testSessionDir, // Run script from here so "types/supabase.ts" resolves to our test-specific one
  encoding: 'utf-8',
  stdio: 'pipe',
  env: { 
    ...process.env, 
    PATH: `${mockSupabaseBinDir}:${originalPath}`,
    // Override SUPABASE_PROJECT_REF if script uses it and you want to ensure mock uses it
    // SUPABASE_PROJECT_REF: "mock_project_ref" 
  } 
};

const mockRemoteTypesContent_A = "export type Json = string;\nexport type Database = { public: { Tables: { table_A: { Row: { id: string; } } } } };";
const mockRemoteTypesContent_B = "export type Json = number;\nexport type Database = { public: { Tables: { table_B: { Row: { id: number; } } } } };";


describe('verify-schema-types.sh Unit Tests (with Mocked Supabase CLI)', () => {
  beforeAll(() => {
    mkdirSync(mockSupabaseBinDir, { recursive: true });
    mkdirSync(typesTestDir, { recursive: true });
  });

  beforeEach(() => {
    // Clean up local types file (in our test specific dir) before each test
    if (existsSync(localTypesFilePathForTest)) {
      rmSync(localTypesFilePathForTest);
    }
    // Default mock supabase CLI: successful generation of mockRemoteTypesContent_A
    // This mock will be called by verify-schema-types.sh for its *temporary remote file generation*.
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
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_A, 'utf-8'); // Local types match remote mock
    
    let output = '';
    let executionError: Error | null = null;
    try {
      // The script verify-schema-types.sh will internally use LOCAL_TYPES_FILE="types/supabase.ts"
      // Since we set cwd to testSessionDir, this will resolve to tests/unit/temp-verify-session/types/supabase.ts
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
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_B, 'utf-8'); // Local types differ

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
    expect(scriptStderr).toContain("--- types/supabase.ts"); // Check that it's diffing the correct local file path
  });

  test('should fail and instruct to generate if local types file is missing', () => {
    // localTypesFilePathForTest is already removed by beforeEach and not recreated for this test
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
    expect(scriptStderr).toContain("Local types file 'types/supabase.ts' not found");
  });

  test('should fail if mock remote type generation (temp file) is empty', () => {
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_A, 'utf-8'); // Local types exist
    // Mock supabase CLI to output nothing for its temporary remote generation
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
    writeFileSync(localTypesFilePathForTest, mockRemoteTypesContent_A, 'utf-8'); // Local types exist
    // Mock supabase CLI to exit non-zero
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