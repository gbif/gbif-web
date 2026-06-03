/**
 * Updates the bundled fallback copies of the translations and the site header.
 *
 * These fallbacks are committed to the repository and bundled with the app so
 * that the site can always render a front page, a menu and translated strings
 * even when the live translations endpoint or the GraphQL/header endpoint is
 * unreachable (network outage, deploy, upstream downtime, ...).
 *
 * The committed files are NOT the source of truth - they are a stale-but-good
 * safety net. Run this script manually once in a while to refresh them:
 *
 *   npm run update-fallbacks
 *
 * Endpoints are read from the environment (the same variables the app uses,
 * loaded from .env.local / .env) and fall back to the public production
 * endpoints when not set.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { HEADER_QUERY } from '../src/gbif/header/query.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, '..');

// Load env the same way the rest of the tooling does. dotenv is optional - if it
// is not installed we simply fall back to the public production endpoints below.
try {
  const { default: dotenv } = await import('dotenv');
  dotenv.config({ path: path.join(packageRoot, '.env.local') });
  dotenv.config({ path: path.join(packageRoot, '.env') });
} catch {
  console.warn('dotenv not available - using process env / production defaults');
}

const TRANSLATIONS_ENDPOINT = (
  process.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT_CLIENT ||
  process.env.PUBLIC_TRANSLATIONS_ENTRY_ENDPOINT ||
  'https://react-components.gbif.org/lib/translations'
).replace(/\/$/, '');

const GRAPHQL_ENDPOINT =
  process.env.PUBLIC_GRAPHQL_ENDPOINT_CLIENT ||
  process.env.PUBLIC_GRAPHQL_ENDPOINT ||
  'https://graphql.gbif.org/graphql';

// The cms locale used to fetch the fallback header. The header is the same
// menu structure for every language; only the labels differ, so a single
// locale is an acceptable last-resort fallback.
const HEADER_LOCALE = process.env.FALLBACK_HEADER_LOCALE || 'en-GB';

const outDir = path.join(packageRoot, 'src', 'config', 'fallback');
const messagesDir = path.join(outDir, 'messages');

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function writeJson(filePath, data) {
  // Minify - these files are only ever read by code, never by humans.
  fs.writeFileSync(filePath, JSON.stringify(data));
}

// The translations endpoint serves more locales than the app exposes (e.g. a
// number of Pacific languages). Only bundle the locales the app can actually
// select, derived from the single source of truth in languagesOptions.tsx, so
// the fallback covers every configured language without shipping dead weight.
function getConfiguredLocaleCodes() {
  const file = fs.readFileSync(
    path.join(packageRoot, 'src', 'config', 'languagesOptions.tsx'),
    'utf8'
  );
  const codes = new Set();
  for (const match of file.matchAll(/localeCode:\s*'([^']+)'/g)) {
    codes.add(match[1]);
  }
  return codes;
}

async function updateTranslations() {
  console.log(`Fetching translations entry from ${TRANSLATIONS_ENDPOINT}/translations.json`);
  const entry = await fetchJson(`${TRANSLATIONS_ENDPOINT}/translations.json`);

  fs.mkdirSync(messagesDir, { recursive: true });
  // Keep the entry map readable - it is small and occasionally eyeballed.
  fs.writeFileSync(path.join(outDir, 'translations.json'), JSON.stringify(entry, null, 2));

  // Only keep locales that are both served and configured in the app.
  const configured = getConfiguredLocaleCodes();
  const locales = Object.keys(entry).filter((locale) => configured.has(locale));
  console.log(
    `Fetching ${locales.length} locale message files (of ${
      Object.keys(entry).length
    } served, filtered to configured locales)...`
  );

  const failed = [];
  await Promise.all(
    locales.map(async (locale) => {
      const messagesPath = entry[locale]?.messages;
      if (!messagesPath) return;
      try {
        const messages = await fetchJson(`${TRANSLATIONS_ENDPOINT}${messagesPath}`);
        writeJson(path.join(messagesDir, `${locale}.json`), messages);
      } catch (err) {
        failed.push(locale);
        console.error(`  ! failed to fetch messages for "${locale}": ${err.message}`);
      }
    })
  );

  // Remove stale locale files that are no longer served.
  for (const file of fs.readdirSync(messagesDir)) {
    const locale = file.replace(/\.json$/, '');
    if (!locales.includes(locale)) {
      fs.unlinkSync(path.join(messagesDir, file));
      console.log(`  - removed stale locale file ${file}`);
    }
  }

  console.log(`Wrote ${locales.length - failed.length} locale message files to ${messagesDir}`);
  return { locales: locales.length, failed };
}

async function updateHeader() {
  console.log(`Fetching header from ${GRAPHQL_ENDPOINT} (locale ${HEADER_LOCALE})`);
  const result = await fetchJson(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      locale: HEADER_LOCALE,
      preview: 'false',
    },
    body: JSON.stringify({ query: HEADER_QUERY }),
  });

  if (!result?.data?.gbifHome) {
    throw new Error('Header response did not contain the expected gbifHome data');
  }

  writeJson(path.join(outDir, 'header.en.json'), result.data);
  console.log(`Wrote header fallback to ${path.join(outDir, 'header.en.json')}`);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const translations = await updateTranslations();
  await updateHeader();

  fs.writeFileSync(
    path.join(outDir, 'meta.json'),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        translationsEndpoint: TRANSLATIONS_ENDPOINT,
        graphqlEndpoint: GRAPHQL_ENDPOINT,
        headerLocale: HEADER_LOCALE,
        locales: translations.locales,
        failedLocales: translations.failed,
      },
      null,
      2
    )
  );

  console.log('\nFallback files updated successfully.');
  if (translations.failed.length) {
    console.log(`Note: ${translations.failed.length} locale(s) failed: ${translations.failed.join(', ')}`);
  }
}

main().catch((err) => {
  console.error('\nFailed to update fallbacks:', err);
  process.exit(1);
});
