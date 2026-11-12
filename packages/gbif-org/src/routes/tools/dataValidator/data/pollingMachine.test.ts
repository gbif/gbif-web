import { describe, expect, it } from 'vitest';
import {
  initialPollState,
  MAX_FAILURE_RETRIES,
  MAX_NOT_FOUND_RETRIES,
  POLL_INTERVAL_MS,
  pollDelay,
  PollEvent,
  PollState,
  PollStep,
  transition,
} from './pollingMachine';

function run(events: PollEvent[], from: PollState = initialPollState): PollStep[] {
  const steps: PollStep[] = [];
  let state = from;
  for (const event of events) {
    const step = transition(state, event);
    steps.push(step);
    state = step.state;
  }
  return steps;
}

const last = (steps: PollStep[]) => steps[steps.length - 1];
const response = (status?: string) =>
  ({ type: 'RESPONSE', validation: { key: 'k', status } }) as const;
const times = <T>(n: number, item: T): T[] => Array.from({ length: n }, () => item);
const start = { type: 'START', validKey: true } as const;
const networkError = { type: 'NETWORK_ERROR' } as const;

describe('pollingMachine', () => {
  it('fetches at once on start', () => {
    const step = transition(initialPollState, { type: 'START', validKey: true });
    expect(step.state.phase).toBe('loading');
    expect(step.effect).toEqual({ type: 'fetch', delayMs: 0 });
  });

  it('never fetches for an invalid key', () => {
    const step = transition(initialPollState, { type: 'START', validKey: false });
    expect(step.state).toMatchObject({ phase: 'error', kind: 'notFound' });
    expect(step.effect.type).toBe('none');
  });

  it.each([
    'DOWNLOADING',
    'QUEUED',
    'WAITING_FOR_CHECKLISTBANK',
    'RUNNING',
    'SUBMITTED',
    'ACCEPTED',
  ])('polls again a second after %s and keeps the partial result', (status) => {
    const step = last(run([{ type: 'START', validKey: true }, response(status)]));
    expect(step.state).toMatchObject({ phase: 'polling', validation: { status } });
    expect(step.effect).toEqual({ type: 'fetch', delayMs: POLL_INTERVAL_MS });
  });

  it.each(['FINISHED', 'FAILED'])('stops at %s', (status) => {
    const step = last(
      run([{ type: 'START', validKey: true }, response('RUNNING'), response(status)])
    );
    expect(step.state).toMatchObject({ phase: 'done', validation: { status } });
    expect(step.effect.type).toBe('none');
  });

  it.each(['ABORTED', 'SOMETHING_NEW', undefined])(
    'stops and shows the status for %s',
    (status) => {
      const step = last(run([{ type: 'START', validKey: true }, response(status)]));
      expect(step.state.phase).toBe('stopped');
      expect(step.effect.type).toBe('none');
    }
  );

  it(`retries NOT_FOUND ${MAX_NOT_FOUND_RETRIES} times in a row, then gives up`, () => {
    const notFound = Array.from({ length: MAX_NOT_FOUND_RETRIES }, () => response('NOT_FOUND'));
    const steps = run([{ type: 'START', validKey: true }, ...notFound]);
    expect(last(steps).state.phase).toBe('contacting');
    expect(last(steps).effect).toEqual({ type: 'fetch', delayMs: POLL_INTERVAL_MS });

    const giveUp = transition(last(steps).state, response('NOT_FOUND'));
    expect(giveUp.state).toMatchObject({ phase: 'error', kind: 'notFound', status: 404 });
    expect(giveUp.effect.type).toBe('none');
  });

  it('treats HTTP 404 like a NOT_FOUND status', () => {
    const step = last(
      run([
        { type: 'START', validKey: true },
        { type: 'HTTP_ERROR', status: 404 },
      ])
    );
    expect(step.state).toMatchObject({ phase: 'contacting', notFoundCount: 1 });
  });

  it('resets the NOT_FOUND count on any in-progress answer', () => {
    const almost = Array.from({ length: MAX_NOT_FOUND_RETRIES }, () => response('NOT_FOUND'));
    const steps = run([
      { type: 'START', validKey: true },
      ...almost,
      response('QUEUED'),
      ...almost,
    ]);
    expect(last(steps).state.phase).toBe('contacting');
  });

  it('refreshes the token once on 401 or 403, then reports the auth error', () => {
    const steps = run([
      { type: 'START', validKey: true },
      { type: 'HTTP_ERROR', status: 401 },
    ]);
    expect(last(steps).effect).toEqual({ type: 'fetch', delayMs: 0, refreshToken: true });

    const second = transition(last(steps).state, { type: 'HTTP_ERROR', status: 403 });
    expect(second.state).toMatchObject({ phase: 'error', kind: 'unauthorized', status: 403 });
    expect(second.effect.type).toBe('none');
  });

  it('allows another token refresh after a successful answer', () => {
    const steps = run([
      { type: 'START', validKey: true },
      { type: 'HTTP_ERROR', status: 401 },
      response('RUNNING'),
      { type: 'HTTP_ERROR', status: 401 },
    ]);
    expect(last(steps).effect).toMatchObject({ refreshToken: true });
    expect(last(steps).state).toMatchObject({
      phase: 'polling',
      validation: { status: 'RUNNING' },
    });
  });

  it('keeps the last result when later requests keep failing', () => {
    const steps = run([
      start,
      response('RUNNING'),
      ...times(MAX_FAILURE_RETRIES + 1, { type: 'HTTP_ERROR', status: 500 } as const),
    ]);
    expect(last(steps).effect.type).toBe('none');
    expect(last(steps).state).toMatchObject({
      phase: 'error',
      kind: 'generic',
      status: 500,
      validation: { status: 'RUNNING' },
    });
  });

  it('reports network errors after the retries are used up', () => {
    const steps = run([start, ...times(MAX_FAILURE_RETRIES + 1, networkError)]);
    expect(steps[steps.length - 2].state.phase).toBe('loading');
    expect(last(steps).state).toMatchObject({ phase: 'error', kind: 'generic' });
    expect(last(steps).effect.type).toBe('none');
  });

  it('retries a network error while polling and keeps the result', () => {
    const step = last(run([start, response('RUNNING'), networkError]));
    expect(step.state).toMatchObject({
      phase: 'polling',
      validation: { status: 'RUNNING' },
      failureCount: 1,
    });
    expect(step.effect).toEqual({ type: 'fetch', delayMs: POLL_INTERVAL_MS });
  });

  it('retries an HTTP 503 before the first answer', () => {
    const step = last(run([start, { type: 'HTTP_ERROR', status: 503 }]));
    expect(step.state).toMatchObject({ phase: 'loading', failureCount: 1 });
    expect(step.effect).toEqual({ type: 'fetch', delayMs: POLL_INTERVAL_MS });
  });

  it.each([408, 429, 502])('treats HTTP %s as transient', (status) => {
    const step = last(run([start, response('RUNNING'), { type: 'HTTP_ERROR', status }]));
    expect(step.state.phase).toBe('polling');
  });

  it('doubles the delay on consecutive failures', () => {
    const steps = run([start, response('RUNNING'), ...times(MAX_FAILURE_RETRIES, networkError)]);
    const delays = steps
      .slice(2)
      .map((step) => step.effect.type === 'fetch' && step.effect.delayMs);
    expect(delays).toEqual([1000, 2000, 4000, 8000, 16000]);
  });

  it('resets the failure count on an answer', () => {
    const failures = times(MAX_FAILURE_RETRIES, networkError);
    const steps = run([start, ...failures, response('RUNNING'), ...failures]);
    expect(last(steps).state).toMatchObject({
      phase: 'polling',
      failureCount: MAX_FAILURE_RETRIES,
    });
    expect(last(steps).effect.type).toBe('fetch');
  });

  it('reports HTTP 400 at once', () => {
    const step = last(run([start, response('RUNNING'), { type: 'HTTP_ERROR', status: 400 }]));
    expect(step.state).toMatchObject({ phase: 'error', kind: 'generic', status: 400 });
    expect(step.effect.type).toBe('none');
  });

  it.each([
    [1, 1000],
    [30, 1000],
    [31, 3000],
    [120, 3000],
    [121, 10000],
  ])('pollDelay(%s) is %s', (count, delay) => {
    expect(pollDelay(count)).toBe(delay);
  });

  it('slows down polling for long jobs', () => {
    const steps = run([start, ...times(121, response('RUNNING'))]);
    const delayAt = (pollCount: number) => {
      const { effect, state } = steps[pollCount];
      expect(state).toMatchObject({ phase: 'polling', pollCount });
      return effect.type === 'fetch' && effect.delayMs;
    };
    expect(delayAt(1)).toBe(1000);
    expect(delayAt(31)).toBe(3000);
    expect(delayAt(121)).toBe(10000);
  });

  it('keeps the poll count through a failure and a token refresh', () => {
    const steps = run([
      start,
      ...times(31, response('RUNNING')),
      networkError,
      { type: 'HTTP_ERROR', status: 401 },
      response('RUNNING'),
    ]);
    expect(last(steps).state).toMatchObject({ pollCount: 32 });
    expect(last(steps).effect).toEqual({ type: 'fetch', delayMs: 3000 });
  });

  it('ignores late answers once settled', () => {
    const done = last(run([{ type: 'START', validKey: true }, response('FINISHED')])).state;
    const late = transition(done, response('RUNNING'));
    expect(late.state).toBe(done);
    expect(late.effect.type).toBe('none');
  });
});
