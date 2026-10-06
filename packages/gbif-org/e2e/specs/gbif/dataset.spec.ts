import { expect, test } from '../../test';

const BACKBONE = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

test('dataset page renders server-side and hydrates', async ({ page }) => {
  const response = await page.goto(`/dataset/${BACKBONE}`);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/GBIF Backbone Taxonomy/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GBIF Backbone Taxonomy');

  // Client-side navigation between tabs proves hydration and the browser data path.
  const tabs = page
    .getByRole('list')
    .filter({ has: page.getByRole('link', { name: 'About', exact: true }) })
    .filter({ has: page.getByRole('link', { name: 'Metrics', exact: true }) });
  await tabs.getByRole('link', { name: 'Metrics', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/dataset/${BACKBONE}/metrics$`));
});
