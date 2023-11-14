import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  root: 'gbif',
  build: {
    emptyOutDir: true,
    outDir: '../dist/gbif/client',
  },
  envDir: '../',
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('../src', import.meta.url)) }],
  },
});
