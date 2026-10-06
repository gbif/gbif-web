import { test as base, expect } from '@playwright/test';

// 1x1 grey PNG: external images keep their layout box without depending on the network.
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACklEQVR4nGO4BwAA0wDPpZ0VNQAAAABJRU5ErkJggg==',
  'base64'
);

// React's minified production hydration errors (418, 423, 425) and their dev-mode wording.
const HYDRATION_ERROR = /Minified React error #(418|419|421|423|425)|hydrat/i;

type Fixtures = { pageErrors: string[] };

// Every spec imports test from here: the browser only talks to localhost, and an uncaught exception
// or hydration mismatch fails the test even when its own assertions pass.
export const test = base.extend<Fixtures>({
  pageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error' && HYDRATION_ERROR.test(msg.text())) {
          errors.push(`hydration: ${msg.text()}`);
        }
      });
      await page.route(
        (url) => url.hostname !== 'localhost',
        (route) =>
          route.request().resourceType() === 'image'
            ? route.fulfill({ contentType: 'image/png', body: PLACEHOLDER_PNG })
            : route.abort()
      );
      await use(errors);
      // Late client-side fetches must happen inside the test, or they are never recorded and only
      // surface as replay misses.
      await page.waitForLoadState('networkidle').catch(() => {});
      expect(errors, 'uncaught errors in the page').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
