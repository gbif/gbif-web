import { stringify } from 'qs';
import { urlSizeLimit } from '@/helpers/utils-ts';
import { getOccurrenceAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import v1ToOccurrence, { isUnavailable } from './helpers/v1ToOccurrence';

const MAX_RESULTS = 6000;

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
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.Authorization = `ApiKey-v1 ${this.config.apiEsKey}`;
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers.referer = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
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
    // es-api returns the records as the v1 API serves them. Don't change the response in place: an
    // identical request in the same GraphQL request gets the same object back.
    return {
      ...response,
      documents: response.documents && {
        ...response.documents,
        // records es-api couldn't load come as just { key }; the results resolver reports them
        results: (response.documents.results ?? []).map((record) =>
          isUnavailable(record) ? { key: record.key, _unavailable: true } : v1ToOccurrence(record),
        ),
      },
      _predicate: body.predicate,
      _q: query.q,
    };
  }

  async getOccurrenceByKey({ key }) {
    // Validate key: must be numeric and within the valid range for a long
    if (!/^\d+$/.test(String(key)) || BigInt(key) > 9223372036854775807n) {
      throw new NotFoundError();
    }
    const record = await this.get(`${this.config.apiv1}/occurrence/${key}`);
    return v1ToOccurrence(record);
  }

  async getRelated({ key }) {
    return this.get(`${this.config.apiv1}/occurrence/${key}/experimental/related`);
  }

  async getFragment({ key }) {
    return this.get(`${this.config.apiv1}/occurrence/${key}/fragment`);
  }

  async getVerbatim({ key }) {
    return this.get(`${this.config.apiv1}/occurrence/${key}/verbatim`, undefined, {
      signal: this.context.abortController?.signal,
      enQueue: true,
    });
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
    const response = await this.post('/occurrence/suggest/publisherKey', query, {
      signal: this.context.abortController.signal,
    });
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
    return this.post(`${this.config.apiv2}/map/occurrence/adhoc/predicate/`, predicate, {
      signal: this.context.abortController.signal,
      enQueue: true,
    });
  }

  async getMapCapabilities(query) {
    return this.get(
      `${this.config.apiv2}/map/occurrence/density/capabilities.json?`,
      stringify(query, { indices: false }),
    );
  }

  async searchCollections({ query }) {
    return this.get('/grscicoll/collection', stringify(query, { indices: false }));
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
