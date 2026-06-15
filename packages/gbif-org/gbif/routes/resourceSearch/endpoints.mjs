import { publicEnv } from '../../envConfig.mjs';

// New content search API that the legacy /api/resource/search endpoint proxies to.
const CONTENT_SEARCH_ENDPOINT = publicEnv.PUBLIC_CONTENT_SEARCH;

// Generic message used for all failures. We intentionally do not forward upstream
// error messages to the client - only a status code and this generic message.
const GENERIC_ERROR_MESSAGE = 'Failed to fetch content search results';

// Proxy legacy /api/resource/search?<params> requests to the new content search
// API, forwarding the query string untouched (e.g. -> https://hp-search.gbif.org/content?<params>).
async function resourceSearch(req, res) {
  if (!CONTENT_SEARCH_ENDPOINT) {
    res.status(500).json({ error: GENERIC_ERROR_MESSAGE });
    return;
  }

  // Use the raw query string from originalUrl so parameters are forwarded exactly
  // as received (preserving encoding and repeated params) rather than re-serialized.
  const queryString = req.originalUrl.split('?')[1] ?? '';
  const url = queryString ? `${CONTENT_SEARCH_ENDPOINT}?${queryString}` : CONTENT_SEARCH_ENDPOINT;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      // Expose only the upstream status, never its error body.
      res.status(response.status).json({ error: GENERIC_ERROR_MESSAGE });
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    // Network/parse errors are swallowed - we surface a generic 502 instead.
    res.status(502).json({ error: GENERIC_ERROR_MESSAGE });
  }
}

export function register(app) {
  app.get('/api/resource/search', resourceSearch);
}
