import { expect, test } from '../../test';

// The smoke suite loads every page server-side. These tests click through each page's tabs, so the
// tab data loads through the browser's data path.

type Tab = { name: string; path: string; shows: string | RegExp };

const PAGES: Array<{ url: string; tabs: Tab[] }> = [
  {
    url: '/dataset/50c9509d-22c7-4a22-a47d-8c48425ef4a7',
    tabs: [
      { name: 'Metrics', path: '/metrics', shows: 'Literature type' },
      { name: 'Download', path: '/download', shows: 'GBIF annotated occurrence archive' },
      { name: 'About', path: '', shows: 'Geographic scope' },
    ],
  },
  {
    // A checklist, so it has a taxonomy tab.
    url: '/dataset/d7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
    tabs: [{ name: 'Taxonomy', path: '/taxon', shows: 'Animalia' }],
  },
  {
    url: '/taxon/4DXXM',
    tabs: [
      { name: 'Metrics', path: '/metrics', shows: 'Data richness' },
      { name: 'About', path: '', shows: 'Classification and descendants' },
    ],
  },
  {
    // The metrics tab appears once the publisher's occurrence count has loaded.
    url: '/publisher/28eb1a3f-1c15-4a95-931a-4af90ecb574d',
    tabs: [
      { name: 'Metrics', path: '/metrics', shows: 'Citation metrics' },
      { name: 'About', path: '', shows: 'Contacts' },
    ],
  },
  {
    url: '/network/2b7c7b4f-4d4f-40d3-94de-c28b6fa054a6',
    tabs: [
      { name: 'Metrics', path: '/metrics', shows: 'IUCN Global Red List Category' },
      { name: 'Datasets', path: '/dataset', shows: /^[\d,]+ participating datasets$/ },
      { name: 'Publishers', path: '/publisher', shows: /^[\d,]+ participating publishers$/ },
      { name: 'About', path: '', shows: 'OBIS nodes' },
    ],
  },
  {
    // Denmark has no projects, so that tab is hidden.
    url: '/country/DK/summary',
    tabs: [
      { name: 'Data about', path: '/about', shows: 'Data about Denmark' },
      { name: 'Data publishing', path: '/publishing', shows: 'Data from Denmark' },
      { name: 'Participation', path: '/participation', shows: 'Participant summary' },
      { name: 'Alien species', path: '/alien-species', shows: /^[\d,]+ datasets$/ },
      { name: 'Publications from', path: '/publications/from', shows: /^[\d,]+ results$/ },
      { name: 'Publications about', path: '/publications/about', shows: /^[\d,]+ results$/ },
      { name: 'News', path: '/news', shows: /^[\d,]+ news items$/ },
    ],
  },
];

for (const { url, tabs } of PAGES) {
  test(`tabs on ${url}`, async ({ page, waitForIdle }) => {
    await page.goto(url);
    const base = url.replace(/\/summary$/, '');
    for (const tab of tabs) {
      await page.getByRole('link', { name: tab.name, exact: true }).first().click();
      await expect(page).toHaveURL(new RegExp(`${base}${tab.path}$`));
      await expect(page.getByText(tab.shows).first()).toBeVisible();
      await waitForIdle();
    }
  });
}
