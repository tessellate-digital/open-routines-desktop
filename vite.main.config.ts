import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

const nativeModules = ['better-sqlite3', 'bindings', 'file-uri-to-path'];

export default defineConfig({
  build: {
    codeSplitting: false,
    rollupOptions: {
      external: ['better-sqlite3'],
    },
  },
  plugins: [
    {
      name: 'copy-native-modules',
      closeBundle() {
        for (const mod of nativeModules) {
          cpSync(
            resolve('node_modules', mod),
            resolve('.vite/build/node_modules', mod),
            { recursive: true }
          );
        }
      },
    },
  ],
  resolve: {
    conditions: ['node'],
  },
});
