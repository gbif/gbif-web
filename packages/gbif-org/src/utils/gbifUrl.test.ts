import { describe, expect, test } from 'vitest';
import { gbifUrlAsRelative } from './gbifUrl';

describe('gbifUrlAsRelative', () => {
  test('returns null for empty input', () => {
    expect(gbifUrlAsRelative('')).toBeNull();
    expect(gbifUrlAsRelative(null)).toBeNull();
    expect(gbifUrlAsRelative(undefined)).toBeNull();
  });

  test('passes root-relative paths through unchanged', () => {
    expect(gbifUrlAsRelative('/')).toBe('/');
    expect(gbifUrlAsRelative('/dataset/search')).toBe('/dataset/search');
    expect(gbifUrlAsRelative('/dataset/search?q=birds#top')).toBe('/dataset/search?q=birds#top');
  });

  test('strips the host from gbif.org URLs', () => {
    expect(gbifUrlAsRelative('https://www.gbif.org/dataset/search')).toBe('/dataset/search');
    expect(gbifUrlAsRelative('https://gbif.org/dataset/search')).toBe('/dataset/search');
    expect(gbifUrlAsRelative('http://www.gbif.org/dataset/search')).toBe('/dataset/search');
  });

  test('strips the host from staging/uat/dev variants', () => {
    expect(gbifUrlAsRelative('https://www.gbif-staging.org/foo')).toBe('/foo');
    expect(gbifUrlAsRelative('https://gbif-staging.org/foo')).toBe('/foo');
    expect(gbifUrlAsRelative('https://www.gbif-uat.org/foo')).toBe('/foo');
    expect(gbifUrlAsRelative('https://gbif-uat.org/foo')).toBe('/foo');
    expect(gbifUrlAsRelative('https://www.gbif-dev.org/foo')).toBe('/foo');
    expect(gbifUrlAsRelative('https://gbif-dev.org/foo')).toBe('/foo');
  });

  test('preserves search and hash on gbif URLs', () => {
    expect(gbifUrlAsRelative('https://www.gbif.org/occurrence/search?taxon_key=1#map')).toBe(
      '/occurrence/search?taxon_key=1#map'
    );
  });

  test('returns "/" for the bare gbif.org host', () => {
    expect(gbifUrlAsRelative('https://www.gbif.org')).toBe('/');
    expect(gbifUrlAsRelative('https://www.gbif.org/')).toBe('/');
  });

  test('returns null for non-gbif hosts', () => {
    expect(gbifUrlAsRelative('https://example.com/foo')).toBeNull();
    expect(gbifUrlAsRelative('https://gbif.example.com/foo')).toBeNull();
    expect(gbifUrlAsRelative('https://notgbif.org/foo')).toBeNull();
  });

  test('returns null for non-http schemes', () => {
    expect(gbifUrlAsRelative('mailto:helpdesk@gbif.org')).toBeNull();
    expect(gbifUrlAsRelative('javascript:alert(1)')).toBeNull();
  });

  test('returns null for unparseable input', () => {
    expect(gbifUrlAsRelative('not a url')).toBeNull();
    expect(gbifUrlAsRelative('gbif.org/foo')).toBeNull();
  });
});
