import { describe, expect, test } from 'vitest';
import { DEFAULT_SANITIZE_OPTIONS, sanitizeHtml } from './sanitizeHtml';

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
});
