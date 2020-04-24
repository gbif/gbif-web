const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const API_V1 = config.API_V1;

class DatasetAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchDatasets({query}) {
    const response = await this.get('/dataset/search', query);
    response._query = query;
    return response;
  }

  async getDatasetByKey({ key }) {
    const response = await this.get(`/dataset/${key}`);
    return response;
  }

  getDatasetsByKeys({ datasetKeys }) {
    return Promise.all(
      datasetKeys.map(key => this.getDatasetByKey({ key })),
    );
  }

  async getConstituents({ key, query }) {
    return this.get(`/dataset/${key}/constituents`, query);
  }

  async getNetworks({ key, query }) {
    return this.get(`/dataset/${key}/networks`, query);
  }

  async getMetrics({ key, query }) {
    return this.get(`/dataset/${key}/metrics`, query);
  }
  
}

module.exports = DatasetAPI;