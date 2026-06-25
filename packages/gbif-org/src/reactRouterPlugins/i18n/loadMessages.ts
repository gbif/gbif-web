import { Config, LanguageOption } from '@/config/config';
import { fallbackTranslationsEntry, loadFallbackMessages } from '@/config/fallback';

// Shared translation-message loading, used by both the server entry (during SSR render) and the
// client entry (before hydration). Messages are deliberately kept OUT of react-router loaderData so
// they are not serialized into every SSR response (~438 KB / 6,232 keys). Both sides load the same
// versioned file with the same merge logic, so the SSR HTML and the client's first render match.

type TranslationsEntry = Record<string, { messages?: string } | undefined>;

// Translations are deployed together with gbif-org and cannot change without a redeploy (which
// restarts the process and clears these caches), so in production successful loads are cached in
// memory indefinitely - avoiding a per-render fetch on every SSR request. In dev the per-locale
// message cache is bypassed so translation edits show up on reload. Failed loads are NOT cached so
// a transient outage degrades gracefully and is retried on the next request.
const messageCache = new Map<string, Promise<Record<string, string>>>();
const entryCache = new Map<string, Promise<TranslationsEntry>>();

function loadTranslationsEntry(config: Config): Promise<TranslationsEntry> {
  const url = `${config.translationsEntryEndpoint}/translations.json`;
  const cached = entryCache.get(url);
  if (cached) return cached;

  const promise = fetch(url)
    .then((r) => r.json())
    .catch((err) => {
      // The site must still render even when the translations endpoint is down,
      // so fall back to the bundled snapshot instead of failing the whole app.
      console.error('Failed to load translations entry file, using bundled fallback', err);
      return fallbackTranslationsEntry as TranslationsEntry;
    });

  entryCache.set(url, promise);
  return promise;
}

function loadLocaleMessages(
  messagesUrl: string,
  localeOption: LanguageOption
): Promise<Record<string, string>> {
  if (import.meta.env.PROD) {
    const cached = messageCache.get(messagesUrl);
    if (cached) return cached;
  }

  const promise = fetch(messagesUrl)
    .then((r) => {
      if (!r.ok) throw new Error(`Unexpected status ${r.status}`);
      return r.json();
    })
    .catch((err) => {
      // Fall back to the bundled messages for this locale (or English) so a
      // failed translation load degrades gracefully instead of taking down
      // the whole site.
      console.error('Failed to load translations for language, using bundled fallback');
      console.error('Failed language: ', localeOption.code, localeOption.localeCode, err);
      // Do not keep a failed/fallback result cached - retry the live endpoint next time.
      messageCache.delete(messagesUrl);
      return loadFallbackMessages(localeOption.localeCode);
    });

  if (import.meta.env.PROD) messageCache.set(messagesUrl, promise);
  return promise;
}

// Resolve the endpoint-independent, versioned path of the per-locale message file (e.g.
// `/en.json?v=<hash>`). This tiny string is inlined into the SSR response so the client can fetch
// the exact same versioned file the server rendered with. It is the *path* (not the full URL) on
// purpose: the server and client may use different translation endpoints (the docker SSR split in
// config.ts), so each side prepends its own `translationsEntryEndpoint` to this shared path.
export async function resolveMessagesPath(
  config: Config,
  localeOption: LanguageOption
): Promise<string> {
  const translations = await loadTranslationsEntry(config);
  return translations?.[localeOption.localeCode]?.messages ?? translations?.en?.messages ?? '';
}

// Full URL of the per-locale message file for this side's endpoint (server endpoint on the server,
// client endpoint on the client).
export async function resolveMessagesUrl(
  config: Config,
  localeOption: LanguageOption
): Promise<string> {
  return `${config.translationsEntryEndpoint}${await resolveMessagesPath(config, localeOption)}`;
}

// Memoize the merged result per resolved messages object so we don't re-spread the 6,232-key dict on
// every request. Keyed by the (stable, prod-cached) messages object via a WeakMap: a fallback/failed
// load returns a fresh object that isn't in messageCache, so it naturally isn't memoized here either
// - preserving the "retry on next request" behaviour for transient outages.
const mergedCache = new WeakMap<Record<string, string>, Record<string, string>>();

// Fetch + merge the messages for a locale from an already-resolved messages URL. Custom messages
// from config override the loaded ones (matching the previous loader's `{ ...messages, ...custom }`).
export async function loadMessagesFromUrl(
  config: Config,
  localeOption: LanguageOption,
  messagesUrl: string
): Promise<Record<string, string>> {
  const customMessages = config.messages?.[localeOption.code];
  const messages = await loadLocaleMessages(messagesUrl, localeOption);

  // No custom overrides (the gbif.org case): hand back the cached object directly - no per-request
  // copy of the whole dictionary. This was the dominant SSR CPU frame after fix 1c removed the
  // hydration serialization (see loadtest/PROFILE-FINDINGS.md).
  if (!customMessages || Object.keys(customMessages).length === 0) {
    return messages;
  }

  const cached = mergedCache.get(messages);
  if (cached) return cached;
  const merged = { ...messages, ...customMessages };
  mergedCache.set(messages, merged);
  return merged;
}

// Resolve the URL and load the merged messages in one step. Used by the server entry during SSR.
export async function getMessagesForLocale(
  config: Config,
  localeOption: LanguageOption
): Promise<Record<string, string>> {
  const messagesUrl = await resolveMessagesUrl(config, localeOption);
  return loadMessagesFromUrl(config, localeOption, messagesUrl);
}
