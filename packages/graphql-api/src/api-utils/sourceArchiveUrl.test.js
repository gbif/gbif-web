/* eslint-env mocha */
import assert from 'assert';
import { sourceArchiveUrl } from './sourceArchiveUrl';

const endpoint = 'https://source-archive.gbif.org';
const key = '0e5a6c5e-6a2c-4c0b-9d43-0b2f4b4b3a4e';

describe('sourceArchiveUrl', () => {
  it('builds the upstream url for a dataset key and file name', () => {
    assert.equal(sourceArchiveUrl(endpoint, key, 'tree.nex'), `${endpoint}/${key}/tree.nex`);
  });

  it('lower cases the dataset key', () => {
    assert.equal(sourceArchiveUrl(endpoint, key.toUpperCase(), 'tree.nex'), `${endpoint}/${key}/tree.nex`);
  });

  it('encodes file names with spaces and the like', () => {
    assert.equal(sourceArchiveUrl(endpoint, key, 'my tree (v2).nwk'), `${endpoint}/${key}/my%20tree%20(v2).nwk`);
  });

  it('encodes "?" and "#" so they stay part of the file name', () => {
    assert.equal(sourceArchiveUrl(endpoint, key, 'a?b=1#c'), `${endpoint}/${key}/a%3Fb%3D1%23c`);
  });

  it('encodes control characters, "%" and non-ASCII instead of passing them through', () => {
    assert.equal(sourceArchiveUrl(endpoint, key, '\r\nX'), `${endpoint}/${key}/%0D%0AX`);
    assert.equal(sourceArchiveUrl(endpoint, key, '.\t.'), `${endpoint}/${key}/.%09.`);
    assert.equal(sourceArchiveUrl(endpoint, key, '.. '), `${endpoint}/${key}/..%20`);
    assert.equal(sourceArchiveUrl(endpoint, key, '%2e%2e'), `${endpoint}/${key}/%252e%252e`);
    assert.equal(sourceArchiveUrl(endpoint, key, 'trée.nwk'), `${endpoint}/${key}/tr%C3%A9e.nwk`);
    assert.equal(sourceArchiveUrl(endpoint, key, 'a;b'), `${endpoint}/${key}/a%3Bb`);
  });

  it('allows names made only of more than two dots', () => {
    assert.equal(sourceArchiveUrl(endpoint, key, '...'), `${endpoint}/${key}/...`);
  });

  it('rejects dataset keys that are not UUIDs', () => {
    ['..', 'abc', `${key}\n`, `${key}/..`, '', undefined].forEach((bad) => {
      assert.equal(sourceArchiveUrl(endpoint, bad, 'tree.nex'), null, bad);
    });
  });

  it('rejects file names that could leave the dataset folder', () => {
    ['..', '.', '', '../../secret', 'a/b', 'a\\b', '\ud800', undefined].forEach((bad) => {
      assert.equal(sourceArchiveUrl(endpoint, key, bad), null, bad);
    });
  });
});
