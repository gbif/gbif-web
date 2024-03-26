import { expect, test } from 'vitest';
import { isPositiveNumber } from './isPositiveNumber';

test('isPositiveNumber', () => {
  expect(isPositiveNumber(1)).toBe(true);
  expect(isPositiveNumber(0)).toBe(false);
  expect(isPositiveNumber(-1)).toBe(false);
  expect(isPositiveNumber('1')).toBe(false);
  expect(isPositiveNumber('')).toBe(false);
  expect(isPositiveNumber(null)).toBe(false);
  expect(isPositiveNumber(undefined)).toBe(false);
  expect(isPositiveNumber({})).toBe(false);
  expect(isPositiveNumber([])).toBe(false);
  expect(isPositiveNumber(() => {})).toBe(false);
});
