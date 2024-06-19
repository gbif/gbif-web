import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

const PROBLEMATIC_COMMONJS_PACKAGES = [
  'use-deep-compare-effect',
  'isomorphic-dompurify',
];

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  envPrefix: 'PUBLIC_',
  plugins: [
    react(),
    // The queue-promise package uses the events module, which is not available in the browser. This plugin adds a polyfill for the events module.
    nodePolyfills({ include: ['events'] }),
    // Fixes some commonjs packages that are problematic on the server in dev mode
    viteCommonjs({
      include: PROBLEMATIC_COMMONJS_PACKAGES
    }),
  ],
  build: {
    emptyOutDir: true,
    outDir: './dist/gbif/client',
    rollupOptions: {
      input: fileURLToPath(new URL('./index.html', import.meta.url)),
    },
  },
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('../src', import.meta.url)) }],
  },
  ssr: {
    // Fixes some commonjs packages that are problematic on the server in prod mode
    // This will include the specified modules in the server bundle.
    // Vite does some processing that can increase compatibility with node modules compared to the native ESM resolution in node.
    // https://vite-plugin-ssr.com/broken-npm-package#solution
    // https://github.com/gbif/gbif-web/issues/579
    noExternal: PROBLEMATIC_COMMONJS_PACKAGES,
  },
});
