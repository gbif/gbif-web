import { urlSizeLimit } from '#/helpers/utils-ts';
import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';

class LiteratureAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiEs;
    this.config = config;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `ApiKey-v1 ${this.config.apiEsKey}`);
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async searchLiteratureDocuments({ query }) {
    const response = await this.searchLiterature({ query });
    return response.documents;
  }

  async searchLiterature({ query }) {
    const body = { ...query, includeMeta: true };
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
