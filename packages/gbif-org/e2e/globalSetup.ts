// Runs once before any test (playwright.config.ts globalSetup). Refuses to start when the e2e build
// is missing or older than the source, compared by the fingerprint build.mjs wrote (buildStamp.mjs).

import { existsSync, readFileSync } from 'node:fs';
import { computeStamp, stampFile } from './buildStamp.mjs';
import { GBIF_E2E_DIST, HP_E2E_DIST } from './env.mjs';

export default function globalSetup() {
  const stamp = computeStamp();
  for (const dist of [GBIF_E2E_DIST, HP_E2E_DIST]) {
    const file = stampFile(dist);
    if (!existsSync(file)) {
      throw new Error(`No e2e build in ${dist}. Run npm run e2e:build first.`);
    }
    // Testing an old build after editing src/ would report on code that is no longer there.
    if (readFileSync(file, 'utf8').trim() !== stamp) {
      throw new Error(`The e2e build in ${dist} is older than the source. Run npm run e2e:build.`);
    }
  }
}
