const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const { apiEs, apiEsKey } = config;
const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class LiteratureAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = apiEs;
  }

  willSendRequest(request) {
    request.headers.set('Authorization', `ApiKey-v1 ${apiEsKey}`);
  }

  async searchLiteratureDocuments({ query }) {
    const response = await this.searchLiterature({ query })
    return response.documents;
  }

  async searchLiterature({ query }) {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get('/literature', { body: JSON.stringify(body) }, { signal: this.context.abortController.signal });
    } else {
      response = await this.post('/literature', body, { signal: this.context.abortController.signal });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
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

module.exports = LiteratureAPI;