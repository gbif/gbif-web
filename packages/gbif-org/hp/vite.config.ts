import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  envPrefix: 'PUBLIC_',
  envDir: '../',
  plugins: [
    react(),
    // The queue-promise package uses the events module, which is not available in the browser. This plugin adds a polyfill for the events module.
    nodePolyfills({ include: ['events'] }),
  ],
  root: 'hp',
  build: {
    emptyOutDir: true,
    outDir: '../dist/hp',
    lib: {
      entry: '../src/hp/entry.tsx',
      formats: ['es'],
      fileName: 'gbif-lib',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
});
