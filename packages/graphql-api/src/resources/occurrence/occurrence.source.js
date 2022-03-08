// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const { apiEs, apiEsKey, apiv1, apiv2 } = config;
const urlSizeLimit = 2000; // use GET for requests that serialized is less than N characters

class OccurrenceAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = apiEs;
  }

  willSendRequest(request) {
    // if (this.context.user) {
    //   // this of course do not make much sense. Currently is simply means, that you have to provide credentials to seach occurrences
    //   request.params.set('apiKey', apiEsKey);
    //   // request.headers.set('Authorization', `ApiKey-v1 ${apiEsKey}`);
    // } else {
    //   console.log('unauthorized attempt to do an occurrence search');
    // }

    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers.set('Authorization', `ApiKey-v1 ${apiEsKey}`);
  }

  async searchOccurrenceDocuments({ query }) {
    const response = await this.searchOccurrences({ query })
    return response.documents;
  }

  async searchOccurrences({ query }) {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get('/occurrence', { body: JSON.stringify(body) }, { signal: this.context.abortController.signal });
    } else {
      response = await this.post('/occurrence', body, { signal: this.context.abortController.signal });
    }
    response._predicate = body.predicate;
    return response;
  }

  async getOccurrenceByKey({ key }) {
    return this.get(`/occurrence/key/${key}`);
  }

  async getRelated({ key }) {
    return this.get(`${apiv1}/occurrence/${key}/experimental/related`);
  }

  async getFragment({ key }) {
    return this.get(`${apiv1}/occurrence/${key}/fragment`);
  }

  async getVerbatim({ key }) {
    return this.get(`${apiv1}/occurrence/${key}/verbatim`);
  }

  async getBionomia({occurrence}) {
    let { datasetKey, occurrenceID } = occurrence;
    return this.get(`https://bionomia.net/occurrences/search?datasetKey=${datasetKey}&occurrenceID=${occurrenceID}`).then(x => JSON.parse(x));
  }

  async meta({ query }) {
    const body = { ...query };
    const response = await this.post('/occurrence/meta', body);
    return response;
  }

  async registerPredicate({ predicate }) {
    try {
    let response = await this.post(`${apiv2}/map/occurrence/adhoc/predicate/`, predicate, { signal: this.context.abortController.signal });
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

  /*
  getOccurrencesByKeys({ occurrenceKeys }) {
    return Promise.all(
      occurrenceKeys.map(key => this.getOccurrenceByKey({ key })),
    );
  }
  */
}

module.exports = OccurrenceAPI;