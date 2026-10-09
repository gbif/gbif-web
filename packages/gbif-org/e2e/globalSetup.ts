import { existsSync, readFileSync } from 'node:fs';
import { computeStamp, stampFile } from './buildStamp.mjs';
import { GBIF_E2E_DIST, HP_E2E_DIST } from './env.mjs';

export default function globalSetup() {
  // Pruning deletes every recording the run did not use, so a filtered run would delete the rest.
  const cliArgs = process.argv.slice(process.argv.indexOf('test') + 1);
  if (process.env.E2E_PRUNE === '1' && cliArgs.length > 0) {
    throw new Error(`E2E_PRUNE needs a full run without arguments, got: ${cliArgs.join(' ')}`);
  }
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
