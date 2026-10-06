import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { GBIF_E2E_DIST } from './env.mjs';

export default function globalSetup() {
  if (!existsSync(join(GBIF_E2E_DIST, 'server', 'entry.server.js'))) {
    throw new Error(`No e2e build in ${GBIF_E2E_DIST}. Run npm run e2e:build first.`);
  }
}
