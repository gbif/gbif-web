import { expect, test } from '../../test';

const DEEP_LINK = '/occurrence/search?country=DK&year=2020';
const RESULTS = /^[\d,]+ results$/;

test('a deep link shows its filters and results', async ({ page }) => {
  await page.goto(DEEP_LINK);
  await expect(page.getByRole('button', { name: /Year\s*:\s*2020/ })).toBeVisible();
  await expect(page.getByRole('button', { name: /Country or area\s*:\s*Denmark/ })).toBeVisible();
  await expect(page.getByText(RESULTS)).toBeVisible();
  await expect(page.getByRole('row').nth(1)).toContainText('Denmark');
});

test('a filter applied in the UI updates the URL and the results', async ({
  page,
  waitForIdle,
}) => {
  await page.goto('/occurrence/search');
  const before = await page.getByText(RESULTS).innerText();
  await waitForIdle();

  // The filter buttons and the option checkboxes have no accessible names, only text.
  await page.getByRole('combobox').filter({ hasText: 'Country or area' }).click();
  await page.getByRole('dialog').getByPlaceholder('Search').fill('Denmark');
  await page.getByRole('dialog').getByText('Denmark', { exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/[?&]country=DK(&|$)/);
  await expect(page.getByRole('button', { name: /Country or area\s*:\s*Denmark/ })).toBeVisible();
  await expect(page.getByText(RESULTS)).not.toHaveText(before);
});

test('switching views keeps the filters', async ({ page, waitForIdle }) => {
  await page.goto(DEEP_LINK);
  await waitForIdle();
  const views: Array<{ name: string; view: string; check: () => Promise<void> }> = [
    {
      name: 'Gallery',
      view: 'gallery',
      check: () => expect(page.getByText(/[\d,]+ results with images/)).toBeVisible(),
    },
    {
      // WebGL: assert the map's container, not its pixels.
      name: 'Map',
      view: 'map',
      check: async () => {
        await expect(page.getByText(/[\d,]+ results with coordinates/)).toBeVisible();
        await expect(page.locator('canvas').first()).toBeVisible();
      },
    },
    {
      name: 'Related',
      view: 'clusters',
      check: () => expect(page.getByRole('heading', { name: 'Legend' })).toBeVisible(),
    },
    {
      // The dashboard starts empty; adding a chart proves the chart path.
      name: 'Dashboard',
      view: 'dashboard',
      check: async () => {
        await page.locator('select').filter({ hasText: 'New' }).selectOption('basisOfRecord');
        await expect(page.getByRole('heading', { name: 'Basis of record' })).toBeVisible();
      },
    },
    {
      name: 'Download',
      view: 'download',
      check: () => expect(page.getByRole('heading', { name: 'Please sign in' })).toBeVisible(),
    },
  ];
  for (const { name, view, check } of views) {
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`[?&]view=${view}(&|$)`));
    await expect(page).toHaveURL(/[?&]country=DK(&|$)/);
    await expect(page).toHaveURL(/[?&]year=2020(&|$)/);
    await check();
    await waitForIdle();
  }
});

test('switching view drops the table page', async ({ page, waitForIdle }) => {
  await page.goto(DEEP_LINK);
  await expect(page.getByText(/^Page 1 of/)).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByText(/^Page 2 of/)).toBeVisible();
  await expect(page).toHaveURL(/[?&](from|offset)=\d+/);
  await waitForIdle();

  await page.getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page).toHaveURL(/[?&]view=gallery(&|$)/);
  await expect(page).not.toHaveURL(/[?&](from|offset)=/);
  await expect(page).toHaveURL(/[?&]country=DK(&|$)/);
});

test('a table row opens the record drawer, and Back closes it', async ({ page, waitForIdle }) => {
  await page.goto(DEEP_LINK);
  const firstRow = page.getByRole('row').nth(1);
  const name = (await firstRow.getByRole('cell').first().innerText()).split('\n')[0];
  await waitForIdle();

  await firstRow.getByRole('cell').first().getByRole('button').first().click();
  await expect(page).toHaveURL(/[?&]entity=o_\d+(&|$)/);
  const drawer = page.getByRole('dialog');
  await expect(drawer.getByRole('heading', { level: 1 })).toContainText(name);
  await waitForIdle();

  await page.goBack();
  await expect(page).not.toHaveURL(/[?&]entity=/);
  await expect(drawer).toBeHidden();
});
