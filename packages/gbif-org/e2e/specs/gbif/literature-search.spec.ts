import { type Page } from '@playwright/test';
import { expect, test } from '../../test';

const PATH = '/literature/search';
const COUNT = /^[\d,]+ results?$/;
const PAGE_SIZE = 50;

// "N results" as a number. Only comparisons between counts are asserted, so rows survive a re-record.
async function count(page: Page) {
  const text = await page.getByText(COUNT).first().innerText();
  return Number(text.replace(/\D/g, ''));
}
const pageLabel = (page: Page, n: number) => page.getByText(new RegExp(`^Page ${n} of `));
const firstRowTitle = (page: Page) =>
  page.getByRole('row').nth(1).getByRole('cell').first().innerText();
const chip = (page: Page, name: string | RegExp) =>
  page.getByRole('button', { name: typeof name === 'string' ? new RegExp(`${name}\\s*:`) : name });

async function unfilteredTotal(page: Page, waitForIdle: () => Promise<void>) {
  await page.goto(PATH);
  await waitForIdle();
  return count(page);
}

test.describe('paging', () => {
  test('Next, Previous and First move between pages and update offset', async ({
    page,
    waitForIdle,
  }) => {
    await page.goto(PATH);
    await expect(pageLabel(page, 1)).toBeVisible();
    await waitForIdle();
    const first = await firstRowTitle(page);

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(pageLabel(page, 2)).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`[?&]offset=${PAGE_SIZE}(&|$)`));
    await expect.poll(() => firstRowTitle(page)).not.toBe(first);
    await waitForIdle();

    await page.getByRole('button', { name: 'Previous' }).click();
    await expect(pageLabel(page, 1)).toBeVisible();
    await expect.poll(() => firstRowTitle(page)).toBe(first);
    await waitForIdle();

    await page.getByRole('button', { name: 'Next' }).click();
    await expect(pageLabel(page, 2)).toBeVisible();
    await waitForIdle();
    await page.getByRole('button', { name: 'First' }).click();
    await expect(pageLabel(page, 1)).toBeVisible();
    await expect(page).not.toHaveURL(/offset=/);
  });

  test('a deep link opens the page it names', async ({ page }) => {
    await page.goto(`${PATH}?offset=${2 * PAGE_SIZE}`);
    await expect(pageLabel(page, 3)).toBeVisible();
  });

  test('applying a filter resets paging to page 1', async ({ page, waitForIdle }) => {
    await page.goto(`${PATH}?offset=${PAGE_SIZE}`);
    await expect(pageLabel(page, 2)).toBeVisible();
    await waitForIdle();

    await page.getByRole('combobox').filter({ hasText: 'Year of publication' }).click();
    await page.getByRole('textbox', { name: 'E.g. 1000,2000' }).fill('2020');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Apply' }).click();

    await expect(page).toHaveURL(/[?&]year=2020(&|$)/);
    await expect(page).not.toHaveURL(/offset=/);
    await expect(pageLabel(page, 1)).toBeVisible();
  });
});

test('applying a filter lowers the count and shows a chip', async ({ page, waitForIdle }) => {
  const total = await unfilteredTotal(page, waitForIdle);

  await page.getByRole('combobox').filter({ hasText: 'Country or area of researcher' }).click();
  await page.getByRole('dialog').getByPlaceholder('Search').fill('United Kingdom');
  await page.getByRole('dialog').getByRole('option', { name: 'United Kingdom' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Apply' }).click();

  await expect(page).toHaveURL(/[?&]countriesOfResearcher=GB(&|$)/);
  await expect(chip(page, 'Country or area of researcher')).toBeVisible();
  await expect.poll(() => count(page)).toBeLessThan(total);
});

test.describe('More filters', () => {
  async function openMore(page: Page) {
    await page.getByRole('button', { name: 'more', exact: true }).click();
    const search = page.getByPlaceholder('Search filters');
    await expect(search).toBeVisible();
    return search;
  }

  test('searches the list, shows a filter inline and goes back', async ({ page, waitForIdle }) => {
    await page.goto(PATH);
    await waitForIdle();
    const search = await openMore(page);
    const options = page.getByRole('option');
    const all = await options.count();
    expect(all).toBeGreaterThan(1);

    await search.fill('taxon');
    await expect(options).toHaveCount(1);
    await expect(options.first()).toHaveText('Scientific name');

    await options.first().click();
    await expect(page.getByRole('heading', { name: 'Scientific name' })).toBeVisible();
    await expect(search).toBeHidden();

    await page.getByRole('button', { name: 'Back to filter list' }).click();
    await expect(page.getByPlaceholder('Search filters')).toBeVisible();
    await expect(page.getByRole('option').first()).toBeVisible();
  });

  test('a filter applied from the list adds its param and a chip', async ({
    page,
    waitForIdle,
  }) => {
    const total = await unfilteredTotal(page, waitForIdle);
    const search = await openMore(page);
    await search.fill('Literature type');
    await page.getByRole('option', { name: 'Literature type' }).click();
    await page.getByRole('dialog').getByText('Journal article', { exact: true }).first().click();
    await page.getByRole('dialog').getByRole('button', { name: 'Apply' }).click();

    await expect(page).toHaveURL(/[?&]literatureType=journal(&|$)/);
    await expect(chip(page, 'Literature type')).toBeVisible();
    await expect.poll(() => count(page)).toBeLessThan(total);
  });

  // #45: the suggest list was clipped by the popover, leaving about one and a half rows visible.
  test('scientific name suggestions are inside the viewport', async ({ page, waitForIdle }) => {
    await page.goto(PATH);
    await waitForIdle();
    const search = await openMore(page);
    await search.fill('Scientific name');
    await page.getByRole('option', { name: 'Scientific name' }).click();
    await page.getByRole('dialog').getByRole('combobox').fill('s');

    const suggestions = page.getByRole('dialog').getByRole('listbox').getByRole('option');
    await expect(suggestions.nth(2)).toBeVisible();
    for (const i of [0, 1, 2]) {
      await expect(suggestions.nth(i)).toBeInViewport({ ratio: 1 });
    }
  });
});

// One URL per filter: 0 < filtered < unfiltered, and a chip. `chip` is the filter's name.
const URL_ROWS: Array<{ handle: string; value: string; name: string; exactly?: number }> = [
  { handle: 'q', value: 'sparrow', name: 'Full text search' },
  { handle: 'year', value: '2020', name: 'Year of publication' },
  { handle: 'countriesOfResearcher', value: 'GB', name: 'Country or area of researcher' },
  { handle: 'countriesOfCoverage', value: 'BR', name: 'Country or area of coverage' },
  { handle: 'gbifDatasetKey', value: '50c9509d-22c7-4a22-a47d-8c48425ef4a7', name: 'Dataset' },
  {
    handle: 'publishingOrganizationKey',
    value: '28eb1a3f-1c15-4a95-931a-4af90ecb574d',
    name: 'Publisher',
  },
  { handle: 'gbifNetworkKey', value: '2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6', name: 'Network' },
  { handle: 'gbifTaxonKey', value: '212', name: 'Scientific name' },
  { handle: 'literatureType', value: 'journal', name: 'Literature type' },
  { handle: 'relevance', value: 'GBIF_USED', name: 'Relevance' },
  { handle: 'topics', value: 'CONSERVATION', name: 'Topic' },
  { handle: 'openAccess', value: 'true', name: 'Open access' },
  { handle: 'peerReview', value: 'true', name: 'Peer-reviewed' },
  { handle: 'publisher', value: 'Wiley', name: 'Journal publisher' },
  { handle: 'source', value: 'bioRxiv', name: 'Journal' },
  { handle: 'gbifProgrammeAcronym', value: 'BID', name: 'Programme' },
  { handle: 'gbifProjectIdentifier', value: 'BDBCV', name: 'Project' },
  { handle: 'gbifDownloadKey', value: '0029165-200221144449610', name: 'Download key' },
  { handle: 'doi', value: '10.1038/s41597-022-01774-9', name: 'DOI', exactly: 1 },
];

test.describe('one URL per filter', () => {
  for (const row of URL_ROWS) {
    test(`${row.handle}=${row.value}`, async ({ page, waitForIdle }) => {
      const total = await unfilteredTotal(page, waitForIdle);
      await page.goto(`${PATH}?${row.handle}=${encodeURIComponent(row.value)}`);
      await waitForIdle();
      if (row.handle === 'q') {
        // Free text is a quoted chip without a filter name.
        await expect(page.getByRole('button', { name: `“${row.value}”` })).toBeVisible();
      } else {
        await expect(chip(page, row.name)).toBeVisible();
      }
      const filtered = await count(page);
      expect(filtered).toBeGreaterThan(0);
      expect(filtered).toBeLessThan(total);
      if (row.exactly !== undefined) expect(filtered).toBe(row.exactly);
    });
  }
});

test.describe('TSV export', () => {
  const link = (page: Page) => page.getByRole('link', { name: 'Download as TSV' });
  const query = async (page: Page) => {
    const href = await link(page).getAttribute('href');
    const url = new URL(href!);
    return { path: url.pathname, params: Object.fromEntries(url.searchParams) };
  };

  test('unfiltered link', async ({ page, waitForIdle }) => {
    await page.goto(PATH);
    await waitForIdle();
    expect(await query(page)).toEqual({
      path: '/api/v1/literature/export',
      params: { format: 'TSV' },
    });
  });

  test('link carries the filters from the URL', async ({ page, waitForIdle }) => {
    await page.goto(`${PATH}?year=2020&countriesOfResearcher=GB`);
    await waitForIdle();
    const { params } = await query(page);
    expect(params).toEqual({ year: '2020', countriesOfResearcher: 'GB', format: 'TSV' });
  });

  test('applying a filter updates the link', async ({ page, waitForIdle }) => {
    await page.goto(PATH);
    await waitForIdle();
    await page.getByRole('combobox').filter({ hasText: 'Year of publication' }).click();
    await page.getByRole('textbox', { name: 'E.g. 1000,2000' }).fill('2020');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Apply' }).click();
    await expect(page).toHaveURL(/year=2020/);
    await expect
      .poll(async () => (await query(page)).params)
      .toEqual({
        year: '2020',
        format: 'TSV',
      });
  });
});
