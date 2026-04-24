import { defineConfig, loadEnv } from 'vite';
import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

const nativeModules = ['better-sqlite3', 'bindings', 'file-uri-to-path'];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.GMAIL_CLIENT_ID': JSON.stringify(env.GMAIL_CLIENT_ID ?? ''),
      'process.env.GMAIL_CLIENT_SECRET': JSON.stringify(env.GMAIL_CLIENT_SECRET ?? ''),
    },
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
            cpSync(resolve('node_modules', mod), resolve('.vite/build/node_modules', mod), {
              recursive: true,
            });
          }
        },
      },
    ],
    resolve: {
      conditions: ['node'],
    },
  };
});
