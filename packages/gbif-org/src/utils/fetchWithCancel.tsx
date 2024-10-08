export const CANCEL_REQUEST = 'CANCEL_REQUEST';

// a small wrapper for convinence that simply adds an abort controller to all fetch requests
export function fetchWithCancel(url: string, init: object = {}): {
  promise: Promise<Response>;
  cancel: (reason?: string) => void;
} {
  const controller = new AbortController();
  const signal = controller.signal;
  return {
    promise: fetch(url, { signal, ...init }),
    cancel: (reason?: string) => controller.abort(reason ?? CANCEL_REQUEST),
  };
}