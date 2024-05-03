import requestAgents from './requestAgents';
import logger from '#/logger';

let loggingBanned = false;
let activeRequestCount = 0;
let maxActiveRequestCount = 0;

const agentMapping = [
  { startsWith: '/v1/occurrence/', requestAgent: requestAgents.occurrence },
  { startsWith: '/v1/species/', requestAgent: requestAgents.species },
  { startsWith: '/blast/', requestAgent: requestAgents.blast },
];

type Callback = (error?: unknown, response?: unknown, body?: unknown) => void;

export default function requestWrapper(options: any, callback?: Callback) {
  const path = getPath(options.url);
  const match = agentMapping.find((e) => {
    return e.startsWith && path && path.startsWith(e.startsWith);
  });
  const requestAgent = match ? match.requestAgent : requestAgents.standard;
  // eslint-disable-next-line prefer-rest-params

  activeRequestCount++;
  maxActiveRequestCount = Math.max(maxActiveRequestCount, activeRequestCount);

  // eslint-disable-next-line prefer-rest-params
  return requestAgent(options)
    .then(function (response) {
      activeRequestCount--;
      logActivity();
      if (typeof callback === 'function') {
        callback(null, response, response.body);
      } else {
        return response;
      }
    })
    .catch(function (err) {
      activeRequestCount--;
      logActivity();
      if (typeof callback === 'function') {
        callback(err);
      } else {
        throw err;
      }
    });
}

function logActivity() {
  if (!loggingBanned && activeRequestCount > 100) {
    loggingBanned = true;
    logger.info({
      message: 'Number of concurrent requests from the portal',
      activeRequestCount: activeRequestCount,
      maxActiveRequestCount: maxActiveRequestCount,
    });
    setTimeout(function () {
      loggingBanned = false;
    }, 1000 * 60 * 5);
  }
}

function getPath(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.pathname;
  } catch (err) {
    logger.error({
      message: 'Failed to parse URL in request.ts',
      url: url,
      error: err,
    })
    return url;
  }
}
