import { describe, expect, test } from 'vitest';
import pkg from 'isomorphic-dompurify';
import {
  CAPTION_SANITIZE_OPTIONS,
  DEFAULT_SANITIZE_OPTIONS,
  INLINE_SANITIZE_OPTIONS,
  isPlainInlineHtml,
  sanitizeHtml,
} from './sanitizeHtml';

describe('sanitizeHtml', () => {
  test('keeps the italics in a formatted scientific name', () => {
    expect(sanitizeHtml('<i>Puma concolor</i> (Linnaeus, 1771)')).toBe(
      '<i>Puma concolor</i> (Linnaeus, 1771)'
    );
  });

  test('removes scripts and event handlers by default', () => {
    expect(sanitizeHtml('<img src=x onerror=alert(1)><i onclick="alert(1)">Abies</i>')).toBe(
      '<i>Abies</i>'
    );
    expect(sanitizeHtml('<script>alert(1)</script>Abies')).toBe('Abies');
  });

  test('removes links by default, since names and titles should not carry any', () => {
    expect(sanitizeHtml('<a href="https://example.com">Abies</a>')).toBe('Abies');
  });

  test('allows links with the rich text options, but not javascript: urls', () => {
    expect(sanitizeHtml('<a href="https://www.gbif.org">GBIF</a>', DEFAULT_SANITIZE_OPTIONS)).toBe(
      '<a href="https://www.gbif.org">GBIF</a>'
    );
    expect(sanitizeHtml('<a href="javascript:alert(1)">x</a>', DEFAULT_SANITIZE_OPTIONS)).toBe(
      '<a>x</a>'
    );
  });

  test('drops style, class and id from rich text', () => {
    expect(
      sanitizeHtml(
        '<a href="/terms" style="position:fixed;inset:0" class="x" id="y">terms</a>',
        DEFAULT_SANITIZE_OPTIONS
      )
    ).toBe('<a href="/terms">terms</a>');
  });

  test('adds rel="noopener noreferrer" to links that open in another tab', () => {
    const html = sanitizeHtml(
      '<a href="https://example.com" target="_blank" rel="opener">photo</a>',
      CAPTION_SANITIZE_OPTIONS
    );
    // attribute order differs between DOM implementations, so check them one by one
    expect(html).toMatch(/^<a [^>]*rel="noopener noreferrer"[^>]*>photo<\/a>$/);
    expect(html).toMatch(/ target="_blank"/);
    expect(html).toMatch(/ href="https:\/\/example\.com"/);
    expect(sanitizeHtml('<a href="/x">x</a>', CAPTION_SANITIZE_OPTIONS)).toBe('<a href="/x">x</a>');
  });
});

describe('isPlainInlineHtml', () => {
  const plain = [
    '',
    'Puma concolor',
    '<i>Puma concolor</i> (Linnaeus, 1771)',
    '<i>Puma</i> <i>concolor</i> (Linnaeus, 1771)',
    '<i>Abies</i> ×<sup>2</sup> <sub>x</sub>',
    '<b><i>nested</i></b> "quoted" \'single\' é 中文 ×\n\tline',
    '<i></i>',
  ];
  const notPlain = [
    '<i>unclosed',
    'unopened</i>',
    '<i><b>crossed</i></b>',
    '<I>upper case</I>',
    '<i class="x">attribute</i>',
    '<img src=x onerror=alert(1)>',
    '<script>alert(1)</script>',
    'a &amp; b',
    'a < b',
    'a > b',
    'non\u00a0breaking',
    'carriage\rreturn',
    'null\u0000char',
    '<a href="/x">link</a>',
    '\f<b></b>',
    'form\ffeed',
    '\ude00\ude00<i>x</i>',
    'emoji 🐾',
    '<i>'.repeat(255) + 'x' + '</i>'.repeat(255),
    '<i>'.repeat(21) + 'x' + '</i>'.repeat(21),
  ];

  test.each(plain)('takes the fast path for %j, with the same result as DOMPurify', (html) => {
    expect(isPlainInlineHtml(html)).toBe(true);
    expect(sanitizeHtml(html)).toBe(pkg.sanitize(html, INLINE_SANITIZE_OPTIONS));
  });

  test.each(notPlain)('sanitises %j as normal', (html) => {
    expect(isPlainInlineHtml(html)).toBe(false);
    expect(sanitizeHtml(html)).toBe(pkg.sanitize(html, INLINE_SANITIZE_OPTIONS));
  });
});

describe('isPlainInlineHtml compared with DOMPurify on random input', () => {
  // a small seeded generator, so a failure can be reproduced
  let seed = 1;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const pieces = [
    'a',
    ' ',
    'é',
    '\n',
    '\t',
    '\f',
    '\r',
    '\u00a0',
    '\ud83d',
    '\ude00',
    '&',
    '<',
    '>',
    '"',
    '<i>',
    '</i>',
    '<b>',
    '</b>',
    '<sup>',
    '</sup>',
    '<span>',
    '</span>',
    '<I>',
    '<i x>',
  ];

  test('the fast path never gives a different result from DOMPurify', () => {
    for (let i = 0; i < 3000; i++) {
      const length = Math.floor(random() * 12);
      const html = Array.from({ length }, () => pieces[Math.floor(random() * pieces.length)]).join(
        ''
      );
      if (isPlainInlineHtml(html)) {
        expect(sanitizeHtml(html), JSON.stringify(html)).toBe(
          pkg.sanitize(html, INLINE_SANITIZE_OPTIONS)
        );
      }
    }
  });
});
