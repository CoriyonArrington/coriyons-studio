// tests/integration/update-supabase-types.integration.test.ts
import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest'; // Ensure all Vitest globals used are imported
import { execSync, ExecSyncOptionsWithStringEncoding } from 'child_process';
import { readFileSync, rmSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const scriptPath = resolve(PROJECT_ROOT, 'scripts/update-supabase-types.sh');
const typesDirPath = resolve(PROJECT_ROOT, 'types');
const outputFilePath = resolve(typesDirPath, 'supabase.ts');

const execOpts: ExecSyncOptionsWithStringEncoding = {
  cwd: PROJECT_ROOT,
  encoding: 'utf-8',
  stdio: 'pipe'
};

describe('update-supabase-types.sh Integration Test', () => {
  let initialContent: string | null = null;
  let fileExistedInitially: boolean = false;

  beforeAll(() => { 
    fileExistedInitially = existsSync(outputFilePath);
    if (fileExistedInitially) {
      try {
        initialContent = readFileSync(outputFilePath, 'utf-8');
      } catch (e) {
        console.warn(`update-supabase-types.integration.test: Could not read initial content of ${outputFilePath}`);
        initialContent = null; 
      }
    }
    if (!existsSync(typesDirPath)) {
      mkdirSync(typesDirPath, { recursive: true });
    }
  });

  afterAll(() => { 
    if (fileExistedInitially && initialContent !== null) {
      console.log(`Integration Teardown (update-supabase-types): Restoring ${outputFilePath} to its initial state.`);
      writeFileSync(outputFilePath, initialContent, 'utf-8');
    } else if (!fileExistedInitially && existsSync(outputFilePath)) {
      console.log(`Integration Teardown (update-supabase-types): ${outputFilePath} was created by test. Leaving it as is.`);
      // rmSync(outputFilePath); //  Decided to leave it if created and no prior state.
    }
  });

  // Clean before this specific test to ensure script creates it
  beforeEach(() => {
      if (existsSync(outputFilePath)) {
          rmSync(outputFilePath);
      }
  });

  test('should run successfully and create a non-empty types file', () => {
    let scriptStdout = '';
    let scriptStderr = ''; // To capture stderr as well
    let executionError: Error | null = null;

    try {
      console.log(`Running script for integration test: bash ${scriptPath}`);
      // Capture both stdout and stderr by not throwing on non-zero exit immediately
      const result = execSync(`bash ${scriptPath}`, {...execOpts, stdio: 'pipe'}); // stdio pipe is default in execOpts
      scriptStdout = result.toString(); 
    } catch (error: any) {
      executionError = error;
      scriptStdout = error.stdout?.toString() || '';
      scriptStderr = error.stderr?.toString() || '';
      console.error("update-supabase-types.sh script execution FAILED in test. Stdout:", scriptStdout, "Stderr:", scriptStderr);
    }

    expect(executionError, `Script should execute without error. Stderr: ${scriptStderr}`).toBeNull();
    expect(existsSync(outputFilePath), `${outputFilePath} should be created`).toBe(true);
    
    const content = readFileSync(outputFilePath, 'utf8');
    expect(content.length, 'Output file should not be empty').toBeGreaterThan(100); 
    expect(content, 'Output file should contain common Supabase type fragments').toContain("export type Database");

    expect(scriptStdout).toContain("Types successfully updated and saved");
  }, 120000 * 2); // Generous timeout for multiple retries
});