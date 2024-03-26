import { expect, test } from 'vitest';
import { toRecord } from './toRecord';

test('toRecord', () => {
  const array = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
  ];

  const keyFn = (item: { id: number }) => item.id;

  const result = toRecord(array, keyFn);

  expect(result).toEqual({
    1: { id: 1, name: 'John' },
    2: { id: 2, name: 'Jane' },
    3: { id: 3, name: 'Bob' },
  });
});
