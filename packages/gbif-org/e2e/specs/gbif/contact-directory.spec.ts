import { type Page } from '@playwright/test';
import { expect, test } from '../../test';

const GROUPS = [
  { key: 'voting', title: 'Voting participants' },
  { key: 'associateCountries', title: 'Associate country participants' },
  { key: 'associateParticipants', title: 'Other associate participants' },
  { key: 'executiveCommittee', title: 'Executive Committee' },
  { key: 'scienceCommittee', title: 'Science Committee' },
  { key: 'budgetCommittee', title: 'Budget committee' },
  { key: 'nsg', title: 'Nodes Steering Group' },
  { key: 'nodesCommittee', title: 'Node Managers Committee' },
  { key: 'secretariat', title: 'GBIF Secretariat' },
];

const PATH = '/contact-us/directory';
const tableTitle = (page: Page, title: string) =>
  page.getByRole('heading', { level: 3, name: title, exact: true });
// Body rows only; header rows hold column headers.
const bodyRows = (page: Page) => page.locator('tbody').getByRole('row');
const search = (page: Page) => page.getByPlaceholder('Search', { exact: true });

async function gotoLoaded(page: Page, url: string, waitForIdle: () => Promise<void>) {
  await page.goto(url);
  await waitForIdle();
}

test('loads every group table with rows', async ({ page, waitForIdle }) => {
  const response = await page.goto(PATH);
  expect(response?.status()).toBe(200);
  await waitForIdle();
  for (const group of GROUPS) {
    await expect(tableTitle(page, group.title)).toBeVisible();
  }
  expect(await bodyRows(page).count()).toBeGreaterThan(GROUPS.length);
});

test('search filters in memory, leaves the URL alone and clears', async ({ page, waitForIdle }) => {
  await gotoLoaded(page, PATH, waitForIdle);
  const all = await bodyRows(page).count();

  await search(page).fill('Snitting');
  await expect.poll(() => bodyRows(page).count()).toBeLessThan(all);
  expect(await bodyRows(page).count()).toBeGreaterThan(0);
  await expect(bodyRows(page).filter({ hasNotText: 'Snitting' })).toHaveCount(0);
  // Tables without a match are hidden, not left empty.
  expect(await page.getByRole('heading', { level: 3 }).count()).toBeLessThan(GROUPS.length);
  expect(new URL(page.url()).search).toBe('');

  await search(page).fill('zzzqqqxxx');
  await expect(bodyRows(page)).toHaveCount(0);

  await search(page).fill('');
  await expect.poll(() => bodyRows(page).count()).toBe(all);
  // A request without a recording would have failed the test through the fixture.
});

test.describe('group filter', () => {
  test('clicking a group sets ?group= and All removes it', async ({ page, waitForIdle }) => {
    await gotoLoaded(page, PATH, waitForIdle);
    await page.getByRole('button', { name: 'Voting participants', exact: true }).click();
    await expect(page).toHaveURL(/[?&]group=voting(&|$)/);
    await expect(tableTitle(page, 'Voting participants')).toBeVisible();
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(1);

    await page.getByRole('button', { name: 'All', exact: true }).click();
    await expect(page).not.toHaveURL(/group=/);
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(GROUPS.length);
  });

  test('Clear removes the group', async ({ page, waitForIdle }) => {
    await gotoLoaded(page, `${PATH}?group=secretariat`, waitForIdle);
    await page.getByRole('button', { name: 'Clear', exact: true }).click();
    await expect(page).not.toHaveURL(/group=/);
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(GROUPS.length);
  });

  for (const group of GROUPS) {
    test(`?group=${group.key} shows only ${group.title}`, async ({ page, waitForIdle }) => {
      await gotoLoaded(page, `${PATH}?group=${group.key}`, waitForIdle);
      await expect(tableTitle(page, group.title)).toBeVisible();
      await expect(page.getByRole('heading', { level: 3 })).toHaveCount(1);
      expect(await bodyRows(page).count()).toBeGreaterThan(0);
    });
  }

  test('search applies within the selected group', async ({ page, waitForIdle }) => {
    await gotoLoaded(page, `${PATH}?group=secretariat`, waitForIdle);
    const inGroup = await bodyRows(page).count();
    const surname = (await bodyRows(page).first().getByRole('cell').first().innerText())
      .trim()
      .split(/\s+/)
      .pop()!;
    await search(page).fill(surname);
    await expect.poll(() => bodyRows(page).count()).toBeLessThanOrEqual(inGroup);
    expect(await bodyRows(page).count()).toBeGreaterThan(0);
    await expect(bodyRows(page).filter({ hasNotText: surname })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 3 })).toHaveCount(1);

    await search(page).fill('zzzqqqxxx');
    await expect(bodyRows(page)).toHaveCount(0);
  });
});

test.describe('person dialog', () => {
  test('?personId=4624 opens Daniel Snitting', async ({ page, waitForIdle }) => {
    await gotoLoaded(page, `${PATH}?personId=4624`, waitForIdle);
    const dialog = page.getByRole('dialog', { name: 'Daniel Snitting' });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: 'Daniel Snitting' }).last()).toBeVisible();
    // Focus moves into the dialog.
    await expect(dialog.locator(':focus')).toHaveCount(1);
  });

  test('clicking a person opens the dialog and Escape closes it, keeping group', async ({
    page,
    waitForIdle,
  }) => {
    await gotoLoaded(page, `${PATH}?group=secretariat`, waitForIdle);
    const row = bodyRows(page).first();
    const name = (await row.getByRole('cell').first().innerText()).trim();
    await row.click();
    await expect(page).toHaveURL(/personId=\d+/);
    const dialog = page.getByRole('dialog', { name });
    await expect(dialog).toBeVisible();
    await waitForIdle();

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).not.toHaveURL(/personId=/);
    await expect(page).toHaveURL(/group=secretariat/);
  });

  test('the close button closes the dialog', async ({ page, waitForIdle }) => {
    await gotoLoaded(page, `${PATH}?personId=4624`, waitForIdle);
    const dialog = page.getByRole('dialog', { name: 'Daniel Snitting' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).not.toHaveURL(/personId=/);
  });

  test('an unknown personId does not crash the page', async ({ page, waitForIdle }) => {
    await gotoLoaded(page, `${PATH}?personId=999999999`, waitForIdle);
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(tableTitle(page, 'GBIF Secretariat')).toBeVisible();
  });
});
