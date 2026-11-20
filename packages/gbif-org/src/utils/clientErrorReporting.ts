import { getBuildCommit } from './buildCommit';

// Sends errors from the browser to gbif.org's server, which logs them (gbif/routes/clientErrors).
// Only switched on by the gbif.org entry points; hosted portals run on other sites and have no
// such endpoint, so reportClientError does nothing there.

export type ClientErrorSource =
  | 'window'
  | 'unhandledrejection'
  | 'recoverable'
  | 'boundary'
  | 'route';

export type ClientErrorReport = {
  source: ClientErrorSource;
  name: string;
  message: string;
  stack?: string;
  componentStack?: string;
  graphQLErrors?: string[];
  path?: string;
  commit?: string;
};

const ENDPOINT = '/api/client-error';
// A page that keeps throwing should send a handful of reports, not thousands.
const MAX_REPORTS_PER_PAGE = 10;
// The server truncates too; this just keeps requests small.
const MAX_LENGTH = { message: 1000, stack: 4000, componentStack: 2000 };

function truncate(value: string | undefined | null, max: number): string | undefined {
  if (!value) return undefined;
  return value.length > max ? value.slice(0, max) : value;
}

type ErrorLike = {
  name?: unknown;
  message?: unknown;
  stack?: unknown;
  isCanceled?: unknown;
  graphQLErrors?: Array<{ message?: unknown }>;
};

export function buildReport(
  error: unknown,
  source: ClientErrorSource,
  {
    componentStack,
    path,
    commit,
  }: { componentStack?: string | null; path?: string; commit?: string }
): ClientErrorReport | null {
  let name = 'Error';
  let message: string | undefined;
  let stack: string | undefined;
  let graphQLErrors: string[] | undefined;

  if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object') {
    const e = error as ErrorLike;
    // A request we aborted ourselves, e.g. because the user navigated away.
    if (e.isCanceled === true || e.name === 'AbortError') return null;
    if (typeof e.name === 'string' && e.name) name = e.name;
    if (typeof e.message === 'string') message = e.message;
    if (typeof e.stack === 'string') stack = e.stack;
    if (Array.isArray(e.graphQLErrors)) {
      graphQLErrors = e.graphQLErrors
        .map((graphQLError) => graphQLError?.message)
        .filter((m): m is string => typeof m === 'string')
        .slice(0, 5);
    }
    // Rejections with plain objects ({ status: 500 } and the like).
    if (!message && !stack) {
      try {
        message = JSON.stringify(error).slice(0, 200);
      } catch {
        message = undefined;
      }
    }
  } else if (error != null) {
    message = String(error);
  }

  if (!message) return null;
  return {
    source,
    name,
    message: truncate(message, MAX_LENGTH.message)!,
    stack: truncate(stack, MAX_LENGTH.stack),
    componentStack: truncate(componentStack, MAX_LENGTH.componentStack),
    graphQLErrors: graphQLErrors?.length ? graphQLErrors : undefined,
    path,
    commit,
  };
}

// Errors we can't act on.
export function isNoise(report: ClientErrorReport): boolean {
  // Harmless browser warning surfaced as an error.
  if (/ResizeObserver loop/.test(report.message)) return true;
  // A script from another origin threw; the browser hides everything about it.
  if (report.message === 'Script error.' && !report.stack) return true;
  // Thrown by browser extensions, not by us.
  if (/(chrome|moz|safari(-web)?)-extension:\/\//.test(report.stack ?? '')) return true;
  return false;
}

type Reporter = {
  enable(): void;
  ignore(errors: unknown[]): void;
  report(
    error: unknown,
    source: ClientErrorSource,
    options?: { componentStack?: string | null }
  ): void;
};

export function createReporter({
  send,
  getPath,
  getCommit,
}: {
  send: (report: ClientErrorReport) => void;
  getPath: () => string | undefined;
  getCommit: () => string | undefined;
}): Reporter {
  let enabled = false;
  let sent = 0;
  const seen = new Set<string>();
  const ignored = new WeakSet<object>();

  return {
    enable() {
      enabled = true;
    },
    ignore(errors) {
      errors.forEach((error) => {
        if (error && typeof error === 'object') ignored.add(error);
      });
    },
    report(error, source, { componentStack } = {}) {
      if (!enabled || sent >= MAX_REPORTS_PER_PAGE) return;
      if (error && typeof error === 'object' && ignored.has(error)) return;
      try {
        const report = buildReport(error, source, {
          componentStack,
          path: getPath(),
          commit: getCommit(),
        });
        if (!report || isNoise(report)) return;
        // The same error is often caught twice (a boundary and window.onerror), or repeats.
        const key = `${report.name}: ${report.message}`;
        if (seen.has(key)) return;
        seen.add(key);
        sent += 1;
        send(report);
      } catch {
        // Reporting an error must never cause one.
      }
    },
  };
}

function sendToServer(report: ClientErrorReport) {
  const body = JSON.stringify(report);
  // sendBeacon survives the page being closed or navigated away from. text/plain keeps it a
  // simple request; the server parses it as JSON.
  if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: 'text/plain' }))) return;
  fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => undefined);
}

const reporter = createReporter({
  send: sendToServer,
  getPath: () => (typeof window === 'undefined' ? undefined : window.location.pathname),
  getCommit: getBuildCommit,
});

// Errors caught by error boundaries, the router, or React. Does nothing unless enabled, which only
// the gbif.org entry points do.
export function reportClientError(
  error: unknown,
  source: ClientErrorSource,
  options?: { componentStack?: string | null }
) {
  reporter.report(error, source, options);
}

declare global {
  interface Window {
    // Errors caught before the app started, queued by the inline script gbif/server.js puts at the
    // top of each page. Taken over (and set to null) when reporting is enabled.
    __GBIF_EARLY_ERRORS__?: Array<{ source: ClientErrorSource; error: unknown }> | null;
  }
}

// Errors that are not the browser's to report. The router starts with the errors the server hit
// while rendering the page (so it can show the same error page); the server has logged those.
export function ignoreClientErrors(errors: unknown[]) {
  reporter.ignore(errors);
}

let listening = false;

// Switches reporting on and reports errors nothing else catches.
export function enableClientErrorReporting() {
  if (typeof window === 'undefined' || listening) return;
  listening = true;
  reporter.enable();
  window.addEventListener('error', (event) => {
    reportClientError(event.error ?? event.message, 'window');
  });
  window.addEventListener('unhandledrejection', (event) => {
    reportClientError(event.reason, 'unhandledrejection');
  });

  const early = window.__GBIF_EARLY_ERRORS__;
  window.__GBIF_EARLY_ERRORS__ = null;
  early?.forEach(({ source, error }) => reportClientError(error, source));
}
