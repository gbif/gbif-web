import { getTaxonAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource.js';

class SpeciesAPI extends QueuedRESTDataSource {
  constructor(config) {
    super({
      // Bulkhead pool for the experimental taxon API. Concurrency is configured
      // per pool in .env (requestPools.taxon.concurrency); see requestPools.ts.
      pool: 'taxon',
    });
    this.baseURL = `${config.apiv1}`;
    this.config = config;
  }

  willSendRequest(path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers.referer = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    request.agent = getTaxonAgent(this.baseURL, path);
  }

  async speciesByKey({ key }) {
    // if not a numeric key then just throw 404
    if (Number.isNaN(Number(key))) {
      // throw a 404 response
      const error = new Error(`Species with key ${key} not found`);
      error.status = 404;
      throw error;
    }
    return this.get(`/species/${key}`, null, {
      enQueue: true,
      signal: this.context.abortController.signal,
    });
  }
}

export default SpeciesAPI;
