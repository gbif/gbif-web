/* eslint-env mocha */
import assert from 'assert';
import { RESTDataSource } from './RESTDataSource';

const BASE = 'https://api.gbif.org/v1';

function resolve(path, baseURL = BASE) {
  const source = new RESTDataSource();
  source.baseURL = baseURL;
  return source.resolveURL(path).href;
}

describe('RESTDataSource.resolveURL', () => {
  [
    ['/dataset/abc', 'https://api.gbif.org/v1/dataset/abc'],
    ['dataset/abc', 'https://api.gbif.org/v1/dataset/abc'],
    ['/directory/person/123', 'https://api.gbif.org/v1/directory/person/123'],
    [`/event/abc/${encodeURIComponent('urn:event/1')}`, 'https://api.gbif.org/v1/event/abc/urn%3Aevent%2F1'],
    ['/occurrence/search?q=../x', 'https://api.gbif.org/v1/occurrence/search?q=../x'],
    // absolute URLs chosen by the data source are used as given
    ['https://api.gbif.org/v1/occurrence/1/verbatim', 'https://api.gbif.org/v1/occurrence/1/verbatim'],
    ['http://viaf.org/viaf/123', 'http://viaf.org/viaf/123'],
  ].forEach(([path, expected]) => {
    it(`resolves ${JSON.stringify(path)}`, () => {
      assert.strictEqual(resolve(path), expected);
    });
  });

  [
    // dot segments, however they are spelled
    '/directory/person/../../admin/x',
    '/directory/person/%2e%2e/%2e%2e/admin',
    '/directory/person/..\\..\\admin\\x',
    '/directory/person/.\t./.\n./admin',
    '/directory/person/.. ',
    // a relative path that becomes another host, or leaves the base path
    '/http://169.254.169.254/latest/meta-data?/record',
    '///internal.host:8080/x?/record',
    '//admin?/record',
    '/ /admin',
    ' //evil.com/x',
  ].forEach((path) => {
    it(`rejects ${JSON.stringify(path)}`, () => {
      assert.throws(
        () => resolve(path),
        (err) => {
          assert.strictEqual(err.extensions.code, 'BAD_USER_INPUT');
          return true;
        },
      );
    });
  });

  it('keeps relative paths on the base host and path for the ORCID shape', () => {
    assert.throws(() => resolve('/http://169.254.169.254/x?/record', 'https://pub.orcid.org/v3.0'));
    assert.strictEqual(
      resolve('/0000-0002-1825-0097/record', 'https://pub.orcid.org/v3.0'),
      'https://pub.orcid.org/v3.0/0000-0002-1825-0097/record',
    );
  });
});
