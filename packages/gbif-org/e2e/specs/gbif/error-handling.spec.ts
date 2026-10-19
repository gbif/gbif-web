import { expect, test } from '../../test';

// Error handling, with GraphQL answers broken by the mock (mockFault): small errors should leave
// the page usable and show the partial-data toast, critical ones the error page. The Dataset query
// runs on the gbif.org server, the others in the browser; faults reach both.
const EBIRD = '4fa7b334-ce0d-4e88-aaae-2e0c138d049e';
const TITLE = 'EOD – eBird Observation Dataset';
const URL = `/dataset/${EBIRD}`;
const PARTIAL = [/^partial-data toast/];

test.describe('degrades with partial data', () => {
  test.use({ expectedErrors: PARTIAL });

  test('a failed secondary field still renders the page, with a toast', async ({
    page,
    mockFault,
  }) => {
    await mockFault({
      operation: 'Dataset',
      variables: { key: EBIRD },
      errors: [{ path: ['literatureSearch'] }],
    });
    const response = await page.goto(URL);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE);
    await expect(page.getByTestId('partial-data-error')).toBeVisible();
  });

  test('a failed query loaded after the page keeps the page, with a toast', async ({
    page,
    mockFault,
  }) => {
    await mockFault({
      operation: 'DatasetOccurrenceSearch',
      errors: [{ path: ['occurrenceSearch'] }],
    });
    await page.goto(URL);
    await expect(page.getByTestId('partial-data-error')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE);
  });
});

test('an unexpected null without an error still renders the page', async ({ page, mockFault }) => {
  await mockFault({
    operation: 'Dataset',
    variables: { key: EBIRD },
    nulls: [
      ['dataset', 'installation'],
      ['dataset', 'volatileContributors'],
    ],
  });
  const response = await page.goto(URL);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(TITLE);
});

test('a missing required object shows the error page with status 500', async ({
  page,
  mockFault,
}) => {
  await mockFault({
    operation: 'Dataset',
    variables: { key: EBIRD },
    errors: [{ path: ['dataset'], message: 'e2e fault: resolver failed' }],
  });
  const response = await page.goto(URL);
  expect(response?.status()).toBe(500);
  await expect(page.getByRole('link', { name: 'Report issue' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Retry' })).toBeVisible();
});

test('a 404 from the API shows the not-found page with status 404', async ({ page, mockFault }) => {
  await mockFault({
    operation: 'Dataset',
    variables: { key: EBIRD },
    errors: [{ path: ['dataset'], message: 'Request failed with status code 404' }],
  });
  const response = await page.goto(URL);
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
});

test('graphql-api being down shows the error page with status 500', async ({ page, mockFault }) => {
  await mockFault({ operation: 'Dataset', variables: { key: EBIRD }, status: 503 });
  const response = await page.goto(URL);
  expect(response?.status()).toBe(500);
  await expect(page.getByRole('link', { name: 'Report issue' })).toBeVisible();
});
