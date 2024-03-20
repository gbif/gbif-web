/* eslint-env mocha */
import assert from 'assert';
import { getHtml } from './getHtml';
import config from '../config';

describe('Transform to html and sanitize', () => {
  it('it transform markdown and wrap in paragraph', () => {
    const result = getHtml('**bold**');
    assert.strictEqual(result, '<p><strong>bold</strong></p>');
  });

  it('it transform markdown and have option to inline', () => {
    const result = getHtml('**bold**', { inline: true });
    assert.strictEqual(result, '<strong>bold</strong>');
  });

  it('it transform markdown and respect code', () => {
    const result = getHtml(`code to follow\n\`\`\`
const a = 1;
\`\`\``);
    assert.strictEqual(result, '<p>code to follow</p><pre><code>const a = 1;</code></pre>');
  });

  it('it should respect tags in code', () => {
    const result = getHtml(`Code \`<script>alert('hi')</script>\` <span>respected</span>`, { inline: true });
    assert.strictEqual(result, `Code <code>&lt;script&gt;alert('hi')&lt;/script&gt;</code> <span>respected</span>`);
  });

  it('it should sanitize', () => {
    const result = getHtml(`hi <script>alert('hi')</script>there`, { inline: true });
    assert.strictEqual(result, `hi there`);
  });

  it('it should rewrite links to gbif.org to correct environment (uat test)', () => {
    const result = getHtml(`this link [link](https://www.gbif-uat.org/occurrence/search)`, { inline: true });
    assert.strictEqual(result, `this link <a href="${config.gbifLinkTargetOrigin}/occurrence/search">link</a>`);
  });

  it('it should rewrite links to gbif.org to correct environment (dev test)', () => {
    const result = getHtml(`this link [link](https://www.gbif-dev.org/occurrence/search)`, { inline: true });
    assert.strictEqual(result, `this link <a href="${config.gbifLinkTargetOrigin}/occurrence/search">link</a>`);
  });

  it('it should rewrite image links to the correct environment (dev)', () => {
    const result = getHtml(`image <img src="https://gbif-dev.org/image.jpg">`, { inline: true, trustLevel: 'trusted' });
    assert.strictEqual(result, `image <img src="${config.gbifLinkTargetOrigin}/image.jpg" />`);
  });

  it('it should support wrapping tables in a div with a class', () => {
    // input is markdown with a table and should be wrapped in a div - this is to ease styling and have the option to handle overflows with scrolls
    const result = getHtml(`| a |
|---|
| 1 |
`, { wrapTables: true });
    assert.strictEqual(result, `<div class="gbif-table-wrapper"><table><thead><tr><th>a</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table></div>`);
  });

});