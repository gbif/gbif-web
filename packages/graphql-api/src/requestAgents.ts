import { Agent as HttpAgent } from 'node:http';
import { AgentOptions, Agent as HttpsAgent } from 'node:https';
import { get } from 'lodash';
import config from './config';

export type PoolName = 'occurrence' | 'taxon' | 'default';

function createGetAgentFn(httpsAgent: HttpsAgent, httpAgent: HttpAgent) {
  return (baseUrl: string, path: string) => {
    // If the path is absolute, we should respect the protocol provided
    if (path.startsWith('http'))
      return path.startsWith('https') ? httpsAgent : httpAgent;

    return baseUrl.startsWith('https') ? httpsAgent : httpAgent;
  };
}

// Per-pool socket settings, overridable via `.env` (`requestPools.<pool>.*`):
//  - maxSockets: cap on concurrent TCP sockets to a single origin. Size it to
//    the pool's concurrency (plus a little keep-alive headroom), not to a huge
//    number: with a bulkhead you never need more than ~concurrency sockets to a
//    host, and an oversized cap lets a burst consume thousands of ephemeral
//    ports and hit machine-wide EADDRNOTAVAIL. Also a lever for reproducing
//    socket starvation locally.
//  - timeout: socket inactivity timeout (ms). This is a best-effort backstop;
//    the authoritative request timeout is the AbortSignal applied per request in
//    requestPools.withPoolTimeout. Keeping both means a stalled upstream cannot
//    hold a socket open indefinitely.
const DEFAULTS = {
  maxSockets: 512,
  timeoutMs: 30000,
};

function poolSetting(pool: PoolName, key: 'maxSockets' | 'timeoutMs'): number {
  const value = get(config, ['requestPools', pool, key], DEFAULTS[key]);
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : DEFAULTS[key];
}

function makeAgents(pool: PoolName) {
  const options: AgentOptions = {
    keepAlive: true,
    maxSockets: poolSetting(pool, 'maxSockets'),
    timeout: poolSetting(pool, 'timeoutMs'),
  };
  return {
    https: new HttpsAgent(options),
    http: new HttpAgent(options),
  };
}

const occurrenceAgents = makeAgents('occurrence');
export const getOccurrenceAgent = createGetAgentFn(
  occurrenceAgents.https,
  occurrenceAgents.http,
);

const taxonAgents = makeAgents('taxon');
export const getTaxonAgent = createGetAgentFn(
  taxonAgents.https,
  taxonAgents.http,
);

const defaultAgents = makeAgents('default');
export const getDefaultAgent = createGetAgentFn(
  defaultAgents.https,
  defaultAgents.http,
);
