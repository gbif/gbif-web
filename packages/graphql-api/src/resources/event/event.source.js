// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const { apiEs, apiEsKey, apiv2 } = config;
const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class EventAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = apiEs;
  }

  willSendRequest(request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('Authorization', `ApiKey-v1 ${apiEsKey}`);
  }

  async searchEventDocuments({ query }) {
    const response = await this.searchEvents({ query })
    return response.documents;
  }

  async searchEvents({ query }) {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get('/event', { body: JSON.stringify(body) }, { signal: this.context.abortController.signal });
    } else {
      response = await this.post('/event', body, { signal: this.context.abortController.signal });
    }
    response._predicate = body.predicate;
    return response;
  }

  async getEventByKey({ key }) {
    return this.get(`/event/key/${key}`);
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/event/meta', body);
    return response;
  }

  async registerPredicate({ predicate }) {
    try {
    let response = await this.post(`${apiv2}/map/event/adhoc/predicate/`, predicate, { signal: this.context.abortController.signal });
    return response;
    } catch(err) {
      return {
        err: {
          error: 'FAILED_TO_REGISTER_PREDICATE'
        },
        predicate: null
      }
    }
  }
}

module.exports = EventAPI;