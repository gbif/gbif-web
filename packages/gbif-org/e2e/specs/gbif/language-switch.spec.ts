import { type Page } from '@playwright/test';
import { expect, test } from '../../test';

// Translations come from the bundled snapshot in src/config/fallback/ (see languages.spec.ts):
// assert only strings that exist in it.

const DATASET = '/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7';
const LABELS = { en: 'English', es: 'Español', fr: 'Français', ar: 'العربية' } as const;
type Code = keyof typeof LABELS;

// Desktop opens a dropdown of menu items; below 640px the same selector is a sheet of buttons.
async function switchTo(page: Page, code: Code, waitForIdle: () => Promise<void>) {
  const mobile = (page.viewportSize()?.width ?? 1280) < 640;
  if (mobile) {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await page.getByRole('button', { name: /Change language|Cambiar idioma/ }).click();
    await page.getByRole('button', { name: LABELS[code], exact: true }).click();
  } else {
    await page.getByRole('button', { name: 'Change language' }).click();
    await page.getByRole('menuitem', { name: LABELS[code], exact: true }).click();
  }
  await waitForIdle();
}

const html = (page: Page) => page.locator('html');
const navText = (page: Page, text: string) => page.getByText(text, { exact: true }).first();

type PageRow = { id: string; path: string; en: string | RegExp; es: string | RegExp };

// Page-specific UI strings, one per page type: a tab, the result-count line, a filter name.
const PAGES: PageRow[] = [
  { id: 'home', path: '/', en: 'Get data', es: 'Obtener datos' },
  {
    id: 'dataset',
    path: `${DATASET}?utm_test=1#anchor`,
    en: 'Metrics',
    es: 'Estadísticas',
  },
  {
    id: 'occurrenceSearch',
    path: '/occurrence/search?country=DK&year=2020',
    en: /^[\d,]+ results$/,
    es: /^[\d.]+ resultados$/,
  },
  {
    id: 'resourceSearch',
    path: '/resource/search',
    en: /^[\d,]+ results$/,
    es: /^[\d.]+ resultados$/,
  },
  { id: 'toolPage', path: '/tools/species-lookup', en: 'Species Matching', es: 'Species Matching' },
];

for (const row of PAGES) {
  test(`${row.id}: switching en → es keeps path, query and hash`, async ({ page, waitForIdle }) => {
    await page.goto(row.path);
    await waitForIdle();
    await expect(html(page)).toHaveAttribute('lang', 'en');
    await expect(page.getByText(row.en).first()).toBeVisible();

    await switchTo(page, 'es', waitForIdle);

    const before = new URL(row.path, 'http://x');
    const after = new URL(page.url());
    expect(after.pathname).toBe(before.pathname === '/' ? '/es' : `/es${before.pathname}`);
    expect(after.search).toBe(before.search);
    expect(after.hash).toBe(before.hash);
    await expect(html(page)).toHaveAttribute('lang', 'es');
    await expect(navText(page, 'Obtener datos')).toBeVisible();
    await expect(page.getByText(row.es).first()).toBeVisible();
  });
}

test('switching back, and across languages, needs no reload', async ({ page, waitForIdle }) => {
  await page.goto(DATASET);
  await waitForIdle();
  // A marker survives only while the document is not reloaded.
  await page.evaluate(() => ((window as unknown as { __noReload: boolean }).__noReload = true));

  await switchTo(page, 'es', waitForIdle);
  await expect(page).toHaveURL(new RegExp(`/es${DATASET}$`));

  await switchTo(page, 'en', waitForIdle);
  await expect(page).toHaveURL(new RegExp(`${DATASET}$`));
  expect(new URL(page.url()).pathname.startsWith('/es')).toBe(false);
  await expect(html(page)).toHaveAttribute('lang', 'en');
  await expect(navText(page, 'Get data')).toBeVisible();

  await switchTo(page, 'fr', waitForIdle);
  await expect(page).toHaveURL(new RegExp(`/fr${DATASET}$`));
  await expect(html(page)).toHaveAttribute('lang', 'fr');
  await switchTo(page, 'es', waitForIdle);
  await expect(page).toHaveURL(new RegExp(`/es${DATASET}$`));
  await expect(navText(page, 'Obtener datos')).toBeVisible();

  expect(
    await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload)
  ).toBe(true);
});

test('Arabic is right-to-left after a client-side switch, and back to ltr', async ({
  page,
  waitForIdle,
}) => {
  await page.goto('/');
  await waitForIdle();
  await expect(page.locator('#app')).toHaveAttribute('dir', 'ltr');

  await switchTo(page, 'ar', waitForIdle);
  await expect(html(page)).toHaveAttribute('lang', 'ar');
  await expect(page.locator('#app')).toHaveAttribute('dir', 'rtl');

  await switchTo(page, 'en', waitForIdle);
  await expect(html(page)).toHaveAttribute('lang', 'en');
  await expect(page.locator('#app')).toHaveAttribute('dir', 'ltr');
});

test('navigation after a switch stays in the language, and Back restores the previous one', async ({
  page,
  waitForIdle,
}) => {
  await page.goto(DATASET);
  await waitForIdle();
  await switchTo(page, 'es', waitForIdle);

  // A tab link keeps the prefix.
  await page.getByRole('link', { name: 'Estadísticas', exact: true }).click();
  await waitForIdle();
  await expect(page).toHaveURL(new RegExp(`/es${DATASET}/metrics$`));
  await expect(navText(page, 'Obtener datos')).toBeVisible();

  // So does a link to another entity.
  await page.getByRole('link', { name: 'iNaturalist.org', exact: true }).first().click();
  await waitForIdle();
  await expect(page).toHaveURL(/\/es\/publisher\/28eb1a3f-1c15-4a95-931a-4af90ecb574d/);
  await expect(html(page)).toHaveAttribute('lang', 'es');

  await page.goBack();
  await waitForIdle();
  await expect(page).toHaveURL(new RegExp(`/es${DATASET}/metrics$`));
  await expect(html(page)).toHaveAttribute('lang', 'es');
});

test('numbers use the language’s separators after a switch', async ({ page, waitForIdle }) => {
  await page.goto('/occurrence/search');
  await waitForIdle();
  await expect(page.getByText(/^\d{1,3}(,\d{3})+ results$/).first()).toBeVisible();

  await switchTo(page, 'es', waitForIdle);
  await expect(page.getByText(/^\d{1,3}(\.\d{3})+ resultados$/).first()).toBeVisible();
});

test('the 404 page switches language', async ({ page, waitForIdle }) => {
  await page.goto('/this-page-does-not-exist');
  await waitForIdle();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
  await switchTo(page, 'es', waitForIdle);
  await expect(page).toHaveURL(/\/es\/this-page-does-not-exist$/);
  await expect(html(page)).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
  await expect(navText(page, 'Obtener datos')).toBeVisible();
});

test.describe('phone viewport', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the selector is a sheet and switches the language', async ({ page, waitForIdle }) => {
    await page.goto(DATASET);
    await waitForIdle();
    await page.getByRole('button', { name: 'Open navigation menu' }).click();
    await page.getByRole('button', { name: 'Change language' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Español', exact: true }).click();
    await waitForIdle();
    await expect(page).toHaveURL(new RegExp(`/es${DATASET}$`));
    await expect(html(page)).toHaveAttribute('lang', 'es');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'iNaturalist Research-grade Observations'
    );
  });
});

test('a vocabulary chip is relabelled after a switch', async ({ page, waitForIdle }) => {
  await page.goto('/occurrence/search?lifeStage=Adult');
  await waitForIdle();
  await expect(page.getByText('Adult', { exact: true }).first()).toBeVisible();

  await switchTo(page, 'es', waitForIdle);
  await expect(page).toHaveURL(/\/es\/occurrence\/search\?lifeStage=Adult$/);
  await expect(page.getByText('Adult', { exact: true })).toHaveCount(0);
  await expect(page.getByText(/^Adult[oa]$/).first()).toBeVisible();
});
