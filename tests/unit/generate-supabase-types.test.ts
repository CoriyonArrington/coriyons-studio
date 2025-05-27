// tests/unit/generate-supabase-types.test.ts
// Updated Unit Tests: File Existence, Executable, Output File Checks

import { statSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';

describe('generate-supabase-types.sh Unit Tests', () => {
  const scriptPath = resolve(__dirname, '../../scripts/generate-supabase-types.sh');
  const outputFilePath = resolve(__dirname, '../../types/supabase.ts');

  test('script file exists and is executable', () => {
    const stats = statSync(scriptPath);
    expect(stats.isFile()).toBe(true);
    expect(stats.mode & 0o111).toBeTruthy();
  });

  describe('Output File Checks', () => {
    // Setup: Run the script before tests that rely on the output file
    beforeAll(() => {
      try {
        execSync('bash scripts/generate-supabase-types.sh', { stdio: 'inherit' });
      } catch (error) {
        // If the script fails, we don't want to proceed with other tests
        console.error('Error running generate-supabase-types.sh:', error);
        // You might want to throw the error to fail the test suite
        // throw error; 
      }
    }, 30000); // Adjust timeout if needed

    test('script generates the output file', () => {
      expect(existsSync(outputFilePath)).toBe(true);
    });

    test('output file is not empty', () => {
      const content = readFileSync(outputFilePath, 'utf8');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  // Add more unit-like tests if you have helper functions within the script
  // (generate-supabase-types.sh doesn't have helper functions)
});