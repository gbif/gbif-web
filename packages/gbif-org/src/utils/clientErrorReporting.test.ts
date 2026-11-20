import { NotFoundError } from '@/errors';
import { QueryError } from '@/hooks/useQuery';
import { describe, expect, it } from 'vitest';
import { buildReport, ClientErrorReport, createReporter, isNoise } from './clientErrorReporting';

const context = { path: '/occurrence/search', commit: 'a102096f4' };

describe('buildReport', () => {
  it('reports an Error with its stack and component stack', () => {
    const error = new TypeError('boom');
    const report = buildReport(error, 'boundary', { ...context, componentStack: '\n    at Card' });
    expect(report).toMatchObject({
      source: 'boundary',
      name: 'TypeError',
      message: 'boom',
      componentStack: '\n    at Card',
      path: '/occurrence/search',
      commit: 'a102096f4',
    });
    expect(report?.stack).toContain('boom');
  });

  it('reports a failed query by its GraphQL errors, not the query or variables', () => {
    const error = new QueryError({
      graphQLErrors: [{ message: 'Upstream timed out' }, { path: ['x'] }],
      query: 'query { secret }',
      variables: { q: 'search term' },
    });
    const report = buildReport(error, 'route', context);
    expect(report?.name).toBe('QueryError');
    expect(report?.message).toContain('Upstream timed out');
    expect(report?.graphQLErrors).toEqual(['Upstream timed out']);
    expect(JSON.stringify(report)).not.toContain('search term');
    expect(JSON.stringify(report)).not.toContain('secret');
  });

  it('reports a query that failed on the network', () => {
    const error = new QueryError({ error: new TypeError('Failed to fetch'), query: 'q' });
    const report = buildReport(error, 'boundary', context);
    expect(report?.name).toBe('QueryError');
    expect(report?.message).toContain('Failed to fetch');
  });

  it('still reports a query error without any message', () => {
    // QueryError builds its message from its errors; with none, it is empty.
    const error = Object.assign(new QueryError({ query: 'q' }), {
      error: { message: 'Underlying cause' },
    });
    error.message = '';
    expect(buildReport(error, 'boundary', context)?.message).toBe('Underlying cause');
  });

  it('skips not found', () => {
    expect(buildReport(new NotFoundError(), 'boundary', context)).toBe(null);
    expect(buildReport(new Response(null, { status: 404 }), 'route', context)).toBe(null);
  });

  it('skips requests we cancelled ourselves', () => {
    expect(buildReport({ isCanceled: true, message: 'x' }, 'route', context)).toBe(null);
    expect(buildReport(new DOMException('aborted', 'AbortError'), 'route', context)).toBe(null);
  });

  it('copes with strings, plain objects and nothing', () => {
    expect(buildReport('just text', 'window', context)?.message).toBe('just text');
    // Only the field names of a plain object: its values could be anything.
    const report = buildReport({ status: 500, token: 'abc' }, 'unhandledrejection', context);
    expect(report?.message).toBe('Rejected with an object with fields: status, token');
    expect(JSON.stringify(report)).not.toContain('abc');
    expect(buildReport(undefined, 'unhandledrejection', context)).toBe(null);
  });
});

describe('isNoise', () => {
  const report = (overrides: Partial<ClientErrorReport>): ClientErrorReport => ({
    source: 'window',
    name: 'Error',
    message: 'x',
    ...overrides,
  });

  it('ignores errors we cannot act on', () => {
    expect(isNoise(report({ message: 'ResizeObserver loop limit exceeded' }))).toBe(true);
    expect(isNoise(report({ message: 'Script error.' }))).toBe(true);
    expect(isNoise(report({ stack: 'at x (chrome-extension://abc/content.js:1:1)' }))).toBe(true);
  });

  it('keeps real errors', () => {
    expect(isNoise(report({ message: 'Failed to fetch dynamically imported module' }))).toBe(false);
  });
});

describe('createReporter', () => {
  function setup() {
    const sent: ClientErrorReport[] = [];
    let count = 0;
    const reporter = createReporter({
      send: (report) => sent.push(report),
      getPath: () => '/',
      getCommit: () => undefined,
      counter: { get: () => count, set: (value) => (count = value) },
    });
    return { sent, reporter, setCount: (value: number) => (count = value) };
  }

  it('sends nothing until enabled', () => {
    const { sent, reporter } = setup();
    reporter.report(new Error('early'), 'boundary');
    expect(sent).toHaveLength(0);
    reporter.enable();
    reporter.report(new Error('later'), 'boundary');
    expect(sent).toHaveLength(1);
  });

  it('sends each error once, and at most five per session', () => {
    const { sent, reporter } = setup();
    reporter.enable();
    reporter.report(new Error('same'), 'boundary');
    reporter.report(new Error('same'), 'window');
    expect(sent).toHaveLength(1);
    for (let i = 0; i < 20; i++) reporter.report(new Error(`error ${i}`), 'window');
    expect(sent).toHaveLength(5);
  });

  it('keeps counting across page loads in the same session', () => {
    const { sent, reporter, setCount } = setup();
    setCount(5); // already sent five on earlier pages
    reporter.enable();
    reporter.report(new Error('after reload'), 'window');
    expect(sent).toHaveLength(0);
  });

  it('skips errors it was told to ignore', () => {
    const { sent, reporter } = setup();
    reporter.enable();
    const fromServer = new Error('fetch failed');
    reporter.ignore([fromServer, undefined]);
    reporter.report(fromServer, 'route');
    expect(sent).toHaveLength(0);
    reporter.report(new Error('fetch failed'), 'route');
    expect(sent).toHaveLength(1);
  });

  it('never throws, even if sending does', () => {
    const reporter = createReporter({
      send: () => {
        throw new Error('network down');
      },
      getPath: () => '/',
      getCommit: () => undefined,
      counter: { get: () => 0, set: () => undefined },
    });
    reporter.enable();
    expect(() => reporter.report(new Error('x'), 'window')).not.toThrow();
  });
});
