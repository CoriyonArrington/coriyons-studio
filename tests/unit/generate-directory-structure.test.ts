// tests/unit/generate-directory-structure.test.ts
import { statSync, existsSync, rmSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { test, expect, describe, beforeAll, afterAll } from 'vitest';
import { execSync, exec } from 'child_process'; // exec for potentially non-blocking if needed

const PROJECT_ROOT = process.cwd();
const scriptPath = resolve(PROJECT_ROOT, 'scripts/generate-directory-structure.sh');
const reportsDir = resolve(PROJECT_ROOT, 'reports');
const jsonOutputFilePath = resolve(reportsDir, 'component-structure.json');
const mdOutputFilePath = resolve(reportsDir, 'project-directory-tree.md');

describe('generate-directory-structure.sh Unit Tests', () => {
  beforeAll(() => {
    // Ensure the reports directory exists for the script to run, but clean potential old files
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    }
    if (existsSync(jsonOutputFilePath)) {
      rmSync(jsonOutputFilePath);
    }
    if (existsSync(mdOutputFilePath)) {
      rmSync(mdOutputFilePath);
    }
  });

  afterAll(() => {
    // Optional: Clean up generated files after all tests in this describe block run
    // if (existsSync(jsonOutputFilePath)) {
    //   rmSync(jsonOutputFilePath);
    // }
    // if (existsSync(mdOutputFilePath)) {
    //   rmSync(mdOutputFilePath);
    // }
    // if (existsSync(reportsDir) && readdirSync(reportsDir).length === 0) { // More complex cleanup
    //   rmdirSync(reportsDir);
    // }
  });

  test('script file exists and is executable', () => {
    const stats = statSync(scriptPath);
    expect(stats.isFile()).toBe(true);
    expect(stats.mode & 0o111, 'Script should be executable').toBeTruthy();
  });

  describe('Script Execution (Unit-like)', () => {
    let scriptOutput: string;
    let scriptErrorOutput: string;
    let executionError: Error | null = null;

    beforeAll(() => {
      try {
        // Note: This still runs the full script, including the 'tree' command if present.
        // For a PURE unit test, one might mock 'node' and 'tree' calls.
        // Given it's a shell script, testing its invocation is a common approach.
        scriptOutput = execSync(`bash ${scriptPath}`, {
          cwd: PROJECT_ROOT,
          encoding: 'utf-8',
        });
      } catch (error: any) {
        executionError = error; // Catch execution error to analyze stderr
        scriptOutput = error.stdout || '';
        scriptErrorOutput = error.stderr || '';
        console.error('Error executing script in beforeAll:', scriptErrorOutput);
      }
    }, 30000); // Timeout for script execution

    test('script executes without throwing an unhandled error', () => {
      // If the script exits with a non-zero status, execSync throws.
      // We are checking if 'executionError' was caught.
      // The script itself has 'set -e', so it will exit on internal failures.
      if (executionError) {
        console.error("Script execution failed. Stderr:\n", scriptErrorOutput);
        console.error("Stdout:\n", scriptOutput);
      }
      expect(executionError, `Script execution should not throw an unhandled error. Stderr: ${scriptErrorOutput}`).toBeNull();
    });

    test('script indicates successful JSON generation', () => {
      expect(scriptOutput).toContain('Component list JSON generated successfully.');
    });

    test('script attempts Markdown generation (even if tree command is missing)', () => {
      // The script will either say "Project directory tree saved" or "tree command not found"
      const successMsg = "Project directory tree saved as project-directory-tree.md";
      const warningMsg = "'tree' command not found";
      expect(scriptOutput.includes(successMsg) || scriptOutput.includes(warningMsg)).toBeTruthy();
    });

    // These checks are more like integration checks but are good for ensuring the unit of work (the script)
    // did what it was supposed to do regarding file creation.
    test('JSON output file should be created', () => {
        expect(existsSync(jsonOutputFilePath), `${jsonOutputFilePath} should exist.`).toBe(true);
    });

    test('Markdown output file should be created if tree command exists', () => {
        const treeExists = !scriptOutput.includes("'tree' command not found");
        if (treeExists) {
            expect(existsSync(mdOutputFilePath), `${mdOutputFilePath} should exist if tree command is present.`).toBe(true);
        } else {
            // If tree command doesn't exist, the file might not be created or might be empty except for title.
            // The script currently creates the file and adds title even if tree fails.
            expect(existsSync(mdOutputFilePath), `${mdOutputFilePath} should still exist (with title) even if tree command is not found.`).toBe(true);
        }
    });
  });
});