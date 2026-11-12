import type { Validation } from './types';

export const POLL_INTERVAL_MS = 1000;
export const MAX_NOT_FOUND_RETRIES = 10;

const IN_PROGRESS = new Set([
  'DOWNLOADING',
  'QUEUED',
  'WAITING_FOR_CHECKLISTBANK',
  'RUNNING',
  'SUBMITTED',
  'ACCEPTED',
]);
const TERMINAL = new Set(['FINISHED', 'FAILED']);

export function isInProgress(status?: string | null) {
  return !!status && IN_PROGRESS.has(status);
}

export type PollErrorKind = 'notFound' | 'unauthorized' | 'generic';

export type PollState =
  | { phase: 'idle' }
  // waiting for the first answer
  | { phase: 'loading'; notFoundCount: number; authRetried: boolean }
  // the job is known and in progress; validation holds the latest (partial) result
  | { phase: 'polling'; validation: Validation; notFoundCount: number; authRetried: boolean }
  // the API does not know the key yet; it often answers 404 right after a submit
  | {
      phase: 'contacting';
      validation?: Validation;
      notFoundCount: number;
      authRetried: boolean;
    }
  // FINISHED or FAILED
  | { phase: 'done'; validation: Validation }
  // ABORTED or a status this client does not know: show it, stop polling
  | { phase: 'stopped'; validation: Validation }
  | { phase: 'error'; kind: PollErrorKind; status?: number; validation?: Validation };

export type PollEvent =
  | { type: 'START'; validKey: boolean }
  | { type: 'RESPONSE'; validation: Validation }
  | { type: 'HTTP_ERROR'; status: number }
  | { type: 'NETWORK_ERROR' };

export type PollEffect =
  { type: 'none' } | { type: 'fetch'; delayMs: number; refreshToken?: boolean };

export type PollStep = { state: PollState; effect: PollEffect };

const NONE: PollEffect = { type: 'none' };

export const initialPollState: PollState = { phase: 'idle' };

function counters(state: PollState) {
  if (state.phase === 'loading' || state.phase === 'polling' || state.phase === 'contacting') {
    return { notFoundCount: state.notFoundCount, authRetried: state.authRetried };
  }
  return { notFoundCount: 0, authRetried: false };
}

function lastValidation(state: PollState): Validation | undefined {
  return 'validation' in state ? state.validation : undefined;
}

function notFound(state: PollState): PollStep {
  const { authRetried } = counters(state);
  const notFoundCount = counters(state).notFoundCount + 1;
  if (notFoundCount > MAX_NOT_FOUND_RETRIES) {
    return { state: { phase: 'error', kind: 'notFound', status: 404 }, effect: NONE };
  }
  return {
    state: { phase: 'contacting', validation: lastValidation(state), notFoundCount, authRetried },
    effect: { type: 'fetch', delayMs: POLL_INTERVAL_MS },
  };
}

export function transition(state: PollState, event: PollEvent): PollStep {
  // a finished chain ignores late answers; START is the only way back in
  const settled = state.phase === 'done' || state.phase === 'stopped' || state.phase === 'error';
  if (settled && event.type !== 'START') return { state, effect: NONE };

  switch (event.type) {
    case 'START':
      if (!event.validKey) {
        return { state: { phase: 'error', kind: 'notFound', status: 404 }, effect: NONE };
      }
      return {
        state: { phase: 'loading', notFoundCount: 0, authRetried: false },
        effect: { type: 'fetch', delayMs: 0 },
      };

    case 'RESPONSE': {
      const { validation } = event;
      const status = validation?.status;
      if (status === 'NOT_FOUND') return notFound(state);
      if (isInProgress(status)) {
        return {
          state: { phase: 'polling', validation, notFoundCount: 0, authRetried: false },
          effect: { type: 'fetch', delayMs: POLL_INTERVAL_MS },
        };
      }
      if (status && TERMINAL.has(status)) {
        return { state: { phase: 'done', validation }, effect: NONE };
      }
      return { state: { phase: 'stopped', validation }, effect: NONE };
    }

    case 'HTTP_ERROR': {
      if (event.status === 404) return notFound(state);
      if (event.status === 401 || event.status === 403) {
        const { notFoundCount, authRetried } = counters(state);
        if (!authRetried) {
          const validation = lastValidation(state);
          const next: PollState = validation
            ? { phase: 'polling', validation, notFoundCount, authRetried: true }
            : { phase: 'loading', notFoundCount, authRetried: true };
          return { state: next, effect: { type: 'fetch', delayMs: 0, refreshToken: true } };
        }
        return {
          state: {
            phase: 'error',
            kind: 'unauthorized',
            status: event.status,
            validation: lastValidation(state),
          },
          effect: NONE,
        };
      }
      return {
        state: {
          phase: 'error',
          kind: 'generic',
          status: event.status,
          validation: lastValidation(state),
        },
        effect: NONE,
      };
    }

    case 'NETWORK_ERROR':
      return {
        state: { phase: 'error', kind: 'generic', validation: lastValidation(state) },
        effect: NONE,
      };
  }
}
