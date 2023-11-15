import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  envPrefix: 'PUBLIC_',
  plugins: [react()],
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
