// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const config = require('../../config');
const API_V1 = config.apiv1;

class DownloadAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async datasetDownloads({ query }) {
    const { datasetKey, ...params } = query;
    return this.get(`/occurrence/download/dataset/${datasetKey}`, params);
  }

  async getDownloadByKey({ key }) {
    return this.get(`/occurrence/download/${key}`);
  }

  /*
  getDownloadsByKeys({ downloadKeys }) {
    return Promise.all(
      downloadKeys.map(key => this.getDownloadByKey({ key })),
    );
  }
  */
}

module.exports = DownloadAPI;