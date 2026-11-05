/* eslint-env mocha */
import assert from 'assert';
import { assertSafeUpstreamPath } from './assertSafeUpstreamPath';

const BASE = 'https://api.gbif.org/v1/';

describe('assertSafeUpstreamPath', () => {
  [
    '/directory/person/123',
    '/dataset/4fa7b334-ce0d-4e88-aaae-2e0c138d049e',
    `/event/abc/${encodeURIComponent('urn:event/1')}`,
    `/taxon/x/${encodeURIComponent('Puma concolor (Linnaeus, 1771)')}`,
    '/occurrence/search?q=../x',
    'https://query.wikidata.org/sparql?format=json&query=x',
    '/file/my.file..name',
    '/search/.. ?q=x',
  ].forEach((path) => {
    it(`allows ${JSON.stringify(path)}`, () => {
      assert.doesNotThrow(() => assertSafeUpstreamPath(path));
    });
  });

  [
    '/directory/person/../../admin/x',
    '/directory/person/./1',
    '/directory/person/%2e%2e/%2E%2E/admin',
    '/directory/person/.%2e/admin',
    '/directory/person/..\\..\\admin\\x',
    '/directory/person/.\t./.\n./admin',
    '/directory/person/.\r./admin',
    '/directory/person/1\u0000/x',
    '/directory/person/.. ',
    '/directory/person/%2e%2e ',
    '/directory/person/.. \n',
  ].forEach((path) => {
    it(`rejects ${JSON.stringify(path)}`, () => {
      assert.throws(() => assertSafeUpstreamPath(path));
    });
  });

  it('every rejected traversal would otherwise have left the prefix', () => {
    ['directory/person/..\\..\\admin\\x', 'directory/person/.\t./.\n./admin'].forEach((path) => {
      const { pathname } = new URL(path, BASE);
      assert.ok(!pathname.startsWith('/v1/directory/person/'), pathname);
    });
  });
});
