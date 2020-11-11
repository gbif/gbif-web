// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../../config');

function reduce(response) {
  const givenNames = response?.person?.name?.['given-names']?.value;
  const familyName = response?.person?.name?.['family-name']?.value;
  const name = givenNames || familyName ? `${givenNames || ''} ${familyName || ''}`.trim() : null;
  return {
    key: response?.['orcid-identifier']?.path,
    name,
    ...response
  }
}

class OrcidAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = config.orcid.pubApi;
    
  }

  willSendRequest(request) {
    request.headers.set('Accept', 'application/json');
  }

  async getOrcidByKey({ key }) {
    // return this.get(`/${key}/record`);
    return this.get(key).then(reduce);
  }
}

module.exports = OrcidAPI;