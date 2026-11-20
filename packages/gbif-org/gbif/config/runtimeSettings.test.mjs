import { afterEach, describe, expect, it } from 'vitest';
import { getRuntimeSettings, setRuntimeSettings } from './runtimeSettings.mjs';

describe('runtime settings', () => {
  afterEach(() => setRuntimeSettings({ clientErrorReporting: true }));

  it('start with error reporting on', () => {
    expect(getRuntimeSettings()).toEqual({ clientErrorReporting: true });
  });

  it('change live', () => {
    expect(setRuntimeSettings({ clientErrorReporting: false })).toEqual({
      clientErrorReporting: false,
    });
    expect(getRuntimeSettings().clientErrorReporting).toBe(false);
  });

  it('refuse unknown settings and wrong types, changing nothing', () => {
    expect(() => setRuntimeSettings({ clientErrorReporting: false, other: 1 })).toThrow();
    expect(() => setRuntimeSettings({ clientErrorReporting: 'off' })).toThrow();
    expect(() => setRuntimeSettings({ toString: true })).toThrow();
    expect(() => setRuntimeSettings(null)).toThrow();
    expect(getRuntimeSettings().clientErrorReporting).toBe(true);
  });
});
