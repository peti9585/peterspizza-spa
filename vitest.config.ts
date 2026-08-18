import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    isolate: true,
    pool: 'forks',
    maxConcurrency: 1,
    coverage: {
      provider: 'v8'
    }
  }
});
