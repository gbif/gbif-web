// Production builds of gbif.org and the hosted-portal library with every endpoint pointed at the
// upstream mock. Output goes to dist/e2e so regular builds are left alone.
// Usage: node e2e/build.mjs [gbif|hp]   (both when omitted)

import { execSync } from 'node:child_process';
import { GBIF_E2E_DIST, GBIF_PORT, HP_E2E_DIST, HP_PORT, mockEnv } from './env.mjs';

const targets = process.argv.slice(2);
const want = (t) => targets.length === 0 || targets.includes(t);

function run(cmd, env) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } });
}

if (want('gbif')) {
  const env = mockEnv(`http://localhost:${GBIF_PORT}`);
  run(
    `npx vite build --config gbif/vite.config.ts --ssrManifest --outDir ${GBIF_E2E_DIST}/client`,
    env
  );
  run(
    `npx vite build --config gbif/vite.config.ts --outDir ${GBIF_E2E_DIST}/server --ssr ./src/gbif/entry.server.tsx`,
    env
  );
}

if (want('hp')) {
  // hp/vite.config.ts sets root to hp/, so outDir is relative to that.
  run(
    `npx vite build --config hp/vite.config.ts --outDir ../${HP_E2E_DIST}`,
    mockEnv(`http://localhost:${HP_PORT}`)
  );
}
