import { expect, test } from '../../test';

// Translations come from the bundled snapshot in src/config/fallback/, not live Crowdin output. A key
// added after that snapshot renders as its raw id without failing these tests, so assert only on
// strings already in it; refresh with npm run update-fallbacks.

const BACKBONE = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c';

test('a locale prefix translates the page', async ({ page }) => {
  await page.goto(`/es/dataset/${BACKBONE}`);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByText('Obtener datos', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Estadísticas', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('GBIF Backbone Taxonomy');
});

test('Arabic renders right-to-left', async ({ page }) => {
  await page.goto('/ar/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('#app')).toHaveAttribute('dir', 'rtl');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'بيانات التنوع الحيوي متاحة مجاناً'
  );
});

test('the language selector keeps the path', async ({ page }) => {
  await page.goto(`/dataset/${BACKBONE}`);
  await page.getByRole('button', { name: 'Change language' }).click();
  await page.getByRole('menuitem', { name: 'Français' }).click();
  await expect(page).toHaveURL(new RegExp(`/fr/dataset/${BACKBONE}$`));
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
  await expect(page.getByRole('link', { name: 'Statistiques', exact: true })).toBeVisible();
});

// Current behaviour: an unknown prefix is not treated as a locale, so the path matches no route and
// renders the English 404 page.
test('an unknown locale prefix is a 404', async ({ page }) => {
  const response = await page.goto(`/xx/dataset/${BACKBONE}`);
  expect(response?.status()).toBe(404);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
});
