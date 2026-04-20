import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'frontend',
    environment: 'jsdom',
    include: ['src/renderer/**/*.test.{ts,tsx}'],
  },
});
