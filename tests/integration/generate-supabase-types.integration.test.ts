// tests/integration/generate-supabase-types.integration.test.ts
import { config } from 'dotenv';
config(); // Load .env variables

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync, rmSync } from 'fs'; // For file operations
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const scriptPath = resolve(PROJECT_ROOT, 'scripts/generate-supabase-types.sh');
const outputFilePath = resolve(PROJECT_ROOT, 'types/supabase.ts');

describe('generate-supabase-types.sh Integration Test', () => {
  // Clean up the output file before tests if it exists from a previous run
  beforeAll(() => {
    if (existsSync(outputFilePath)) {
      rmSync(outputFilePath);
    }
  });

  it('should run successfully, create a non-empty types file', () => {
    let scriptOutput = '';
    let scriptErrorOutput = '';

    // 1. Expect the script execution itself not to throw
    expect(() => {
      const result = execSync(`bash ${scriptPath}`, { 
        encoding: 'utf-8', // Get output as string
        env: process.env,
        cwd: PROJECT_ROOT 
      });
      scriptOutput = result; // Capture stdout
    }).not.toThrow();

    // 2. Verify the script's stdout indicates success (optional, but good)
    console.log('Script stdout:', scriptOutput);
    expect(scriptOutput).toContain('✅ Types saved to types/supabase.ts');
    expect(scriptOutput).toContain('✅ Supabase types generation complete');

    // 3. Verify the output file was created
    expect(existsSync(outputFilePath), `Output file ${outputFilePath} should exist`).toBe(true);

    // 4. Verify the output file is not empty
    const content = readFileSync(outputFilePath, 'utf8');
    expect(content.length, 'Output file should not be empty').toBeGreaterThan(0);

    // 5. (Optional) Basic check that it looks like a TS file
    expect(content, 'Output file should contain "export type Json" or similar common Supabase type declaration').toContain('export type Json'); 
    // Adjust the string above if needed based on your typical supabase.ts content
  }, 60000); // Increased timeout for potentially long-running script with network calls

  // Optional: Clean up after tests
  afterAll(() => {
    // if (existsSync(outputFilePath)) {
    //   rmSync(outputFilePath);
    // }
  });
});