import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const ENDPOINT = 'https://example.test/lib/translations';

async function freshModule() {
  vi.resetModules();
  return import('./loadMessages');
}

const config = { translationsEntryEndpoint: ENDPOINT } as never;
const locale = { code: 'en', localeCode: 'en' } as never;

function entry(hash: string) {
  return { en: { messages: `/en.json?v=${hash}` } };
}

describe('loadTranslationsEntry caching', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('serves the cached entry within the TTL and re-fetches after it', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => entry('old') })
      .mockResolvedValueOnce({ ok: true, json: async () => entry('new') });
    vi.stubGlobal('fetch', fetchMock);
    const { resolveMessagesPath } = await freshModule();

    expect(await resolveMessagesPath(config, locale)).toBe('/en.json?v=old');
    vi.setSystemTime(Date.now() + 9 * 60 * 1000);
    expect(await resolveMessagesPath(config, locale)).toBe('/en.json?v=old');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    vi.setSystemTime(Date.now() + 2 * 60 * 1000);
    expect(await resolveMessagesPath(config, locale)).toBe('/en.json?v=new');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('holds the bundled fallback for 30s after a failed load, then retries', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => entry('live') });
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { resolveMessagesPath } = await freshModule();

    const fallback = await resolveMessagesPath(config, locale);
    expect(fallback).toMatch(/^\/en\.json\?v=/);
    expect(fallback).not.toBe('/en.json?v=live');

    // Reused within the fallback TTL rather than refetched on every request.
    vi.setSystemTime(Date.now() + 20 * 1000);
    expect(await resolveMessagesPath(config, locale)).toBe(fallback);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // ...but expires well before a successful load would, so recovery is quick.
    vi.setSystemTime(Date.now() + 15 * 1000);
    expect(await resolveMessagesPath(config, locale)).toBe('/en.json?v=live');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
