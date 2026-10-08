import { expect, test } from '../../test';

// A portal with only the occurrence pages enabled, scoped to Denmark (hp-sites/occurrence-only).

test('occurrence search applies the portal scope', async ({ page }) => {
  await page.goto('/occurrence/search');
  await expect(page.getByText(/^[\d,]+ results$/)).toBeVisible();
  const rows = page.getByRole('row');
  await expect(rows.nth(1)).toBeVisible();
  for (let i = 1; i <= 5; i++) await expect(rows.nth(i)).toContainText('Denmark');
});

test('links to disabled pages fall back to gbif.org', async ({ page }) => {
  await page.goto('/occurrence/5938027648');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Bucephala clangula');
  const href = (name: string) => page.getByRole('link', { name, exact: true }).first();
  await expect(href('iNaturalist Research-grade Observations')).toHaveAttribute(
    'href',
    'https://www.gbif.org/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7'
  );
  await expect(href('iNaturalist.org')).toHaveAttribute(
    'href',
    'https://www.gbif.org/publisher/28eb1a3f-1c15-4a95-931a-4af90ecb574d'
  );
  await expect(href('Bucephala clangula (Linnaeus, 1758)')).toHaveAttribute(
    'href',
    'https://www.gbif.org/species/2498326'
  );
});

// Current behaviour: a disabled page's URL shows the portal's 404 page; it does not redirect to
// gbif.org (enablePages is commented out in src/reactRouterPlugins/index.ts). Whether it should
// redirect is open: https://github.com/MortenHofft/gbif-web/issues/22
test("a disabled page's URL shows the 404 page", async ({ page, baseURL }) => {
  await page.goto('/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7');
  await expect(page).toHaveURL(`${baseURL}/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
  await expect(page.getByText('This page might have existed once')).toBeVisible();
});

test('an English-only portal offers no language switch', async ({ page, waitForIdle }) => {
  await page.goto('/occurrence/search');
  await waitForIdle();
  await expect(page.getByRole('button', { name: 'Change language' })).toHaveCount(0);
  await expect(page.getByText('Español')).toHaveCount(0);
});
