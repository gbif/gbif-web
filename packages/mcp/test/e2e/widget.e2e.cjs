// Loads the built widget in headless Chromium inside a real MCP Apps host (the SDK's AppBridge).
// Run with: npm run e2e   (needs Playwright's Chromium; the dev box and CI have it)
const { chromium } = require('playwright');
const { build } = require('esbuild');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const root = path.join(__dirname, '..', '..');
  const host = await build({ entryPoints: [path.join(__dirname, 'host.ts')], bundle: true, write: false, format: 'iife', platform: 'browser', logLevel: 'silent' });
  const { CHART_VIEW_HTML } = await import('tsx/esm/api').then(({ tsImport }) => tsImport(path.join(root, 'src/generated/chart-view.ts'), __filename));
  const toolResult = {
    content: [{ type: 'text', text: 'chart' }],
    structuredContent: {
      summary: '1,234 records',
      see: 'https://www.gbif.org/occurrence/search?country=DK',
      live: 'https://example.test/canvas/abc',
      chart: {
        type: 'bar', orientation: 'horizontal', title: 'Records per country: country DK', xLabel: 'country', total: 1234,
        rows: [{ label: 'Denmark', count: 900 }, { label: 'Sweden', count: 300 }, { label: '<script>alert(1)</script>', count: 34 }],
      },
    },
  };
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 700, height: 520 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setContent('<!doctype html><body></body>');
  await page.addScriptTag({ content: host.outputFiles[0].text });
  await page.evaluate(([html, result]) => window.runHost(html, result), [CHART_VIEW_HTML, toolResult]);
  const frame = page.frames().find((f) => f !== page.mainFrame());
  await frame.waitForSelector('svg.chart rect.bar', { timeout: 5000 });
  assert.equal(await frame.locator('svg.chart rect.bar').count(), 3);
  assert.match(await frame.locator('h1').innerText(), /Records per country/);
  assert.equal(await frame.locator('svg script').count(), 0, 'labels are escaped, not run');
  await frame.click('text=Open the live canvas');
  await page.waitForFunction(() => window.__openedLinks && window.__openedLinks.length === 1);
  assert.deepEqual(await page.evaluate(() => window.__openedLinks), ['https://example.test/canvas/abc']);
  if (process.env.SHOT) await page.screenshot({ path: process.env.SHOT });
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('ok   widget renders in an MCP Apps host and asks the host to open links');
})().catch((e) => { console.error(e); process.exit(1); });
