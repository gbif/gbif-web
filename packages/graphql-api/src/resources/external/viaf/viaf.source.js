// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
// const config = require('../../../config');

function reduce(response) {
  const name = response?.mainHeadings?.data?.[0]?.text;
  return {
    key: response?.Document?.['@about'],
    name,
    ...response
  }
}

class ViafAPI extends RESTDataSource {
  constructor() {
    super();
    // this.baseURL = config.orcid.pubApi;
  }

  willSendRequest(request) {
    request.headers.set('Accept', 'application/json');
  }

  async getViafByKey({ key }) {
    return this.get(key).then(reduce);
  }
}

module.exports = ViafAPI;