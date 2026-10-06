// Production build of gbif.org with every endpoint pointed at the upstream mock. Output goes to
// dist/e2e so the regular build is left alone.

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { computeStamp, STAMP_FILE } from './buildStamp.mjs';
import { GBIF_E2E_DIST, GBIF_PORT, mockEnv } from './env.mjs';

/** @param {string} cmd @param {Record<string, string>} env */
function run(cmd, env) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
}

// Taken before building, so an edit made during the build marks the result stale.
const stamp = computeStamp();
const env = mockEnv(`http://localhost:${GBIF_PORT}`);
run(
  `npx vite build --config gbif/vite.config.ts --ssrManifest --outDir ${GBIF_E2E_DIST}/client`,
  env
);
run(
  `npx vite build --config gbif/vite.config.ts --outDir ${GBIF_E2E_DIST}/server --ssr ./src/gbif/entry.server.tsx`,
  env
);
writeFileSync(STAMP_FILE, stamp + '\n');
