const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class LiteratureAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchLiterature({ query }) {
    console.log(query);
    const str = `/literature/search?${qs.stringify(query, { arrayFormat: 'repeat' })}`;
    const response = await this.get(str);
    response._query = query;
    return response;
  }

  async getLiteratureByKey({ key }) {
    return this.get(`/literature/${key}`);
  }
}

module.exports = LiteratureAPI;