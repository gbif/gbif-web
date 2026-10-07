// Production build of gbif.org with every endpoint pointed at the upstream mock. Output goes to
// dist/e2e so the regular build is left alone.

import { writeFileSync } from 'node:fs';
import { build } from 'vite';
import { computeStamp, STAMP_FILE } from './buildStamp.mjs';
import { E2E_ENV_DIR, GBIF_E2E_DIST, GBIF_PORT, mockEnv } from './env.mjs';

// Taken before building, so an edit made during the build marks the result stale.
const stamp = computeStamp();
Object.assign(process.env, mockEnv(`http://localhost:${GBIF_PORT}`));

/** @param {import('vite').InlineConfig} config */
function viteBuild(config) {
  // envDir: a developer's .env would otherwise bake their PUBLIC_* values into the build.
  return build({ configFile: 'gbif/vite.config.ts', envDir: E2E_ENV_DIR, ...config });
}

await viteBuild({ build: { ssrManifest: true, outDir: `${GBIF_E2E_DIST}/client` } });
await viteBuild({
  build: { outDir: `${GBIF_E2E_DIST}/server`, ssr: './src/gbif/entry.server.tsx' },
});
writeFileSync(STAMP_FILE, stamp + '\n');
