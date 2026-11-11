import { describe, expect, it } from 'vitest';
import { emlTextToHtml } from './emlText';

describe('emlTextToHtml', () => {
  it('turns indented IPT text into a paragraph instead of a code block', () => {
    const abstract =
      '\n            The dataset includes old-growth Quercus robur L. trees.\n        ';
    expect(emlTextToHtml(abstract)).toBe(
      '<p>The dataset includes old-growth Quercus robur L. trees.</p>'
    );
  });

  it('keeps blank lines as paragraphs and single line breaks as breaks', () => {
    expect(emlTextToHtml('  First line\n  second line\n\n  Next   paragraph ')).toBe(
      '<p>First line<br>second line</p><p>Next paragraph</p>'
    );
  });

  it('escapes text that only looks like markup', () => {
    expect(emlTextToHtml('Depth < 5 m & temperature > 2 °C')).toBe(
      '<p>Depth &lt; 5 m &amp; temperature &gt; 2 °C</p>'
    );
  });

  it('links bare URLs and leaves trailing punctuation outside the link', () => {
    expect(emlTextToHtml('See https://doi.org/10.1038/x1.')).toBe(
      '<p>See <a href="https://doi.org/10.1038/x1">https://doi.org/10.1038/x1</a>.</p>'
    );
  });

  it('passes HTML through unchanged, for HyperText to sanitise', () => {
    expect(emlTextToHtml('<p>A <b>bold</b> claim</p>')).toBe('<p>A <b>bold</b> claim</p>');
  });

  it('returns undefined for missing or blank text', () => {
    expect(emlTextToHtml(undefined)).toBeUndefined();
    expect(emlTextToHtml('   \n  ')).toBeUndefined();
  });
});
