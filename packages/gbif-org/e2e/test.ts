import { test as base, expect, type Page } from '@playwright/test';
import { MOCK_PORT } from './env.mjs';

// 1x1 grey PNG: external images keep their layout box without depending on the network.
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGO4BwAA0wDPpZ0VNQAAAABJRU5ErkJggg==',
  'base64'
);

// React's minified production hydration errors (418, 419, 421, 423, 425) and their dev wording.
const HYDRATION_ERROR = /Minified React error #(418|419|421|423|425)|hydrat/i;

const MOCK = `http://localhost:${MOCK_PORT}`;

// waitForLoadState('networkidle') returns at once after a client-side navigation, because the
// document already reached that state. Counting requests catches fetches started by clicks too.
function trackRequests(page: Page) {
  let inflight = 0;
  let started = 0;
  const isLocal = (url: string) => new URL(url).hostname === 'localhost';
  page.on('request', (req) => {
    if (!isLocal(req.url())) return;
    inflight++;
    started++;
  });
  const done = (req: { url(): string }) => {
    if (isLocal(req.url())) inflight--;
  };
  page.on('requestfinished', done);
  page.on('requestfailed', done);

  // Idle means nothing in flight and nothing new started for a moment, since a response often
  // triggers the next query.
  return async function waitForIdle() {
    await expect
      .poll(
        async () => {
          if (inflight > 0) return false;
          const before = started;
          await page.waitForTimeout(300);
          return inflight === 0 && started === before;
        },
        { message: 'page never stopped requesting', timeout: 15_000 }
      )
      .toBe(true);
  };
}

type Fixtures = { pageErrors: string[] };

// Every spec imports test from here: the browser only talks to localhost, and an uncaught exception,
// a hydration mismatch or an unrecorded request fails the test even when its own assertions pass.
export const test = base.extend<Fixtures>({
  pageErrors: [
    async ({ page }, use, testInfo) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error' && HYDRATION_ERROR.test(msg.text())) {
          errors.push(`hydration: ${msg.text()}`);
        }
      });
      await page.route('**/*', (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (url.hostname !== 'localhost') {
          return request.resourceType() === 'image'
            ? route.fulfill({ contentType: 'image/png', body: PLACEHOLDER_PNG })
            : route.abort();
        }
        // Lets the mock attribute a miss to this test.
        if (url.origin === MOCK) {
          return route.continue({
            headers: { ...request.headers(), 'x-e2e-test': testInfo.testId },
          });
        }
        return route.continue();
      });
      const waitForIdle = trackRequests(page);

      await use(errors);

      // Late client-side fetches must happen inside the test, or they are never recorded and only
      // surface as replay misses.
      await waitForIdle();
      const misses: Array<{ key: string; reason: string }> = await fetch(
        `${MOCK}/__mock/misses?test=${encodeURIComponent(testInfo.testId)}`
      ).then((r) => r.json());
      expect(errors, 'uncaught errors in the page').toEqual([]);
      expect(
        misses.map((m) => `${m.key}: ${m.reason}`),
        'requests the mock could not answer'
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
