// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Use the default include pattern or a very broad one for the root
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'], // Vitest default
    // Or even just: include: ['*.test.ts'],
    root: resolve(__dirname),
  },
});