import assert from 'node:assert';
import { prefixLinkUrl, sanitizeFormattedName } from './sanitize-html';
import config from '@/config';

describe('prefixLinkUrl', () => {
  it('should localize relative links', () => {
    const url = '/occurrence/search';
    assert.equal(
      prefixLinkUrl(url, 'es'),
      `${config.gbifLinkTargetOrigin}/es/occurrence/search`,
    );
  });

  it("should not edit urls that don't link to gbif.org", () => {
    const url = 'https://github.com/gbif/gbif-web';
    assert.equal(prefixLinkUrl(url, 'es'), url);

    const url2 =
      'https://docs.google.com/forms/d/e/1FAIpQLSe4rRbX2x8r8_5k6Nr6qvFBvVFLZtzM4iTrHkPCzVwHBAbg4g/viewform';
    assert.equal(prefixLinkUrl(url2, 'es'), url2);
  });

  it('should replace the gbif origin with the one from the config', () => {
    const expected = `${config.gbifLinkTargetOrigin}/occurrence/1234`;
    assert.equal(
      prefixLinkUrl('https://www.gbif-dev.org/occurrence/1234'),
      expected,
    );
    assert.equal(
      prefixLinkUrl('https://www.gbif-uat.org/occurrence/1234'),
      expected,
    );
  });

  it('should localize gbif.org links', () => {
    const locale = 'es';
    const url = 'https://gbif.org/news/6qTuv5Xf1qa05arROvx7Y1';
    const expected = `${config.gbifLinkTargetOrigin}/${locale}/news/6qTuv5Xf1qa05arROvx7Y1`;
    assert.equal(prefixLinkUrl(url, locale), expected);
  });

  it('should not localize gbif.org links if the selected locale is en-GB', () => {
    const locale = 'en-GB';
    const url = `${config.gbifLinkTargetOrigin}/news/6qTuv5Xf1qa05arROvx7Y1`;
    assert.equal(prefixLinkUrl(url, locale), url);
  });

  it('should not change the localization of gbif.org links that already have a local specified', () => {
    const url = `${config.gbifLinkTargetOrigin}/es/news/6qTuv5Xf1qa05arROvx7Y1`;
    assert.equal(prefixLinkUrl(url, 'en-GB'), url);
  });

  it('should localize links to the root page', () => {
    const locale = 'es';
    const url = 'https://gbif.org';
    const expected = `${config.gbifLinkTargetOrigin}/${locale}`;
    assert.equal(prefixLinkUrl(url, locale), expected);
  });
});

describe('sanitizeFormattedName', () => {
  it('keeps italics in a formatted name', () => {
    const name = '<i>Puma concolor</i> (Linnaeus, 1771)';
    assert.equal(sanitizeFormattedName(name), name);
  });

  it('removes scripts, event handlers and other tags', () => {
    assert.equal(
      sanitizeFormattedName('<i onmouseover="alert(1)">Puma</i><script>alert(1)</script><img src=x onerror=alert(1)>'),
      '<i>Puma</i>',
    );
    assert.equal(sanitizeFormattedName('<a href="javascript:alert(1)">Puma</a>'), 'Puma');
  });

  it('passes through empty values', () => {
    assert.equal(sanitizeFormattedName(null), null);
    assert.equal(sanitizeFormattedName(undefined), null);
  });

  it('returns null for values that are not strings', () => {
    assert.equal(sanitizeFormattedName(['<img src=x onerror=alert(1)>']), null);
    assert.equal(sanitizeFormattedName({ toString: () => '<script>alert(1)</script>' }), null);
  });
});
