import { expect, test } from '../../test';

const BACKBONE = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

test('dataset page renders server-side and hydrates', async ({ page }) => {
  const response = await page.goto(`/dataset/${BACKBONE}`);
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/GBIF Backbone Taxonomy/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GBIF Backbone Taxonomy');

  // Client-side navigation between tabs proves hydration and the browser data path.
  await page.getByRole('link', { name: 'Metrics' }).first().click();
  await expect(page).toHaveURL(new RegExp(`/dataset/${BACKBONE}/metrics$`));
});

test('legacy species URL redirects to the taxon page', async ({ page }) => {
  await page.goto('/species/5231190');
  await expect(page).toHaveURL(/\/taxon\/4DXXM$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Passer domesticus');
});
