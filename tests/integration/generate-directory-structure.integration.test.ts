// tests/integration/generate-directory-structure.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const scriptPath = resolve(PROJECT_ROOT, 'scripts/generate-directory-structure.sh');
const reportsDir = resolve(PROJECT_ROOT, 'reports');
const jsonOutputFilePath = resolve(reportsDir, 'component-structure.json');
const mdOutputFilePath = resolve(reportsDir, 'project-directory-tree.md');

// Helper function to check if tree command is available on the system
const isTreeCommandAvailable = () => {
  try {
    execSync('command -v tree', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
};
const treeAvailable = isTreeCommandAvailable();

describe('generate-directory-structure.sh Integration Test', () => {
  beforeAll(() => {
    // Ensure reports directory exists and clean up old files
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    } else {
      if (existsSync(jsonOutputFilePath)) rmSync(jsonOutputFilePath);
      if (existsSync(mdOutputFilePath)) rmSync(mdOutputFilePath);
    }

    // Execute the script
    try {
      execSync(`bash ${scriptPath}`, { cwd: PROJECT_ROOT, encoding: 'utf-8', stdio: 'pipe' }); // stdio:pipe to suppress output unless debugging
    } catch (error: any) {
      console.error("Error running script in integration test beforeAll:", error.stdout, error.stderr);
      // We'll let the tests fail on file checks rather than throwing here
    }
  }, 30000); // Generous timeout

  afterAll(() => {
    // Clean up: Remove created files
    if (existsSync(jsonOutputFilePath)) rmSync(jsonOutputFilePath);
    if (existsSync(mdOutputFilePath)) rmSync(mdOutputFilePath);
    // Potentially remove reportsDir if empty, but be cautious
  });

  it('should create the component-structure.json file', () => {
    expect(existsSync(jsonOutputFilePath), `${jsonOutputFilePath} was not created`).toBe(true);
  });

  it('component-structure.json should be valid JSON and an array', () => {
    if (!existsSync(jsonOutputFilePath)) throw new Error('JSON file not found, prerequisite for this test.');
    const content = readFileSync(jsonOutputFilePath, 'utf8');
    expect(content.length, 'JSON file should not be empty').toBeGreaterThan(0);
    let jsonData;
    expect(() => { jsonData = JSON.parse(content); }, 'JSON file should contain valid JSON').not.toThrow();
    expect(Array.isArray(jsonData), 'JSON content should be an array').toBe(true);
    // You could add more specific checks, e.g., if jsonData[0] has a 'name' property,
    // but that depends on your project having components.
  });

  it('should create the project-directory-tree.md file', () => {
    expect(existsSync(mdOutputFilePath), `${mdOutputFilePath} was not created`).toBe(true);
  });

  it('project-directory-tree.md should not be empty and contain the title', () => {
    if (!existsSync(mdOutputFilePath)) throw new Error('Markdown file not found, prerequisite for this test.');
    const content = readFileSync(mdOutputFilePath, 'utf8');
    expect(content.length, 'Markdown file should not be empty').toBeGreaterThan(0);
    expect(content).toContain('# Project Directory Structure');
  });

  if (treeAvailable) {
    it('project-directory-tree.md should contain tree output if tree command is available', () => {
      if (!existsSync(mdOutputFilePath)) throw new Error('Markdown file not found, prerequisite for this test.');
      const content = readFileSync(mdOutputFilePath, 'utf8');
      expect(content).toContain('```'); // Check for the code block
      // A more robust check might look for specific directory names known to be in the tree.
      // This depends heavily on your project structure.
      // For example, expect(content).toContain('scripts/');
    });
  } else {
    it('project-directory-tree.md notes if tree command is missing (if script logs this to md)', () => {
      // The current script doesn't log "tree not found" to the MD file, only to stdout.
      // So, if tree is not available, the MD file will just have the title.
      // This test might need adjustment based on desired script behavior.
      console.warn("Tree command not available, Markdown content check will be minimal.");
      // No specific assertion here other than what's in 'should not be empty and contain the title'
      // unless you modify the script to write a placeholder if 'tree' isn't found.
      expect(true).toBe(true); // Placeholder if no specific assertion
    });
  }
});