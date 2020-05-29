// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const { API_ES, API_ES_KEY } = config;

class OccurrenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_ES;
  }

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({query})
    return response.documents;
  }

  async searchOccurrences({ query }) {
    const body = { apiKey: API_ES_KEY, ...query, includeMeta: true };
    const response = await this.post('/occurrence', body);
    response._predicate = body.predicate;
    return response;
  }

  async getOccurrenceByKey({ key }) {
    return this.get(`/occurrence/${key}`);
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