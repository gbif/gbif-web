import { urlSizeLimit } from '@/helpers/utils-ts';
import { getDefaultAgent } from '@/requestAgents';
import { RESTDataSource } from '@/RESTDataSource';

const MAX_RESULTS = 3000;

class LiteratureAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiEs;
    this.config = config;
  }

  willSendRequest(path, request) {
    request.headers['Authorization'] = `ApiKey-v1 ${this.config.apiEsKey}`;
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers['referer'] = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async searchLiteratureDocuments({ query }) {
    const response = await this.searchLiterature({ query });
    return response.documents;
  }

  async searchLiterature({ query }) {
    const body = { ...query, includeMeta: true };

    if ((query?.from ?? 0) + (query?.size ?? 100) > MAX_RESULTS) {
      throw new Error(
        `Query exceeds maximum allowed size of ${MAX_RESULTS}. Please use our API https://techdocs.gbif.org/en/ or do a download.`,
      );
    }

    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/literature',
        { body: JSON.stringify(body) },
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/literature', body, {
        signal: this.context.abortController.signal,
      });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    response._q = query.q;
    return response;
  }

  async getLiteratureByKey({ key }) {
    return this.get(`/literature/key/${key}`);
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/literature/meta', body);
    return response;
  }
}

export default LiteratureAPI;
