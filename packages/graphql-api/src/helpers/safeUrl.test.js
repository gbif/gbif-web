/* eslint-env mocha */
/* eslint-disable no-script-url -- these tests feed javascript: URLs in on purpose */
import assert from 'assert';
import { safeUrl, sanitizeUrlField } from './safeUrl';
import { translateContentfulResponse } from './utils';

describe('safeUrl', () => {
  it('allows http, https, mailto, ftp and relative URLs', () => {
    [
      'https://www.gbif.org/what-is-gbif',
      'http://example.com',
      'mailto:helpdesk@gbif.org',
      'ftp://ftp.example.com/a.zip',
      '/dataset/search',
      '//images.ctfassets.net/abc/logo.png',
      '#top',
    ].forEach((url) => assert.strictEqual(safeUrl(url), url));
  });

  it('rejects script and other schemes, including obfuscated ones', () => {
    [
      'javascript:alert(1)',
      'JavaScript:alert(1)',
      ' javascript:alert(1)',
      '\u0001javascript:alert(1)',
      'java\tscript:alert(1)',
      'java\nscript:alert(1)',
      'data:text/html,<script>alert(1)</script>',
      'vbscript:msgbox(1)',
      '',
      null,
      undefined,
    ].forEach((url) => assert.strictEqual(safeUrl(url), undefined, String(url)));
  });
});

describe('sanitizeUrlField', () => {
  it('only touches strings under URL-like keys', () => {
    assert.strictEqual(sanitizeUrlField('url', 'javascript:alert(1)'), '');
    assert.strictEqual(sanitizeUrlField('link', 'javascript:alert(1)'), '');
    assert.strictEqual(sanitizeUrlField('primaryUrl', 'javascript:alert(1)'), '');
    assert.strictEqual(sanitizeUrlField('urlAlias', 'javascript:alert(1)'), '');
    assert.strictEqual(sanitizeUrlField('urlAlias', '/awards/ebbe-rules'), '/awards/ebbe-rules');
    assert.strictEqual(sanitizeUrlField('title', 'javascript:alert(1)'), 'javascript:alert(1)');
    assert.strictEqual(sanitizeUrlField('linkType', 'Entry'), 'Entry');
    assert.strictEqual(sanitizeUrlField('externalLink', true), true);
    assert.strictEqual(sanitizeUrlField('url', 'https://www.gbif.org'), 'https://www.gbif.org');
  });
});

describe('translateContentfulResponse', () => {
  it('blanks unsafe link targets, also when they are translated', () => {
    const source = {
      title: { 'en-GB': 'Read more', da: 'Læs mere' },
      primaryLink: { label: 'Go', url: { 'en-GB': 'https://www.gbif.org', da: 'javascript:alert(1)' } },
      secondaryLinks: [{ label: 'x', url: 'javascript:alert(1)' }],
      menu: [{ link: '/dataset/search', externalLink: false }],
      image: { file: { url: '//images.ctfassets.net/a/b.png' } },
    };
    assert.deepStrictEqual(translateContentfulResponse(source, 'da'), {
      title: 'Læs mere',
      primaryLink: { label: 'Go', url: '' },
      secondaryLinks: [{ label: 'x', url: '' }],
      menu: [{ link: '/dataset/search', externalLink: false }],
      image: { file: { url: '//images.ctfassets.net/a/b.png' } },
    });
    assert.strictEqual(translateContentfulResponse(source, 'en-GB').primaryLink.url, 'https://www.gbif.org');
  });
});
