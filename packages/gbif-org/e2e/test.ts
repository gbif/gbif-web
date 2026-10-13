// The test fixture every spec imports instead of @playwright/test. Wraps each test: blocks requests
// that leave localhost, tags mock requests with the test id so misses are attributed, and after the
// test fails it on page errors, hydration errors, the partial-data toast or mock misses. Also
// reports started and passed tests to the mock, which only prunes after a fully passing run.

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

// A broken GraphQL answer for this test; see the Fault type in mock/upstream.mjs.
export type Fault = {
  operation: string;
  variables?: Record<string, unknown>;
  status?: number;
  errors?: Array<{ path: string[]; message?: string }>;
  nulls?: string[][];
};

// Tests in this worker that have called mockFault.
const testsWithFaults = new Set<string>();

type Fixtures = {
  // Errors this test provokes on purpose, e.g. [/^partial-data toast/]. Matching errors no longer
  // fail the test; assert the outcome in the test instead. Set with test.use().
  expectedErrors: RegExp[];
  // Breaks matching GraphQL answers for this test only, until it ends. Call it before page.goto:
  // from then on, pages open with e2eTest=<test id> in the URL, so the mock also knows which
  // test the gbif.org server's requests belong to.
  mockFault: (fault: Fault) => Promise<void>;
  pageErrors: string[];
  // Resolves once the page has stopped requesting. Await it before an action that unmounts what is
  // loading (switching tabs), or how much got requested depends on timing and replay misses.
  waitForIdle: () => Promise<void>;
};

// Every spec imports test from here: the browser only talks to localhost, and an uncaught exception,
// a hydration mismatch, the partial-data error toast or an unrecorded request fails the test even
// when its own assertions pass.
export const test = base.extend<Fixtures>({
  expectedErrors: [[], { option: true }],
  waitForIdle: async ({ page }, use) => {
    await use(trackRequests(page));
  },
  mockFault: async ({}, use, testInfo) => {
    await use(async (fault) => {
      testsWithFaults.add(testInfo.testId);
      await fetch(`${MOCK}/__mock/faults`, {
        method: 'POST',
        body: JSON.stringify({ ...fault, test: testInfo.testId }),
      });
    });
  },
  pageErrors: [
    async ({ page, waitForIdle, expectedErrors }, use, testInfo) => {
      // The mock prunes recordings only if every test in the suite started and passed.
      await fetch(`${MOCK}/__mock/test-started?test=${encodeURIComponent(testInfo.testId)}`, {
        method: 'POST',
      });
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      // The toast auto-dismisses, so watch for it from the first byte of every document.
      await page.exposeBinding('__e2ePartialDataToast', () => {
        errors.push('partial-data toast: a GraphQL response had errors');
      });
      await page.addInitScript(() => {
        let reported = false;
        new MutationObserver(() => {
          if (reported || !document.querySelector('[data-testid="partial-data-error"]')) return;
          reported = true;
          (window as unknown as { __e2ePartialDataToast: () => void }).__e2ePartialDataToast();
        }).observe(document, { childList: true, subtree: true });
      });
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
        // The gbif.org server passes the page URL on to the mock, which reads the test id from it.
        if (request.isNavigationRequest() && testsWithFaults.has(testInfo.testId)) {
          url.searchParams.set('e2eTest', testInfo.testId);
          return route.continue({ url: url.href });
        }
        return route.continue();
      });

      await use(errors);

      // Late client-side fetches must happen inside the test, or they are never recorded and only
      // surface as replay misses.
      await waitForIdle();
      await fetch(`${MOCK}/__mock/faults?test=${encodeURIComponent(testInfo.testId)}`, {
        method: 'DELETE',
      });
      testsWithFaults.delete(testInfo.testId);
      const misses: Array<{ key: string; reason: string }> = await fetch(
        `${MOCK}/__mock/misses?test=${encodeURIComponent(testInfo.testId)}`
      ).then((r) => r.json());
      const unexpected = errors.filter((e) => !expectedErrors.some((re) => re.test(e)));
      expect(unexpected, 'uncaught errors in the page').toEqual([]);
      expect(
        misses.map((m) => `${m.key}: ${m.reason}`),
        'requests the mock could not answer'
      ).toEqual([]);
      if (testInfo.status === testInfo.expectedStatus) {
        await fetch(`${MOCK}/__mock/test-passed`, { method: 'POST' });
      }
    },
    { auto: true },
  ],
});

export { expect };
