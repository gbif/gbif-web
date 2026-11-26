/* eslint-env mocha */
import assert from 'assert';
import { isActiveTerm } from './activeTerm';

const now = new Date('2026-06-15T12:00:00Z');

describe('isActiveTerm', () => {
  it('treats missing terms and open ended terms as active', () => {
    assert.strictEqual(isActiveTerm(undefined, now), true);
    assert.strictEqual(isActiveTerm({ start: '2020-01-01' }, now), true);
    assert.strictEqual(isActiveTerm({ start: '2020-01-01', end: null }, now), true);
  });

  it('treats terms ending today or later as active and earlier as ended', () => {
    assert.strictEqual(isActiveTerm({ end: '2026-06-15' }, now), true);
    assert.strictEqual(isActiveTerm({ end: '2027-01-01T00:00:00Z' }, now), true);
    assert.strictEqual(isActiveTerm({ end: '2026-06-14' }, now), false);
    assert.strictEqual(isActiveTerm({ end: '2015-03-01' }, now), false);
  });
});
