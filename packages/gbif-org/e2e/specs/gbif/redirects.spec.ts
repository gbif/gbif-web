import { expect, test } from '../../test';

test('legacy species URL redirects to the taxon page', async ({ page }) => {
  await page.goto('/species/5231190');
  await expect(page).toHaveURL(/\/taxon\/4DXXM$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Passer domesticus');
});
