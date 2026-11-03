/* eslint-env mocha */
import assert from 'assert';
import { urlPath, splitDoi } from './urlPath';

describe('urlPath', () => {
  it('encodes each value as a single path segment', () => {
    assert.strictEqual(urlPath`/directory/person/${123}`, '/directory/person/123');
    assert.strictEqual(
      urlPath`/occurrence/download/${'0001102-220831081235567'}/datasets`,
      '/occurrence/download/0001102-220831081235567/datasets',
    );
    assert.strictEqual(urlPath`/occurrence/download/user/${'jane.doe'}`, '/occurrence/download/user/jane.doe');
    assert.strictEqual(urlPath`/admin/user/${'a+b@example.org'}`, '/admin/user/a%2Bb%40example.org');
  });

  it('keeps separators and other syntax inside the segment', () => {
    [
      ['../../admin/x', '..%2F..%2Fadmin%2Fx'],
      ['..\\..\\admin', '..%5C..%5Cadmin'],
      ['.\t./admin', '.%09.%2Fadmin'],
      ['.. ', '..%20'],
      ['..;', '..%3B'],
      ['1?x=y', '1%3Fx%3Dy'],
      ['1#x', '1%23x'],
      ['%2e%2e', '%252e%252e'],
      ['http://example.org/', 'http%3A%2F%2Fexample.org%2F'],
    ].forEach(([value, encoded]) => {
      assert.strictEqual(urlPath`/download/${value}`, `/download/${encoded}`);
    });
  });

  ['', '.', '..', null, undefined].forEach((value) => {
    it(`rejects ${JSON.stringify(value)}`, () => {
      assert.throws(
        () => urlPath`/download/${value}/datasets`,
        (err) => err.extensions.code === 'BAD_USER_INPUT',
      );
    });
  });
});

describe('splitDoi', () => {
  it('splits a DOI into prefix and suffix', () => {
    assert.deepStrictEqual(splitDoi('10.15468/dd.abc123'), {
      prefix: '10.15468',
      suffix: 'dd.abc123',
    });
  });

  ['', null, '10.15468', '10.15468/', '10.15468/a/b', '11.1/x', '10.15468/../x', '../10.15468/x'].forEach((value) => {
    it(`rejects ${JSON.stringify(value)}`, () => {
      assert.strictEqual(splitDoi(value), null);
    });
  });

  it('leaves a ".." suffix for urlPath to reject', () => {
    const { prefix, suffix } = splitDoi('10.15468/..');
    assert.throws(() => urlPath`/derivedDataset/${prefix}/${suffix}`);
  });
});
