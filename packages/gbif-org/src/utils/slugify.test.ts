import { expect, test } from 'vitest';
import { slugify } from './slugify';

test('slugify', () => {
  expect(slugify('Hello World')).toBe('hello-world');
  expect(slugify('  Hello   World  ')).toBe('hello-world');
  expect(slugify('Hello_World')).toBe('hello-world');
  expect(slugify('Hello-World')).toBe('hello-world');
  expect(slugify('Hello123World')).toBe('hello123world');
  expect(slugify('Hello!@#$%^&*()World')).toBe('helloworld');
  expect(slugify('')).toBe('');
});
