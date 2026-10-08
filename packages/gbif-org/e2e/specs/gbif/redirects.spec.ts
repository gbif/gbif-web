import { expect, test } from '../../test';

type Row = {
  from: string;
  // First hop, as the server answers it.
  location: string;
  // Where the browser ends up, and what it shows there. Omitted for external targets.
  final?: { url: RegExp; text: string | RegExp };
};

const DATASET = '50c9509d-22c7-4a22-a47d-8c48425ef4a7';

const ROWS: Row[] = [
  {
    // Pre-render redirect from redirects.json.
    from: '/country',
    location: '/the-gbif-network',
    final: { url: /\/the-gbif-network$/, text: 'The Participant network' },
  },
  {
    from: '/bid',
    location: '/programme/82243/_redirect',
    final: {
      url: /\/programme\/82243\/bid-biodiversity-information-for-development$/,
      text: 'BID: Biodiversity Information for Development',
    },
  },
  {
    // Loader redirect resolved through the DeprecatedTaxonRedirect query.
    from: '/species/5231190',
    location: '/taxon/4DXXM',
    final: { url: /\/taxon\/4DXXM$/, text: 'Passer domesticus (Linnaeus, 1758)' },
  },
  {
    from: '/species/search',
    location: '/taxon/search',
    final: { url: /\/taxon\/search$/, text: /^[\d,]+ results$/ },
  },
  {
    // Child-route redirect.
    from: `/dataset/${DATASET}/activity`,
    location: `/dataset/${DATASET}/metrics`,
    final: { url: /\/metrics$/, text: 'iNaturalist Research-grade Observations' },
  },
  {
    from: '/country/DK',
    location: '/country/DK/summary',
    final: { url: /\/country\/DK\/summary$/, text: 'Denmark' },
  },
  {
    // Forced post-render redirect: the query string, not a 404, triggers it.
    from: '/resource/search?contentType=literature',
    location: '/literature/search',
    final: { url: /\/literature\/search$/, text: /^[\d,]+ results$/ },
  },
  {
    from: '/newsroom/uses',
    location: '/resource/search?contentType=dataUse',
    final: { url: /\/resource\/search\?contentType=dataUse$/, text: /^[\d,]+ data use summaries$/ },
  },
  {
    // notImplementedRoutes: redirectDocument to an external site.
    from: '/developer/summary',
    location: 'https://techdocs.gbif.org/en/openapi',
  },
];

for (const row of ROWS) {
  test(`${row.from} redirects to ${row.location}`, async ({ page }) => {
    const response = await page.request.get(row.from, { maxRedirects: 0 });
    expect(response.status()).toBe(302);
    expect(response.headers()['location']).toBe(row.location);

    if (!row.final) return;
    await page.goto(row.from);
    await expect(page).toHaveURL(row.final.url);
    await expect(page.getByText(row.final.text).first()).toBeVisible();
  });
}

test('an unknown path is a 404, not a redirect', async ({ page }) => {
  const response = await page.request.get('/this-page-does-not-exist', { maxRedirects: 0 });
  expect(response.status()).toBe(404);
  await page.goto('/this-page-does-not-exist');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
});
