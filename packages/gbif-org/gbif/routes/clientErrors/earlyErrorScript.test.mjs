// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MAX_REPORTS_PER_SESSION,
  SESSION_COUNT_KEY,
  renderEarlyErrorScript,
} from './clientErrors.mjs';

// Runs the inline script the server puts at the top of each page, as the browser would.
function runEarlyErrorScript() {
  const html = renderEarlyErrorScript('nonce');
  const code = html.replace(/^<script nonce="nonce">/, '').replace(/<\/script>$/, '');
  new Function(code)();
}

function throwOnWindow(message) {
  window.dispatchEvent(new ErrorEvent('error', { error: new Error(message), message }));
}

function failToLoad(tagName, url) {
  const element = document.createElement(tagName);
  if (tagName === 'link') {
    element.rel = 'modulepreload';
    element.href = url;
  } else {
    element.src = url;
  }
  document.head.appendChild(element);
  element.dispatchEvent(new Event('error')); // does not bubble, like a real load failure
}

let sendBeacon;

beforeEach(() => {
  vi.useFakeTimers();
  vi.resetModules();
  sessionStorage.clear();
  document.head.innerHTML = '';
  sendBeacon = vi.fn(() => true);
  Object.defineProperty(window.navigator, 'sendBeacon', { value: sendBeacon, configurable: true });
  window.__GBIF_COMMIT__ = 'a102096f4';
});

afterEach(() => {
  vi.useRealTimers();
  window.__GBIF_EARLY_ERRORS__ = undefined;
});

const sentReports = () => sendBeacon.mock.calls.map(([, body]) => JSON.parse(body));

describe('early error script', () => {
  it('queues errors from before the app starts', () => {
    runEarlyErrorScript();
    throwOnWindow('Thrown while loading');
    expect(window.__GBIF_EARLY_ERRORS__).toHaveLength(1);
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it('sends them itself if the app never starts', () => {
    runEarlyErrorScript();
    throwOnWindow('Thrown while loading');
    vi.advanceTimersByTime(10_000);
    expect(sentReports()).toEqual([
      expect.objectContaining({
        source: 'window',
        name: 'Error',
        message: 'Thrown while loading',
        path: '/',
        commit: 'a102096f4',
      }),
    ]);
    expect(sessionStorage.getItem(SESSION_COUNT_KEY)).toBe('1');
  });

  it('sends them when the visitor leaves before 10 seconds, and keeps listening', () => {
    runEarlyErrorScript();
    throwOnWindow('Thrown while loading');
    window.dispatchEvent(new Event('pagehide'));
    expect(sentReports().map((report) => report.message)).toEqual(['Thrown while loading']);

    throwOnWindow('Thrown after');
    vi.advanceTimersByTime(10_000);
    expect(sentReports().map((report) => report.message)).toEqual([
      'Thrown while loading',
      'Thrown after',
    ]);
  });

  it('counts against the same session limit as the app', () => {
    sessionStorage.setItem(SESSION_COUNT_KEY, String(MAX_REPORTS_PER_SESSION));
    runEarlyErrorScript();
    throwOnWindow('One too many');
    vi.advanceTimersByTime(10_000);
    expect(sendBeacon).not.toHaveBeenCalled();
  });

  it('reports only the first script that fails to load', () => {
    runEarlyErrorScript();
    failToLoad('link', `${location.origin}/assets/vendor-react-AbCd1234.js`);
    failToLoad('script', `${location.origin}/assets/main-EfGh5678.js?v=1`);
    vi.advanceTimersByTime(10_000);
    expect(sentReports()).toEqual([
      expect.objectContaining({
        name: 'ChunkLoadError',
        message: `Failed to load ${location.origin}/assets/vendor-react-AbCd1234.js`,
      }),
    ]);
  });

  it("ignores other sites' scripts, which ad blockers often block", () => {
    runEarlyErrorScript();
    failToLoad('script', 'https://status.example.org/embed/script.js');
    failToLoad('script', `${location.origin}/spoor/js/script.js`);
    failToLoad('script', `${location.origin}/assets/main-EfGh5678.js`);
    vi.advanceTimersByTime(10_000);
    expect(sentReports().map((report) => report.message)).toEqual([
      `Failed to load ${location.origin}/assets/main-EfGh5678.js`,
    ]);
  });

  it('hands its queue over to the app, which sends it instead', async () => {
    runEarlyErrorScript();
    throwOnWindow('Thrown while loading');
    const { enableClientErrorReporting } = await import('../../../src/utils/clientErrorReporting');
    enableClientErrorReporting();
    expect(window.__GBIF_EARLY_ERRORS__).toBe(null);
    expect(sendBeacon).toHaveBeenCalledTimes(1);
    expect(sendBeacon.mock.calls[0][0]).toBe('/api/client-error');

    // The fallback no longer fires, and errors from now on are the app's.
    vi.advanceTimersByTime(10_000);
    throwOnWindow('Thrown later');
    expect(sendBeacon).toHaveBeenCalledTimes(2);
    expect(sessionStorage.getItem(SESSION_COUNT_KEY)).toBe('2');
  });
});
