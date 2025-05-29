// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); // This resolves to your project root directory

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['./vitest-setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'), // Corrected: Maps '@/' to the project root directory
    },
  },
});