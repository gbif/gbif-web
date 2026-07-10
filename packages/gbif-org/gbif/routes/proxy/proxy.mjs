import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { publicEnv } from '../../envConfig.mjs';
import { NETWORK_PARTICIPANTS_QUERY } from '../../../src/routes/custom/gbifNetwork/networkParticipantQuery.mjs';
import { HEADER_QUERY } from '../../../src/gbif/header/query.mjs';
import { HOMEPAGE_QUERY } from '../../../src/routes/home/query.mjs';
import {
  OCCURRENCE_SNAPSHOTS_QUERY,
  OCCURRENCE_SNAPSHOTS_VARIABLES,
} from '../../../src/routes/custom/occurrenceSnapshots/query.mjs';
const PUBLIC_GRAPHQL_ENDPOINT = publicEnv.PUBLIC_GRAPHQL_ENDPOINT;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Bundled fallback used when GraphQL is unreachable on a cold cache, so the
// header endpoint still serves a usable menu instead of a 500.
function loadFallback(relativePath) {
  try {
    return JSON.parse(
      readFileSync(path.join(__dirname, '../../../src/config/fallback', relativePath), 'utf8')
    );
  } catch (err) {
    console.error(`Failed to load fallback ${relativePath}`, err);
    return undefined;
  }
}

const HEADER_FALLBACK = loadFallback('header.en.json');

const cache = {};

function getCachedResponse(name, graphqlQuery, fallback) {
  return async function (req, res) {
    const { locale = 'en', preview } = req.query;

    // In preview mode, bypass cache and fetch directly with the preview header
    if (preview === 'true') {
      try {
        const data = await getData({ query: graphqlQuery, locale, preview: true });
        res.set('Cache-Control', 'no-store, no-cache');
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
      }
      return;
    }

    const cacheKey = `${name}-${locale}`;
    // If we have a cached version, return it immediately and refresh in background
    if (cache[cacheKey]) {
      res.json(cache[cacheKey]);
      // Refresh cache in background (fire and forget)
      refreshCache(cacheKey, { query: graphqlQuery, locale }).catch(() => {
        // Silently fail - we'll try again on next request
      });
      return;
    }

    // No cache exists, we must wait for the fetch
    try {
      await refreshCache(cacheKey, { query: graphqlQuery, locale });
      res.json(cache[cacheKey]);
    } catch (error) {
      // Serve a bundled fallback (if any) so the site can still render rather
      // than failing because an upstream endpoint is down on a cold cache.
      if (fallback) {
        res.json(fallback);
        return;
      }
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
}

async function refreshCache(cacheKey, { query, variables, locale }) {
  const result = await getData({ query, variables, locale });
  cache[cacheKey] = result;
  return result;
}

async function getData({ query, variables, locale, preview }) {
  return fetchFromGraphQL({
    query,
    variables,
    locale,
    preview,
  });
}

async function fetchFromGraphQL({ query, variables, locale, preview }) {
  return fetch(PUBLIC_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'GBIF-portal',
      locale: locale || 'en',
      preview: preview ? 'true' : 'false',
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result.data || result.errors) {
        throw new Error('Failed or incomplete data');
      }
      return result.data;
    });
}

function refreshAll() {
  // currently er only prepopulate the cache for english, but this could be extended to other languages if needed
  // But even when jsut asking for english, it still triggers the same graphql calls, meaning that the other caches (e.g. content requests) will be warmed up on on start up and cached in other layers
  refreshCache('network-en', { query: NETWORK_PARTICIPANTS_QUERY }).catch((err) => {
    // silently ignore, we do not need the data right away
    console.error('Failed to initialize cache for network', err);
  });
  // english version only
  refreshCache('header-en', { query: HEADER_QUERY }).catch((err) => {
    // silently ignore, we do not need the data right away
    console.error('Failed to initialize cache for header', err);
  });
  refreshCache('home-en', { query: HOMEPAGE_QUERY }).catch((err) => {
    // silently ignore, we do not need the data right away
    console.error('Failed to initialize cache for home', err);
  });
  // Occurrence snapshots: the underlying REST call is slow (~3-4s cold) and the
  // page is low traffic, so without a periodic refresh the upstream
  // RESTDataSource + CDN entries go cold between visits.
  refreshCache('occurrence-snapshots-en', {
    query: OCCURRENCE_SNAPSHOTS_QUERY,
    variables: OCCURRENCE_SNAPSHOTS_VARIABLES,
  }).catch((err) => {
    console.error('Failed to initialize cache for occurrence snapshots', err);
  });
}

// refresh cache after 30 seconds. A better approach would be to only retry if not populated yet, and then retry with an interval
// if not the first request will take longer while we wait for the data to be fetched
setTimeout(() => {
  refreshAll();
}, 30 * 1000);

// keep the upstream caches warm so visitors after the initial preheat window
// don't pay the cold-cache cost.
const REFRESH_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
setInterval(refreshAll, REFRESH_INTERVAL_MS);

refreshAll();

export function register(app) {
  // disable caching for user-related API endpoints
  app.get(
    '/unstable-api/cached-response/network-page',
    getCachedResponse('network', NETWORK_PARTICIPANTS_QUERY)
  );
  app.get(
    '/unstable-api/cached-response/header',
    getCachedResponse('header', HEADER_QUERY, HEADER_FALLBACK)
  );
  app.get('/unstable-api/cached-response/home', getCachedResponse('home', HOMEPAGE_QUERY));
}
