import react from '@vitejs/plugin-react-swc';
import { createRequire } from 'module';
import { fileURLToPath, URL } from 'url';
import { defineConfig, UserConfig } from 'vite';

// `queue-promise` does `require('events')`, which the browser doesn't have. We resolve `events`
// to the npm `events` polyfill (a transitive dep, API-compatible with Node's built-in) via a
// resolve alias. This replaces `vite-plugin-node-polyfills`, which set a global `esbuild.banner`
// that prepended a 75 KB shim to every transformed file's output during dev — adding ~9s to the
// SSR cold start (~895 source files × banner injection).
const eventsPolyfill = createRequire(import.meta.url).resolve('events/');

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config: UserConfig = {
    envPrefix: 'PUBLIC_',
    plugins: [react()],
    build: {
      emptyOutDir: true,
      outDir: './dist/gbif/client',
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          fallback: fileURLToPath(new URL('./fallback.html', import.meta.url)),
        },
      },
    },
    resolve: {
      alias: [
        { find: '@', replacement: fileURLToPath(new URL('../src', import.meta.url)) },
        { find: /^events$/, replacement: eventsPolyfill },
      ],
    },
  };

  if (command === 'build') {
    // Fixes some commonjs packages that are problematic on the server in prod mode
    // This will include the specified modules in the server bundle.
    // Vite does some processing that can increase compatibility with node modules compared to the native ESM resolution in node.
    // https://vite-plugin-ssr.com/broken-npm-package#solution
    // https://github.com/gbif/gbif-web/issues/579
    config.ssr = {
      noExternal: ['use-deep-compare-effect', 'isomorphic-dompurify'],
    };
  }

  return config;
});
