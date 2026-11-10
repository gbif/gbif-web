// Runs once after all tests (playwright.config.ts globalTeardown), while the mock is still up.
// Lists answers a record or refresh run did not save, prunes unused recordings under E2E_PRUNE=1,
// then fails the run if the mock logged any miss or an unsaved answer has no recording.

import { execFileSync } from 'node:child_process';
import { MOCK_PORT } from './env.ts';

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
// The mock logs each unsaved answer once, mid-run, where it is easy to miss. Listed first, so a
// refused prune or a miss cannot hide it. Returns how many have no recording at all: replay will
// miss those, so the run fails for them.
async function reportUnsaved(): Promise<number> {
  type Unsaved = {
    key: string;
    status: number;
    reason: string;
    kept: boolean;
    count: number;
    page?: string;
  };
  const unsaved: Unsaved[] = await fetch(`${MOCK}/__mock/unsaved`).then((r) => r.json());
  if (unsaved.length === 0) return 0;
  const list = unsaved
    .map((u) => {
      const times = u.count > 1 ? `×${u.count}, ` : '';
      const outcome = u.kept ? 'old recording kept' : 'no recording, replay will miss';
      return `  ${u.key}  ${u.status} (${times}page: ${u.page ?? 'server'}): ${u.reason}; ${outcome}`;
    })
    .join('\n');
  console.warn(`\n${unsaved.length} upstream answer(s) were NOT saved:\n${list}\n`);
  return unsaved.filter((u) => !u.kept).length;
}

export default async function globalTeardown() {
  const unrecorded = await reportUnsaved();

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
  const problems: string[] = [];
  if (misses.length > 0) {
    const list = misses
      .map((m) => `  ${m.key}  (page: ${m.page ?? 'server'}): ${m.reason}`)
      .join('\n');
    problems.push(`${misses.length} upstream request(s) the mock could not answer:\n${list}`);
  }
  if (unrecorded > 0) {
    problems.push(
      `${unrecorded} of the upstream answer(s) listed above as NOT saved have no recording, so replay will miss them.`
    );
  }
  if (problems.length > 0) throw new Error(problems.join('\n\n'));
}
