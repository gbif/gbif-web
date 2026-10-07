// Production builds of gbif.org and the hosted-portal library with every endpoint pointed at the
// upstream mock. Output goes to dist/e2e so the regular builds are left alone.
// `node e2e/build.mjs gbif|hp` builds one; no argument builds both.

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'vite';
import { computeStamp, stampFile } from './buildStamp.mjs';
import { E2E_ENV_DIR, GBIF_E2E_DIST, GBIF_PORT, HP_E2E_DIST, HP_PORT, mockEnv } from './env.mjs';

const targets = process.argv[2] ? [process.argv[2]] : ['gbif', 'hp'];

// Taken before building, so an edit made during the build marks the result stale.
const stamp = computeStamp();

/** @param {string} configFile @param {number} port @param {import('vite').InlineConfig} config */
function viteBuild(configFile, port, config) {
  Object.assign(process.env, mockEnv(`http://localhost:${port}`));
  // envDir: a developer's .env would otherwise bake their PUBLIC_* values into the build. Absolute,
  // since hp/vite.config.ts sets root to hp/.
  return build({ configFile, envDir: resolve(E2E_ENV_DIR), ...config });
}

if (targets.includes('gbif')) {
  await viteBuild('gbif/vite.config.ts', GBIF_PORT, {
    build: { ssrManifest: true, outDir: `${GBIF_E2E_DIST}/client` },
  });
  await viteBuild('gbif/vite.config.ts', GBIF_PORT, {
    build: { outDir: `${GBIF_E2E_DIST}/server`, ssr: './src/gbif/entry.server.tsx' },
  });
  writeFileSync(stampFile(GBIF_E2E_DIST), stamp + '\n');
}

if (targets.includes('hp')) {
  await viteBuild('hp/vite.config.ts', HP_PORT, { build: { outDir: resolve(HP_E2E_DIST) } });
  writeFileSync(stampFile(HP_E2E_DIST), stamp + '\n');
}
