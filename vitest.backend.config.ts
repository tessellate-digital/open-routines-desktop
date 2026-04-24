import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'backend',
    environment: 'node',
    include: ['src/main/**/*.test.{ts,tsx}', 'src/backend/**/*.test.{ts,tsx}'],
    setupFiles: ['src/test-setup/electron-mock.ts'],
  },
});
