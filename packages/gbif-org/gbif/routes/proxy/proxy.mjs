import { publicEnv } from '../../envConfig.mjs';
import { NETWORK_PARTICIPANTS_QUERY } from '../../../src/routes/custom/gbifNetwork/networkParticipantQuery.mjs';
import { HEADER_QUERY } from '../../../src/gbif/header/query.mjs';
import { HOMEPAGE_QUERY } from '../../../src/routes/home/query.mjs';
const PUBLIC_GRAPHQL_ENDPOINT = publicEnv.PUBLIC_GRAPHQL_ENDPOINT;

const cache = {};

export function register(app) {
  // disable caching for user-related API endpoints
  app.get('/unstable-api/cached-response/network-page', getCachedResponse('network'));
  app.get('/unstable-api/cached-response/header', getCachedResponse('header'));
  app.get('/unstable-api/cached-response/home', getCachedResponse('home'));
}

function getCachedResponse(type) {
  return async function (req, res) {
    // If we have a cached version, return it immediately and refresh in background
    if (cache[type]) {
      res.json(cache[type]);
      // Refresh cache in background (fire and forget)
      refreshCache(type).catch(() => {
        // Silently fail - we'll try again on next request
      });
      return;
    }

    // No cache exists, we must wait for the fetch
    try {
      await refreshCache(type);
      res.json(cache[type]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
}

async function refreshCache(type) {
  if (type === 'network') {
    const result = await getNetworkPage();
    cache[type] = result;
  } else if (type === 'header') {
    const result = await getHeader();
    cache[type] = result;
  } else if (type === 'home') {
    const result = await getHomePage();
    cache[type] = result;
  }
}

async function getNetworkPage() {
  return fetchFromGraphQL({
    query: NETWORK_PARTICIPANTS_QUERY,
    variables: {},
  });
}

async function getHeader() {
  return fetchFromGraphQL({
    query: HEADER_QUERY,
    variables: {},
  });
}

async function getHomePage() {
  return fetchFromGraphQL({
    query: HOMEPAGE_QUERY,
    variables: {},
  });
}

async function fetchFromGraphQL({ query, variables }) {
  return fetch(PUBLIC_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (!result.data || result.error) {
        throw new Error('Failed or incomplete data');
      }
      return result.data;
    });
}

function refreshAll() {
  refreshCache('network').catch((err) => {
    // silently ignore, we do not need the data right away
  });
  refreshCache('header').catch((err) => {
    // silently ignore, we do not need the data right away
  });
  refreshCache('home').catch((err) => {
    // silently ignore, we do not need the data right away
  });
}

// refresh cache after 30 seconds, this is a bit lazy but helps ensure we have data for first request even if graphql starts up after this service
// if not the first request will take longer while we wait for the data to be fetched
setTimeout(() => {
  refreshAll();
}, 30 * 1000);

refreshAll();
