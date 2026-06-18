import { publicEnv } from '../../envConfig.mjs';

// New content search API that the legacy /api/resource/search endpoint proxies to.
const CONTENT_SEARCH_ENDPOINT = publicEnv.PUBLIC_CONTENT_SEARCH;

// Identifies this service (the gbif-org portal server) to the upstream API.
const USER_AGENT = 'GBIF-portal';

// Generic message used for all failures. We intentionally do not forward upstream
// error messages to the client - only a status code and this generic message.
const GENERIC_ERROR_MESSAGE = 'Failed to fetch content search results';

// Map of legacy parameter names to their new names on the content search API.
// If a legacy param name shows up in the incoming request, it is renamed to the
// new name before being forwarded. Add entries here as parameters get renamed,
// e.g. { oldName: 'newName' }.
const PARAM_RENAME_MAP = {
  programmeId: 'gbifProgramme',
};

// Apply PARAM_RENAME_MAP to a query string, preserving values, ordering and
// repeated params. Returns the rewritten query string (without leading '?').
function renameParams(queryString) {
  const params = new URLSearchParams(queryString);
  const renamed = new URLSearchParams();
  for (const [key, value] of params) {
    renamed.append(PARAM_RENAME_MAP[key] ?? key, value);
  }
  return renamed.toString();
}

// Proxy legacy /api/resource/search?<params> requests to the new content search
// API (e.g. -> https://hp-search.gbif.org/content?<params>), renaming any params
// listed in PARAM_RENAME_MAP along the way.
async function resourceSearch(req, res) {
  if (!CONTENT_SEARCH_ENDPOINT) {
    res.status(500).json({ error: GENERIC_ERROR_MESSAGE });
    return;
  }

  // Take the raw query string from originalUrl, then apply param renames.
  const rawQueryString = req.originalUrl.split('?')[1] ?? '';
  const queryString = renameParams(rawQueryString);
  const url = queryString ? `${CONTENT_SEARCH_ENDPOINT}?${queryString}` : CONTENT_SEARCH_ENDPOINT;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': USER_AGENT },
    });

    if (!response.ok) {
      // Expose only the upstream status, never its error body.
      res.status(response.status).json({ error: GENERIC_ERROR_MESSAGE });
      return;
    }

    const data = await response.json();
    res.json({
      warning: 'This is an internal and unstable endpoint that may change without notice.',
      ...data,
    });
  } catch (error) {
    // Network/parse errors are swallowed - we surface a generic 502 instead.
    res.status(502).json({ error: GENERIC_ERROR_MESSAGE });
  }
}

export function register(app) {
  app.get('/api/resource/search', resourceSearch);
}
