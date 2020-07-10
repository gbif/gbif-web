// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const { API_ES, API_ES_KEY } = config;

class OccurrenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_ES;
  }

  willSendRequest(request) {
    if (this.context.user) {
      // this of course do not make much sense. Currently is simply means, that you have to provide credentials to seach occurrences
      request.params.set('apiKey', API_ES_KEY);
      // request.headers.set('Authorization', `ApiKey-v1 ${API_ES_KEY}`);
    } else {
      console.log('unauthorized attempt to do an occurrence search');
    }
  }

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({query})
    return response.documents;
  }

  async searchOccurrences({ query }) {
    const body = { ...query, includeMeta: true };
    const response = await this.post('/occurrence', body);
    response._predicate = body.predicate;
    return response;
  }

  async getOccurrenceByKey({ key }) {
    return this.get(`/occurrence/key/${key}`);
  }

  async getRelated({ key }) {
    return this.get(`http://api.gbif.org/v1/occurrence/${key}/experimental/related`);
  }

  async getFragment({ key }) {
    return this.get(`http://api.gbif.org/v1/occurrence/${key}/fragment`);
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/occurrence/meta', body);
    return response;
  }

  /*
  getOccurrencesByKeys({ occurrenceKeys }) {
    return Promise.all(
      occurrenceKeys.map(key => this.getOccurrenceByKey({ key })),
    );
  }
  */
}

module.exports = OccurrenceAPI;