import config from '../config';

const translationEndpoint =
  config.translations || 'https://react-components.gbif.org/lib/translations';

// Per-language in-memory cache of the bundled translations file. We cache the
// in-flight promise so concurrent first requests for the same language share
// one HTTP call, and once it resolves all later requests get it for free for
// the lifetime of the process (i.e. loaded once, not per request).
const cache = new Map();

// How long to wait before allowing a retry after a failed load (ms).
const RETRY_COOLDOWN_MS = 60_000;
// How many times to retry within a single load attempt before giving up.
const MAX_RETRIES = 3;

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function fetchWithRetry(url) {
  let lastErr;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      // Exponential back-off: 1 s, 2 s, 4 s …
      await delay(1000 * 2 ** (attempt - 1));
    }
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (err) {
      lastErr = err;
      // eslint-disable-next-line no-console
      console.warn(
        `Translation fetch attempt ${
          attempt + 1
        }/${MAX_RETRIES} failed for ${url}: ${err.message}`,
      );
    }
  }
  throw lastErr;
}

function loadLanguage(lang) {
  if (cache.has(lang)) return cache.get(lang);
  const url = `${translationEndpoint}/${lang}.json`;
  const promise = fetchWithRetry(url).catch((err) => {
    // All retries exhausted. Evict the cache entry so a future request can
    // try again after the cooldown period rather than failing forever.,

    // eslint-disable-next-line no-console
    console.warn(
      `Failed to load translations for "${lang}" after ${MAX_RETRIES} attempts: ${err.message}`,
    );
    setTimeout(() => cache.delete(lang), RETRY_COOLDOWN_MS);
    return null;
  });
  cache.set(lang, promise);
  return promise;
}

/**
 * Look up an enum translation, e.g. enums.basisOfRecord.PRESERVED_SPECIMEN.
 * Returns null when the language file or specific key is missing so callers
 * can fall back to the raw key.
 *
 * The first call for a given language triggers a single HTTP fetch; all
 * later calls (for any key in that language) reuse the cached file.
 */
export default async function getEnumTranslation({
  enumName,
  value,
  language,
}) {
  const lang = language || 'en';
  const dictionary = await loadLanguage(lang);
  if (!dictionary) return null;
  const key = `enums.${enumName}.${value}`;
  return dictionary[key] ?? null;
}
