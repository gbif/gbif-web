// Runs once before any test (playwright.config.ts globalSetup). Refuses to start when the e2e build
// is missing or older than the source, compared by the fingerprint build.mjs wrote (buildStamp.mjs),
// and when E2E_PRUNE=1 is combined with arguments that run only some of the tests.

import { existsSync, readFileSync } from 'node:fs';
import { computeStamp, stampFile } from './buildStamp.mjs';
import { GBIF_E2E_DIST, HP_E2E_DIST } from './env.mjs';

// Pruning deletes every recording the run did not use, so a run limited to some tests would delete
// the recordings of all the others. Returns the arguments that limit the run: file or title
// filters, and flags such as --grep or --project. Harmless flags, e.g. --reporter dot, are skipped.
const FILTERS_WITH_VALUE = ['-g', '--grep', '--grep-invert', '--project', '--shard'];
const FILTERS = [...FILTERS_WITH_VALUE, '--last-failed', '--only-changed'];
const OTHERS_WITH_VALUE = [
  '--reporter',
  '--workers',
  '-j',
  '--retries',
  '--timeout',
  '-c',
  '--config',
];

function runFilters(args: string[]) {
  const filters: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const [flag] = args[i].split('=');
    if (!args[i].startsWith('-')) filters.push(args[i]);
    else if (FILTERS.includes(flag)) filters.push(args[i]);
    // Without "=", the flag's value is the next argument.
    if (FILTERS_WITH_VALUE.includes(args[i]) || OTHERS_WITH_VALUE.includes(args[i])) i++;
  }
  return filters;
}

export default function globalSetup() {
  if (process.env.E2E_PRUNE === '1') {
    const filters = runFilters(process.argv.slice(process.argv.indexOf('test') + 1));
    if (filters.length > 0) {
      throw new Error(`E2E_PRUNE needs a full run; these arguments limit it: ${filters.join(' ')}`);
    }
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
