import { publicEnv } from '../../envConfig.mjs';
import { NETWORK_PARTICIPANTS_QUERY } from '../../../src/routes/custom/gbifNetwork/networkParticipantQuery.mjs';
import { HEADER_QUERY } from '../../../src/gbif/header/query.mjs';
import { HOMEPAGE_QUERY } from '../../../src/routes/home/query.mjs';
const PUBLIC_GRAPHQL_ENDPOINT = publicEnv.PUBLIC_GRAPHQL_ENDPOINT;

const cache = {};

function getCachedResponse(name, graphqlQuery) {
  return async function (req, res) {
    // If we have a cached version, return it immediately and refresh in background
    if (cache[name]) {
      res.json(cache[name]);
      // Refresh cache in background (fire and forget)
      refreshCache(name, graphqlQuery).catch(() => {
        // Silently fail - we'll try again on next request
      });
      return;
    }

    // No cache exists, we must wait for the fetch
    try {
      await refreshCache(name, graphqlQuery);
      res.json(cache[name]);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  };
}

async function refreshCache(type, graphqlQuery) {
  const result = await getData({ graphqlQuery });
  cache[type] = result;
}

async function getData({ graphqlQuery }) {
  return fetchFromGraphQL({
    query: graphqlQuery,
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
  refreshCache('network', NETWORK_PARTICIPANTS_QUERY).catch((err) => {
    // silently ignore, we do not need the data right away
  });
  refreshCache('header', HEADER_QUERY).catch((err) => {
    // silently ignore, we do not need the data right away
  });
  refreshCache('home', HOMEPAGE_QUERY).catch((err) => {
    // silently ignore, we do not need the data right away
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
