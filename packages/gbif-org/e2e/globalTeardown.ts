import { MOCK_PORT } from './env.mjs';

const MOCK = `http://localhost:${MOCK_PORT}`;

// Backstop for misses no test owns, e.g. server-side requests made while rendering a page.
export default async function globalTeardown() {
  if (process.env.E2E_PRUNE === '1') {
    const removed: string[] = await fetch(`${MOCK}/__mock/prune`, { method: 'POST' }).then((r) =>
      r.json()
    );
    console.log(`Pruned ${removed.length} unused recording(s)${removed.length ? ':' : '.'}`);
    for (const key of removed) console.log(`  ${key}`);
  }

  const misses: Array<{ key: string; page?: string }> = await fetch(`${MOCK}/__mock/misses`).then(
    (r) => r.json()
  );
  if (misses.length === 0) return;
  const list = misses.map((m) => `  ${m.key}  (page: ${m.page ?? 'server'})`).join('\n');
  throw new Error(
    `${misses.length} upstream request(s) had no recording. Run npm run e2e:record.\n${list}`
  );
}
