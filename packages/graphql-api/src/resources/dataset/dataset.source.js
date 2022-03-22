const { RESTDataSource } = require('apollo-datasource-rest');
const qs = require('qs');
const config = require('../../config');
const API_V1 = config.apiv1;

class DatasetAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchDatasets({query}) {
    const response = await this.get('/dataset/search', qs.stringify(query, { indices: false }));
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
    return this.get(`/dataset/${key}/constituents`, qs.stringify(query, { indices: false }));
  }

  async getNetworks({ key, query }) {
    return this.get(`/dataset/${key}/networks`, qs.stringify(query, { indices: false }));
  }

  async getMetrics({ key, query }) {
    return this.get(`/dataset/${key}/metrics`, qs.stringify(query, { indices: false }));
  }

  async getGridded({ key, query }) {
    return this.get(`/dataset/${key}/gridded`, qs.stringify(query, { indices: false }));
  }
  
}

module.exports = DatasetAPI;