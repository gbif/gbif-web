import { expect, test } from '../../test';

// The portal library has no server-side rendering, so its loaders run in the browser and take a
// separate path to the error page.
const DATASET = '84d26682-f762-11e1-a439-00145eb45e9a';
const TITLE = 'Danish Mycological Society, fungal records database';

test.describe('degrades with partial data', () => {
  test.use({ expectedErrors: [/^partial-data toast/] });

  test('a failed secondary field still renders the page, with a toast', async ({
    page,
    mockFault,
  }) => {
    await mockFault({
      operation: 'Dataset',
      variables: { key: DATASET },
      errors: [{ path: ['literatureSearch'] }],
    });
    await page.goto(`/dataset/${DATASET}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE);
    await expect(page.getByTestId('partial-data-error')).toBeVisible();
  });
});

test('a missing required object shows the error page', async ({ page, mockFault }) => {
  await mockFault({
    operation: 'Dataset',
    variables: { key: DATASET },
    errors: [{ path: ['dataset'], message: 'e2e fault: resolver failed' }],
  });
  await page.goto(`/dataset/${DATASET}`);
  await expect(page.getByRole('link', { name: 'Report issue' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Retry' })).toBeVisible();
});
