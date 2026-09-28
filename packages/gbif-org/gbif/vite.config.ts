import type { GetModuleInfo } from 'rollup';
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
export default defineConfig(({ command, isSsrBuild }) => {
  // Rollup would otherwise put the whole eager graph in one `routes` chunk that every lazy chunk
  // statically imports. Because that chunk also holds the lazy `import()` URLs, editing any single
  // page re-hashed it and cascaded into 30 of 60 chunks. Splitting the eager graph into stable
  // vendor/app buckets keeps the cascade to the edited page. Only modules reachable from an entry
  // through *static* imports are bucketed — bucketing a lazy-only module would drag it into the
  // initial payload. Do not give @radix-ui/react-icons their own bucket: it makes vendor circular.
  const eagerCache = new Map<string, boolean>();
  function isEager(id: string, getModuleInfo: GetModuleInfo, seen: Set<string>): boolean {
    const cached = eagerCache.get(id);
    if (cached !== undefined) return cached;
    if (seen.has(id)) return false; // cycle: this path proves nothing
    seen.add(id);
    const info = getModuleInfo(id);
    let eager = false;
    if (info?.isEntry) {
      eager = true;
    } else if (info) {
      eager = info.importers.some((importer) => isEager(importer, getModuleInfo, seen));
    }
    seen.delete(id);
    if (eager) eagerCache.set(id, true);
    return eager;
  }

  const config: UserConfig = {
    envPrefix: 'PUBLIC_',
    plugins: [react()],
    build: {
      emptyOutDir: true,
      sourcemap: true,
      outDir: './dist/gbif/client',
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          fallback: fileURLToPath(new URL('./fallback.html', import.meta.url)),
        },
        output: isSsrBuild
          ? undefined
          : {
              manualChunks(id, { getModuleInfo }) {
                if (!isEager(id, getModuleInfo, new Set())) return;

                if (id.includes('node_modules')) {
                  if (id.includes('node_modules/highcharts')) return 'vendor-highcharts';
                  if (
                    /node_modules\/(react|react-dom|scheduler|use-sync-external-store)\//.test(id)
                  )
                    return 'vendor-react';
                  if (/node_modules\/(react-router|react-router-dom|@remix-run)\//.test(id))
                    return 'vendor-router';
                  return 'vendor';
                }

                if (/\/src\/gql\//.test(id)) return 'app-gql';
                if (/\/src\/(components|utils|hooks|contexts|dataManagement|enums)\//.test(id))
                  return 'app-shared';
              },
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
