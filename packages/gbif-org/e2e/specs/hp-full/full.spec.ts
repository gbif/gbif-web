import { type Row, testRows } from '../../pageRows';
import { expect, test } from '../../test';

// A hosted portal has no SSR: every loader runs in the browser, so these rows exercise the client
// data path for each page a portal may enable (hp-sites/full/index.html).
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
];

testRows(ROWS);

test('links between enabled pages stay on the portal', async ({ page, baseURL }) => {
  await page.goto('/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7');
  await page.getByRole('link', { name: 'iNaturalist.org', exact: true }).first().click();
  await expect(page).toHaveURL(`${baseURL}/publisher/28eb1a3f-1c15-4a95-931a-4af90ecb574d`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('iNaturalist.org');
});

// Taxon, participant, country, network and article pages are never enabled on a portal, so links
// to them go to gbif.org.
test('links to pages portals never enable go to gbif.org', async ({ page }) => {
  await page.goto('/occurrence/5938027305');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Euphagus cyanocephalus');
  await expect(
    page.getByRole('link', { name: 'Euphagus cyanocephalus (Wagler, 1829)', exact: true }).first()
  ).toHaveAttribute('href', /^https:\/\/www\.gbif\.org\/species\/\d+$/);
});

// Portal sites build their own language selector from the gbifUrlChange event. localizeLink maps
// the current url to another language, and a visit to it renders in that language.
test('gbifUrlChange carries a localizeLink that switches the portal language', async ({
  page,
  waitForIdle,
}) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __urlChanges: Array<{ url: string; es: string }> };
    w.__urlChanges = [];
    window.addEventListener('gbifUrlChange', (e) => {
      const { url, localizeLink } = (
        e as CustomEvent<{ url: string; localizeLink: (l: string, t?: string) => string }>
      ).detail;
      w.__urlChanges.push({ url, es: localizeLink(url, 'es') });
    });
  });
  const changes = () =>
    page.evaluate(
      () => (window as unknown as { __urlChanges: Array<{ url: string; es: string }> }).__urlChanges
    );

  await page.goto('/dataset/search?q=bird');
  await waitForIdle();
  const first = (await changes()).at(-1);
  expect(first).toEqual({ url: '/dataset/search?q=bird', es: '/es/dataset/search?q=bird' });
  await expect(page.getByText(/^[\d,]+ datasets$/).first()).toBeVisible();

  await page.goto(first!.es);
  await waitForIdle();
  await expect(page).toHaveURL(/\/es\/dataset\/search\?q=bird$/);
  await expect(page.getByText(/^[\d.]+ conjuntos de datos publicados$/).first()).toBeVisible();
  const second = (await changes()).at(-1);
  expect(second?.url).toBe('/es/dataset/search?q=bird');
});
