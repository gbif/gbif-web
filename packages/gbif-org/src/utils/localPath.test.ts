import { describe, expect, test } from 'vitest';
import { toLocalPath, toSafeLocation, toSafeReturnPath } from './localPath';

describe('toLocalPath', () => {
  test('keeps normal paths as they are', () => {
    expect(toLocalPath('/')).toBe('/');
    expect(toLocalPath('/country/dk')).toBe('/country/dk');
    expect(toLocalPath('/fr/occurrence/search?taxon_key=1#x')).toBe(
      '/fr/occurrence/search?taxon_key=1#x'
    );
    expect(toLocalPath('/en//double/slash')).toBe('/en//double/slash');
  });

  test('collapses leading slashes and backslashes into one slash', () => {
    expect(toLocalPath('//evil.com/country/dk')).toBe('/evil.com/country/dk');
    expect(toLocalPath('///evil.com')).toBe('/evil.com');
    expect(toLocalPath('/\\evil.com')).toBe('/evil.com');
    expect(toLocalPath('\\/evil.com')).toBe('/evil.com');
  });

  test('turns an absolute-form request target into a local path', () => {
    expect(toLocalPath('http://evil.com/x?a=1')).toBe('/http://evil.com/x?a=1');
  });

  test('gives / for an empty or missing target', () => {
    expect(toLocalPath('')).toBe('/');
    expect(toLocalPath(undefined)).toBe('/');
  });

  test('always resolves to our own origin', () => {
    const origin = 'https://www.gbif.org';
    for (const target of [
      '//evil.com',
      '/\\evil.com',
      '//\\evil.com',
      'http://evil.com',
      '\\\\evil.com',
    ]) {
      expect(new URL(toLocalPath(target), origin).origin).toBe(origin);
      expect(new URL(`${origin}${toLocalPath(target)}`).origin).toBe(origin);
    }
  });
});

describe('toSafeReturnPath', () => {
  test('accepts paths on this site', () => {
    expect(toSafeReturnPath('/')).toBe('/');
    expect(toSafeReturnPath('/user/profile')).toBe('/user/profile');
    expect(toSafeReturnPath('/fr/dataset/search?q=birds#top')).toBe(
      '/fr/dataset/search?q=birds#top'
    );
  });

  test('rejects anything that is not a string', () => {
    expect(toSafeReturnPath(null)).toBeUndefined();
    expect(toSafeReturnPath(undefined)).toBeUndefined();
    expect(toSafeReturnPath(42)).toBeUndefined();
  });

  test('rejects other sites', () => {
    expect(toSafeReturnPath('//evil.com')).toBeUndefined();
    expect(toSafeReturnPath('///evil.com')).toBeUndefined();
    expect(toSafeReturnPath('/\\evil.com')).toBeUndefined();
    expect(toSafeReturnPath('/\t/evil.com')).toBeUndefined();
    expect(toSafeReturnPath('/\n/evil.com')).toBeUndefined();
    expect(toSafeReturnPath('https://evil.com')).toBeUndefined();
    expect(toSafeReturnPath('https://www.gbif.org/user/profile')).toBeUndefined();
    expect(toSafeReturnPath(' //evil.com')).toBeUndefined();
  });

  test('rejects paths that normalise to another site', () => {
    expect(toSafeReturnPath('/..//evil.com')).toBeUndefined();
    expect(toSafeReturnPath('/./\\evil.com')).toBeUndefined();
    expect(toSafeReturnPath('/%2e%2e//evil.com')).toBeUndefined();
  });

  test('rejects scripts and relative paths', () => {
    expect(toSafeReturnPath('javascript:alert(1)')).toBeUndefined();
    expect(toSafeReturnPath('user/profile')).toBeUndefined();
    expect(toSafeReturnPath('')).toBeUndefined();
  });
});

describe('toSafeLocation', () => {
  test('keeps absolute http(s) URLs built by our own code', () => {
    expect(toSafeLocation('https://scientific-collections.gbif.org/about')).toBe(
      'https://scientific-collections.gbif.org/about'
    );
    expect(toSafeLocation('http://localhost:3000/country/DK')).toBe(
      'http://localhost:3000/country/DK'
    );
  });

  test('keeps paths on this site', () => {
    expect(toSafeLocation('/country/DK/summary?a=1')).toBe('/country/DK/summary?a=1');
  });

  test('falls back for anything that leaves the site', () => {
    expect(toSafeLocation('//evil.com')).toBe('/');
    expect(toSafeLocation('/\\evil.com')).toBe('/');
    expect(toSafeLocation('/dataset/abc/../../..//evil.com')).toBe('/');
    expect(toSafeLocation('https:/\\evil.com')).toBe('/');
    expect(toSafeLocation('javascript:alert(1)')).toBe('/');
    expect(toSafeLocation(null)).toBe('/');
    expect(toSafeLocation('//evil.com', '/user/login')).toBe('/user/login');
  });
});
