import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';
import { urlSizeLimit } from '#/helpers/utils-ts';
import { getOccurrenceAgent } from '#/requestAgents';

const MAX_RESULTS = 3000;

class OccurrenceAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiEs;
    this.config = config;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('Authorization', `ApiKey-v1 ${this.config.apiEsKey}`);
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getOccurrenceAgent(this.baseURL, request.path);
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
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/occurrence', body, {
        signal: this.context.abortController.signal,
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
    return this.get(
      `https://bionomia.net/occurrences/search?datasetKey=${datasetKey}&occurrenceID=${occurrenceID}`,
    ).then((x) => JSON.parse(x));
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/occurrence/meta', body);
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
    });
    return response;
  }

  async registerPredicate({ predicate }) {
    return this.post(
      `${this.config.apiv2}/map/occurrence/adhoc/predicate/`,
      predicate,
      { signal: this.context.abortController.signal },
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
