import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class DatasetAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
  }

  async searchDatasets({ query }) {
    const response = await this.get(
      '/dataset/search',
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
  }

  async getDatasetByKey({ key }) {
    const response = await this.get(`/dataset/${key}`);
    return response;
  }

  getDatasetsByKeys({ datasetKeys }) {
    return Promise.all(datasetKeys.map((key) => this.getDatasetByKey({ key })));
  }

  async getConstituents({ key, query }) {
    return this.get(
      `/dataset/${key}/constituents`,
      stringify(query, { indices: false }),
    );
  }

  async getNetworks({ key, query }) {
    return this.get(
      `/dataset/${key}/networks`,
      stringify(query, { indices: false }),
    );
  }

  async getMetrics({ key, query }) {
    return this.get(
      `/dataset/${key}/metrics`,
      stringify(query, { indices: false }),
    );
  }

  async getGridded({ key, query }) {
    return this.get(
      `/dataset/${key}/gridded`,
      stringify(query, { indices: false }),
    );
  }
}

export default DatasetAPI;
