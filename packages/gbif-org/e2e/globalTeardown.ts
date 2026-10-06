import { MOCK_PORT } from './env.mjs';

// A page that asked for data nobody recorded rendered an error state, even if its assertions passed.
export default async function globalTeardown() {
  const misses: Array<{ key: string; page?: string }> = await fetch(
    `http://localhost:${MOCK_PORT}/__mock/misses`
  ).then((r) => r.json());
  if (misses.length === 0) return;
  const list = misses.map((m) => `  ${m.key}  (page: ${m.page ?? 'server'})`).join('\n');
  throw new Error(
    `${misses.length} upstream request(s) had no recording. Run npm run e2e:record.\n${list}`
  );
}
