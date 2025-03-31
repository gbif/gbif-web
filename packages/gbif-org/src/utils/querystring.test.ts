import { expect, test } from 'vitest';
import { parse, stringify } from './querystring';

// the stringify function should take an object and return a string with the key value pairs. arrays are repeated as multie values. e.g foo=[1,2] becomes foo=1&foo=2
test('stringify', () => {
  expect(stringify({ datasetKey: 'abc' })).toBe('datasetKey=abc');
  expect(stringify({ datasetKey: 'abc', limit: 10 })).toBe('datasetKey=abc&limit=10');
  expect(stringify({ datasetKey: ['abc', 'def'] })).toBe('datasetKey=abc&datasetKey=def');
  expect(
    stringify({ identifier: ['https://www.gbif.org/occurrence/4535504068?test=1#anchor'] })
  ).toBe('identifier=https%3A%2F%2Fwww.gbif.org%2Foccurrence%2F4535504068%3Ftest%3D1%23anchor');
  expect(
    stringify({ datasetKey: 'abc', limit: null, offset: undefined }),
    'remove null and undefined'
  ).toBe('datasetKey=abc');
  expect(stringify({ filter: { test: 5 } }), 'handles objects').toBe('filter=%7B%22test%22%3A5%7D');
});

// the parse function should take the string and return an object with the key value pairs. arrays are repeated as multiple values. numbers are parsed as numbers
test('parse', () => {
  expect(parse('datasetKey=abc')).toStrictEqual({ datasetKey: 'abc' });
  expect(parse('datasetKey=abc&limit')).toStrictEqual({ datasetKey: 'abc', limit: null });
  expect(parse('datasetKey=abc&limit=10')).toStrictEqual({ datasetKey: 'abc', limit: 10 });
  expect(
    parse('identifier=https%3A%2F%2Fwww.gbif.org%2Foccurrence%2F4535504068%3Ftest%3D1%23anchor')
  ).toStrictEqual({ identifier: 'https://www.gbif.org/occurrence/4535504068?test=1#anchor' });
  expect(parse('datasetKey=abc&datasetKey=def')).toStrictEqual({ datasetKey: ['abc', 'def'] });
  expect(parse('filter=%7B%22test%22%3A5%7D')).toStrictEqual({ filter: { test: 5 } });
});
