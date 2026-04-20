import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['better-sqlite3', 'chokidar', 'node-cron'],
    },
  },
  resolve: {
    // Allow .ts imports in main process
    conditions: ['node'],
  },
});
