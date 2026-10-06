import { existsSync, readFileSync } from 'node:fs';
import { computeStamp, STAMP_FILE } from './buildStamp.mjs';
import { GBIF_E2E_DIST } from './env.mjs';

export default function globalSetup() {
  if (!existsSync(STAMP_FILE)) {
    throw new Error(`No e2e build in ${GBIF_E2E_DIST}. Run npm run e2e:build first.`);
  }
  // Pruning deletes every recording the run did not use, so a filtered run would delete the rest.
  const cliArgs = process.argv.slice(process.argv.indexOf('test') + 1);
  if (process.env.E2E_PRUNE === '1' && cliArgs.length > 0) {
    throw new Error(`E2E_PRUNE needs a full run without arguments, got: ${cliArgs.join(' ')}`);
  }
  // Testing an old build after editing src/ would report on code that is no longer there.
  if (readFileSync(STAMP_FILE, 'utf8').trim() !== computeStamp()) {
    throw new Error('The e2e build is older than the source. Run npm run e2e:build.');
  }
}
