import request from 'requestretry';
import { HttpsAgent } from 'agentkeepalive';
import config from '#/config';

// See https://www.npmjs.com/package/agentkeepalive
const stdAgent = new HttpsAgent({
  maxSockets: 8000, // Default = Infinity
  keepAlive: true,
});

const stdRequest = request.defaults({
  agent: stdAgent,
  headers: {
    'User-Agent': config.appKey,
  },
  maxAttempts: 2,
  retryDelay: 3000, // in milliseconds
  retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
  timeout: 20000, // in milliseconds
});

// seperate pool for occurrence requests as that API often has outages.
const occurrenceAgent = new HttpsAgent({
  maxSockets: 8000, // Default = Infinity
  keepAlive: true,
});

const occurrenceRequest = request.defaults({
  agent: occurrenceAgent,
  headers: {
    'User-Agent': config.appKey,
  },
  maxAttempts: 2,
  retryDelay: 3000, // in milliseconds
  retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
  timeout: 45000, // in milliseconds
});

// seperate pool for species requests as that API often has outages.
const speciesAgent = new HttpsAgent({
  maxSockets: 8000, // Default = Infinity
  keepAlive: true,
});

const speciesRequest = request.defaults({
  agent: speciesAgent,
  headers: {
    'User-Agent': config.appKey,
  },
  maxAttempts: 2,
  retryDelay: 3000, // in milliseconds
  retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
  timeout: 45000, // in milliseconds
});

// seperate pool for species requests as that API often has outages.
const blastAgent = new HttpsAgent({
  maxSockets: 1000, // Default = Infinity
  keepAlive: true,
});

const blastRequest = request.defaults({
  agent: blastAgent,
  headers: {
    'User-Agent': config.appKey,
  },
  maxAttempts: 2,
  retryDelay: 10000, // in milliseconds
  retryStrategy: request.RetryStrategies.HTTPOrNetworkError, // (default) retry on 5xx or network errors
  timeout: 90000, // in milliseconds
});

const requestAgents = {
  standard: stdRequest,
  occurrence: occurrenceRequest,
  species: speciesRequest,
  blast: blastRequest,
};

export default requestAgents;
