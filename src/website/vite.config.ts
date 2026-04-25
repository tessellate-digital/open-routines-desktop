import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  ssgOptions: {
    script: 'async',
    dirStyle: 'nested',
    formatting: 'none',
  },
  build: {
    outDir: '../../docs',
    emptyOutDir: true,
    target: 'esnext',
    minify: 'esbuild',
    esbuildOptions: {
      drop: ['console'],
    },
    modulePreload: { polyfill: false },
    cssCodeSplit: true,
    rollupOptions: {
      treeshake: 'recommended',
      output: {
        manualChunks(id) {
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router')
          ) {
            return 'vendor';
          }
        },
      },
    },
  },
});
