import { publicEnv } from '../../envConfig.mjs';
import { NETWORK_PARTICIPANTS_QUERY } from '../../../src/routes/custom/gbifNetwork/networkParticipantQuery.mjs';
const PUBLIC_GRAPHQL_ENDPOINT = publicEnv.PUBLIC_GRAPHQL_ENDPOINT;

const cache = {};

export function register(app) {
  // disable caching for user-related API endpoints
  app.get('/unstable-api/cached-response/network-page', getCachedNetworkPage);
}

async function getCachedNetworkPage(req, res) {
  // If we have a cached version, return it immediately and refresh in background
  if (cache.network) {
    res.json(cache.network);
    // Refresh cache in background (fire and forget)
    refreshNetworkCache().catch(() => {
      // Silently fail - we'll try again on next request
    });
    return;
  }

  // No cache exists, we must wait for the fetch
  try {
    await refreshNetworkCache();
    res.json(cache.network);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch network page data' });
  }
}

async function refreshNetworkCache() {
  const result = await getNetworkPage();
  cache.network = result;
}

async function getNetworkPage() {
  return fetchFromGraphQL({
    query: NETWORK_PARTICIPANTS_QUERY,
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

refreshNetworkCache();
