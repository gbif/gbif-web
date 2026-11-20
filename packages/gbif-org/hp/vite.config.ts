import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { resolveCommit } from '../gbif/config/buildInfo.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    // Hosted portals have no gbif.org server to hand them the commit, so it is baked in. Read by
    // src/utils/buildCommit.ts and sent to graphql-api as x-gbif-client-commit.
    __HP_BUILD_COMMIT__: JSON.stringify(resolveCommit() ?? ''),
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
    rollupOptions: {
      output: {
        // Hashed chunks go in assets/ so the deploy host can merge and age out that folder
        // without touching the stable-named entry files (gbif-lib.js, style.css).
        chunkFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
});
