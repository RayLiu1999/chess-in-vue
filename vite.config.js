import { fileURLToPath, URL } from 'node:url';
import svgLoader from 'vite-svg-loader';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3001,
    fs: {
      strict: false,
    },
  },
  optimizeDeps: {
    exclude: ['stockfish.js'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          stockfish: ['stockfish.js'],
        },
      },
    },
  },
  worker: {
    format: 'es',
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
