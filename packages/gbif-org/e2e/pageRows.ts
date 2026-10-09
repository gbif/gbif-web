import { expect, test } from './test';

// Search pages have no h1; their result count shows the search ran and rendered.
export type Row = { id: string; url: string; title: string; status?: number } & (
  | { h1: string | RegExp }
  | { resultCount: RegExp }
);

// One test per row: status, <title>, and the page's own h1 or result count. Shared by the gbif.org
// smoke suite and the portal specs so both assert the same things.
export function testRows(rows: Row[]) {
  for (const row of rows) {
    test(`${row.id}: ${row.url}`, async ({ page }) => {
      const response = await page.goto(row.url);
      expect(response?.status()).toBe(row.status ?? 200);
      await expect(page).toHaveTitle(row.title);
      if ('h1' in row) {
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(row.h1);
      } else {
        await expect(page.getByText(row.resultCount).first()).toBeVisible();
      }
    });
  }
}
