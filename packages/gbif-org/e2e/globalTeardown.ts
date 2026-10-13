// Runs once after all tests (playwright.config.ts globalTeardown), while the mock is still up.
// Prunes unused recordings under E2E_PRUNE=1, then fails the run if the mock logged any miss.

import { execFileSync } from 'node:child_process';
import { MOCK_PORT } from './env.mjs';

const MOCK = `http://localhost:${MOCK_PORT}`;

// Tests in the whole suite that are meant to run: what an unfiltered run would start. --list loads
// the specs without starting servers or running anything. Tests marked skip or fixme never start,
// so they are not counted.
function suiteSize(): number {
  const out = execFileSync('npx', ['playwright', 'test', '--list', '--reporter=json'], {
    encoding: 'utf8',
    // With these set, the JSON reporter writes to a file instead of stdout.
    env: {
      ...process.env,
      PLAYWRIGHT_JSON_OUTPUT_NAME: '',
      PLAYWRIGHT_JSON_OUTPUT_DIR: '',
      PLAYWRIGHT_JSON_OUTPUT_FILE: '',
    },
  });
  type Suite = { specs?: Array<{ tests: Array<{ expectedStatus: string }> }>; suites?: Suite[] };
  const count = (suite: Suite): number =>
    (suite.specs ?? []).reduce(
      (n, spec) => n + spec.tests.filter((t) => t.expectedStatus !== 'skipped').length,
      0
    ) + (suite.suites ?? []).reduce((n, child) => n + count(child), 0);
  return count({ suites: JSON.parse(out).suites });
}

// A miss is a request the mock had no recording for. When the browser makes such a request, it is
// tagged with the test that made it, and that test fails (test.ts). Requests from the gbif.org
// server, made while rendering a page, carry no tag, so no test fails for them. Failing the whole
// run here makes sure those misses are not ignored.
export default async function globalTeardown() {
  if (process.env.E2E_PRUNE === '1') {
    // The mock prunes only if this many distinct tests ran, so any filter on the run (spec files,
    // --grep, --project, sharding, ...) stops it without having to know how the run was filtered.
    const response = await fetch(`${MOCK}/__mock/prune?expected=${suiteSize()}`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error(`Prune refused: ${await response.text()}`);
    const removed: string[] = await response.json();
    console.log(`Pruned ${removed.length} unused recording(s)${removed.length ? ':' : '.'}`);
    for (const key of removed) console.log(`  ${key}`);
  }

  const misses: Array<{ key: string; reason: string; page?: string }> = await fetch(
    `${MOCK}/__mock/misses`
  ).then((r) => r.json());
  if (misses.length === 0) return;
  const list = misses
    .map((m) => `  ${m.key}  (page: ${m.page ?? 'server'}): ${m.reason}`)
    .join('\n');
  throw new Error(`${misses.length} upstream request(s) the mock could not answer:\n${list}`);
}
