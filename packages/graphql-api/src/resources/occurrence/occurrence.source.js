import { stringify } from 'qs';
import { urlSizeLimit } from '@/helpers/utils-ts';
import { getOccurrenceAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource';

const MAX_RESULTS = 6000;

// Is `url` under `baseURL`? Compares against "https://host/v1/", so that
// "https://host/v1x" doesn't count as being under "https://host/v1".
const isUnder = (url, baseURL) =>
  !!baseURL && url.startsWith(`${String(baseURL).replace(/\/+$/, '')}/`);

class OccurrenceAPI extends QueuedRESTDataSource {
  constructor(config) {
    super({
      // Bulkhead pool for es-api/occurrence traffic. The concurrency limit is
      // configured per pool in .env (requestPools.occurrence.concurrency) and
      // enforced process-wide; see requestPools.ts.
      pool: 'occurrence',
    });
    this.baseURL = config.apiEs;
    this.config = config;
  }

  willSendRequest(path, request) {
    // Most requests go to our own APIs, but the bionomia lookup goes to a third
    // party. The API key and the details about our client are only for our own.
    const url = this.resolveURL(path).href;
    const isGbifApi = [this.baseURL, this.config.apiv1, this.config.apiv2].some(
      (baseURL) => isUnder(url, baseURL),
    );
    if (isGbifApi) {
      request.headers['Authorization'] = `ApiKey-v1 ${this.config.apiEsKey}`;
      request.headers['User-Agent'] = this.context.userAgent;
      if (this.context.referer) request.headers['referer'] = this.context.referer;
      if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
      if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
      if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
      if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    }
    request.agent = getOccurrenceAgent(this.baseURL, path);
  }

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({ query });
    return response.documents;
  }

  async searchOccurrences({ query }) {
    const body = {
      ...query,
      includeMeta: true,
      checklistKey: query?.checklistKey ?? this.config.defaultChecklist,
    };
    if ((query?.from ?? 0) + (query?.size ?? 100) > MAX_RESULTS) {
      throw new Error(
        `Query exceeds maximum allowed size of ${MAX_RESULTS}. Please use our API https://techdocs.gbif.org/en/ or do a download.`,
      );
    }
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/occurrence',
        { body: JSON.stringify(body) },
        { signal: this.context.abortController.signal, enQueue: true },
      );
    } else {
      response = await this.post('/occurrence', body, {
        signal: this.context.abortController.signal,
        enQueue: true,
      });
    }
    response._predicate = body.predicate;
    response._q = query.q;
    return response;
  }

  async getOccurrenceByKey({ key }) {
    return this.get(`/occurrence/key/${key}`);
  }

  async getRelated({ key }) {
    return this.get(
      `${this.config.apiv1}/occurrence/${key}/experimental/related`,
    );
  }

  async getFragment({ key }) {
    return this.get(`${this.config.apiv1}/occurrence/${key}/fragment`);
  }

  async getVerbatim({ key }) {
    return this.get(`${this.config.apiv1}/occurrence/${key}/verbatim`);
  }

  async getBionomia({ occurrence }) {
    const { datasetKey, occurrenceID } = occurrence;
    return this.get('https://bionomia.net/occurrences/search', {
      datasetKey,
      occurrenceID,
    }).then((x) => JSON.parse(x));
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/occurrence/meta', body, {
      signal: this.context.abortController.signal,
      enQueue: true,
    });
    return response;
  }

  async publisherSuggest(query) {
    const response = await this.post(
      '/occurrence/suggest/publisherKey',
      query,
      {
        signal: this.context.abortController.signal,
      },
    );
    return response;
  }

  async datasetSuggest(query) {
    const response = await this.post('/occurrence/suggest/datasetKey', query, {
      signal: this.context.abortController.signal,
      enQueue: true,
    });
    return response;
  }

  async registerPredicate({ predicate }) {
    return this.post(
      `${this.config.apiv2}/map/occurrence/adhoc/predicate/`,
      predicate,
      { signal: this.context.abortController.signal, enQueue: true },
    );
  }

  async getMapCapabilities(query) {
    return this.get(
      `${this.config.apiv2}/map/occurrence/density/capabilities.json?`,
      stringify(query, { indices: false }),
    );
  }

  async searchCollections({ query }) {
    return this.get(
      '/grscicoll/collection',
      stringify(query, { indices: false }),
    );
  }

  /*
  getOccurrencesByKeys({ occurrenceKeys }) {
    return Promise.all(
      occurrenceKeys.map(key => this.getOccurrenceByKey({ key })),
    );
  }
  */
}

export default OccurrenceAPI;
