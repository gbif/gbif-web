import { type Row, testRows } from '../../pageRows';
import { expect, test } from '../../test';

// A hosted portal has no SSR: every loader runs in the browser, so these rows exercise the client
// data path for each page.
const ROWS: Row[] = [
  {
    id: 'occurrenceSearch',
    url: '/occurrence/search',
    title: 'Occurrence search',
    resultCount: /^[\d,]+ results$/,
  },
  {
    id: 'occurrenceKey',
    url: '/occurrence/5938027305',
    title: 'Euphagus cyanocephalus (Wagler, 1829)',
    h1: /^Euphagus cyanocephalus \(Wagler, 1829\)/,
  },
  {
    id: 'datasetSearch',
    url: '/dataset/search',
    title: 'Dataset search',
    resultCount: /^[\d,]+ datasets$/,
  },
  {
    id: 'datasetKey',
    url: '/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7',
    title: 'iNaturalist Research-grade Observations',
    h1: 'iNaturalist Research-grade Observations',
  },
  {
    id: 'publisherSearch',
    url: '/publisher/search',
    title: 'Publisher search',
    resultCount: /^[\d,]+ publishers$/,
  },
  {
    id: 'publisherKey',
    url: '/publisher/28eb1a3f-1c15-4a95-931a-4af90ecb574d',
    title: 'iNaturalist.org',
    h1: 'iNaturalist.org',
  },
  {
    id: 'taxonSearch',
    url: '/taxon/search',
    title: 'Taxon search',
    resultCount: /^[\d,]+ results$/,
  },
  {
    // Portals default to the GBIF Backbone, so this is a Backbone key; gbif.org's CoL key 4DXXM
    // is a 404 here.
    id: 'taxonKey',
    url: '/taxon/5231190',
    title: 'Passer domesticus',
    h1: /^Passer domesticus/,
  },
  {
    // Collections and institutions are excluded on gbif.org but available to portals.
    id: 'collectionSearch',
    url: '/collection/search',
    title: 'Collections',
    resultCount: /^[\d,]+ collections$/,
  },
  {
    id: 'collectionKey',
    url: '/collection/85d9c257-ce3f-47ca-8fe0-2e16e73cd3a9',
    title: 'NHMA Entomology Collection',
    h1: 'NHMA Entomology Collection',
  },
  {
    id: 'institutionSearch',
    url: '/institution/search',
    title: 'Institutions',
    resultCount: /^[\d,]+ institutions$/,
  },
  {
    id: 'institutionKey',
    url: '/institution/59f46093-8fae-47f3-a9ef-e5fd1d38e4fe',
    title: 'Natural History Museum, Aarhus Denmark',
    h1: 'Natural History Museum, Aarhus Denmark',
  },
  {
    id: 'literatureSearch',
    url: '/literature/search',
    title: 'Literature search',
    resultCount: /^[\d,]+ results$/,
  },
  {
    id: 'installationKey',
    url: '/installation/a3c51b22-e3ff-4ddf-a82e-13f442763e86',
    title: 'ServCat U.S. Fish and Wildlife Service',
    h1: 'ServCat U.S. Fish and Wildlife Service',
  },
  {
    id: 'networkKey',
    url: '/network/2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6',
    title: 'Ocean Biodiversity Information System (OBIS)',
    h1: 'Ocean Biodiversity Information System (OBIS)',
  },
  {
    id: 'downloadKey',
    url: '/occurrence/download/0012986-260928105237408',
    title: 'Download 2026-10-06T16:00:51.881+00:00',
    h1: '4,225 occurrences downloaded',
  },
  { id: 'countryKey', url: '/country/DK/summary', title: 'Denmark', h1: 'Denmark' },
  {
    id: 'participantKey',
    url: '/participant/317',
    title: 'International Long Term Ecological Research',
    h1: 'International Long Term Ecological Research',
  },
  {
    // A country's node redirects to the country page.
    id: 'nodeKey',
    url: '/node/4ddd294f-02b7-4359-ac33-0806a9ca9c6b',
    title: 'Denmark',
    h1: 'Denmark',
  },
];

testRows(ROWS);

test('links between enabled pages stay on the portal', async ({ page, baseURL }) => {
  await page.goto('/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7');
  await page.getByRole('link', { name: 'iNaturalist.org', exact: true }).first().click();
  await expect(page).toHaveURL(`${baseURL}/publisher/28eb1a3f-1c15-4a95-931a-4af90ecb574d`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('iNaturalist.org');
});

// No SSR, so the redirect is client-side: assert where the browser lands, not a 302.
for (const [from, to] of [
  ['/participant/20', /\/country\/AT\/summary$/],
  ['/es/participant/20', /\/es\/country\/AT\/summary$/],
] as const) {
  test(`${from} lands on the country page`, async ({ page }) => {
    await page.goto(from);
    await expect(page).toHaveURL(to);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Austria');
  });
}
