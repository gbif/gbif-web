import { publicEnv } from '../../envConfig.mjs';
import { NETWORK_PARTICIPANTS_QUERY } from '../../../src/routes/custom/gbifNetwork/networkParticipantQuery.mjs';
import { HEADER_QUERY } from '../../../src/gbif/header/query.mjs';
import { HOMEPAGE_QUERY } from '../../../src/routes/home/query.mjs';
const PUBLIC_GRAPHQL_ENDPOINT = publicEnv.PUBLIC_GRAPHQL_ENDPOINT;

const cache = {};

function getCachedResponse(name, graphqlQuery) {
  return async function (req, res) {
    const { locale = 'en' } = req.query;
    const cacheKey = `${name}-${locale}`;
    // If we have a cached version, return it immediately and refresh in background
    if (cache[cacheKey]) {
      res.json(cache[cacheKey]);
      // Refresh cache in background (fire and forget)
      refreshCache(name, { query: graphqlQuery, headers: { locale } }).catch(() => {
        // Silently fail - we'll try again on next request
      });
      return;
    }

    // No cache exists, we must wait for the fetch
    try {
      await refreshCache(cacheKey, { query: graphqlQuery, locale });
      res.json(cache[cacheKey]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
}

async function refreshCache(cacheKey, { query, variables, locale }) {
  const result = await getData({ query, variables, locale });
  cache[cacheKey] = result;
  return result;
}

async function getData({ query, variables, locale }) {
  return fetchFromGraphQL({
    query,
    variables,
    locale,
  });
}

async function fetchFromGraphQL({ query, variables, locale }) {
  return fetch(PUBLIC_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      locale: locale || 'en',
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
}

// refresh cache after 30 seconds. A better approach would be to only retry if not populated yet, and then retry with an interval
// if not the first request will take longer while we wait for the data to be fetched
setTimeout(() => {
  refreshAll();
}, 30 * 1000);

refreshAll();

export function register(app) {
  // disable caching for user-related API endpoints
  app.get(
    '/unstable-api/cached-response/network-page',
    getCachedResponse('network', NETWORK_PARTICIPANTS_QUERY)
  );
  app.get('/unstable-api/cached-response/header', getCachedResponse('header', HEADER_QUERY));
  app.get('/unstable-api/cached-response/home', getCachedResponse('home', HOMEPAGE_QUERY));
}
