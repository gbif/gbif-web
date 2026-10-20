import { NotFoundLoaderResponse } from '@/errors';
import { QueryError } from '@/hooks/useQuery';
import { describe, expect, test } from 'vitest';
import { is404, throwCriticalErrors } from './rootErrorPage';

const notFound = { message: 'Request failed with status code 404', path: ['dataset'] };

describe('is404', () => {
  test('needs a 404 message at the given path', () => {
    expect(is404({ path: ['dataset'], errors: [notFound] })).toBe(true);
    expect(
      is404({ path: ['dataset'], errors: [{ ...notFound, path: ['literatureSearch'] }] })
    ).toBe(false);
    expect(is404({ path: ['dataset'], errors: [{ ...notFound, message: 'timeout' }] })).toBe(false);
    expect(is404({ path: ['dataset'], errors: undefined })).toBe(false);
  });
});

describe('throwCriticalErrors', () => {
  const dataset = { key: 'k' };

  test('lets partial data through: the page renders and shows the toast', () => {
    const errors = [{ message: 'failed', path: ['literatureSearch'] }];
    expect(() =>
      throwCriticalErrors({ path404: ['dataset'], errors, requiredObjects: [dataset] })
    ).not.toThrow();
  });

  test('throws a 404 response when the main object is not found', () => {
    expect(() =>
      throwCriticalErrors({ path404: ['dataset'], errors: [notFound], requiredObjects: [null] })
    ).toThrow(NotFoundLoaderResponse);
  });

  test('throws a QueryError when a required object is missing', () => {
    const errors = [{ message: 'failed', path: ['dataset'] }];
    expect(() =>
      throwCriticalErrors({ path404: ['dataset'], errors, requiredObjects: [dataset, undefined] })
    ).toThrow(QueryError);
  });
});
