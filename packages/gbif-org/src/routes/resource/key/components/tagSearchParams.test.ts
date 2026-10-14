import { expect, test } from 'vitest';
import { getTagSearchParams } from './tagSearchParams';

test('tags with a resource search filter get search params', () => {
  expect(getTagSearchParams('topics', 'AGRICULTURE')).toEqual({ topics: 'AGRICULTURE' });
  expect(getTagSearchParams('purposes', 'CAPACITY_ENHANCEMENT')).toEqual({
    purposes: 'CAPACITY_ENHANCEMENT',
  });
  expect(getTagSearchParams('countriesOfCoverage', 'DK')).toEqual({ countriesOfCoverage: 'DK' });
});

test('tags without a resource search filter get no search params', () => {
  expect(getTagSearchParams('audiences', 'DATA_USERS')).toBeUndefined();
});
