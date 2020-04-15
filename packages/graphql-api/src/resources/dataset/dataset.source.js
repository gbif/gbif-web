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
    return response;
    // return {
    //   ...response,
    //   results: response.results.map(dataset => this.datasetReducer(dataset))
    // }
  }

  // leaving this inside the class to make the class easier to test
  // datasetReducer(dataset) {
  //   return dataset;
  // }

  async getDatasetByKey({ key }) {
    const response = await this.get(`/dataset/${key}`);
    return response;
    // return this.datasetReducer(response);
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
  
}

module.exports = DatasetAPI;