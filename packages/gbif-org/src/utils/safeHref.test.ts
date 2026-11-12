import { describe, expect, test } from 'vitest';
import { safeHref } from './safeHref';

describe('safeHref', () => {
  test('returns undefined for empty input', () => {
    expect(safeHref('')).toBeUndefined();
    expect(safeHref('   ')).toBeUndefined();
    expect(safeHref(null)).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
  });

  test('allows http, https, mailto and ftp', () => {
    expect(safeHref('https://example.com/a?b=c#d')).toBe('https://example.com/a?b=c#d');
    expect(safeHref('http://example.com')).toBe('http://example.com');
    expect(safeHref('HTTPS://EXAMPLE.COM')).toBe('HTTPS://EXAMPLE.COM');
    expect(safeHref('mailto:helpdesk@gbif.org')).toBe('mailto:helpdesk@gbif.org');
    expect(safeHref('ftp://ftp.example.com/file.zip')).toBe('ftp://ftp.example.com/file.zip');
  });

  test('allows relative URLs', () => {
    expect(safeHref('/dataset/search')).toBe('/dataset/search');
    expect(safeHref('dataset/search')).toBe('dataset/search');
    expect(safeHref('?q=birds')).toBe('?q=birds');
    expect(safeHref('#top')).toBe('#top');
    expect(safeHref('//example.com/foo')).toBe('//example.com/foo');
  });

  test('trims surrounding whitespace', () => {
    expect(safeHref('  https://example.com  ')).toBe('https://example.com');
  });

  test('rejects javascript URLs, including obfuscated ones', () => {
    expect(safeHref('javascript:alert(1)')).toBeUndefined();
    expect(safeHref('JavaScript:alert(1)')).toBeUndefined();
    expect(safeHref('  javascript:alert(1)')).toBeUndefined();
    expect(safeHref('\u0000javascript:alert(1)')).toBeUndefined();
    expect(safeHref('java\tscript:alert(1)')).toBeUndefined();
    expect(safeHref('java\nscript:alert(1)')).toBeUndefined();
    expect(safeHref('java\rscript:alert(1)')).toBeUndefined();
  });

  test('rejects other script-capable or unexpected schemes', () => {
    expect(safeHref('data:text/html,<script>alert(1)</script>')).toBeUndefined();
    expect(safeHref('vbscript:msgbox(1)')).toBeUndefined();
    expect(safeHref('blob:https://example.com/uuid')).toBeUndefined();
    expect(safeHref('file:///etc/passwd')).toBeUndefined();
    expect(safeHref('tel:+4512345678')).toBeUndefined();
  });

  test('rejects unparseable input', () => {
    expect(safeHref('http://')).toBeUndefined();
    expect(safeHref('https://exa mple.com')).toBeUndefined();
  });
});
