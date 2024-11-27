export const CANCEL_REQUEST = 'CANCEL_REQUEST';

export type CancelPromise = {
  promise: Promise<Response>;
  cancel: (reason?: string) => void;
};

// a small wrapper for convinence that simply adds an abort controller to all fetch requests
export function fetchWithCancel(url: string, init: object = {}): CancelPromise {
  const controller = new AbortController();
  const signal = controller.signal;
  return {
    promise: fetch(url, { signal, ...init }),
    cancel: (reason?: string) => controller.abort(reason ?? CANCEL_REQUEST),
  };
}