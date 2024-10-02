import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';
import { stringify } from 'qs';

class DatasetAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiv1;
    this.config = context.config;
    this.context = context;
  }

  willSendRequest(_path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);
  }

  async searchDatasets({ query }) {
    const response = await this.get(
      '/dataset/search',
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
  }

  async listDatasets({ query }) {
    const response = await this.get(
      '/dataset',
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

  async getFromChecklistBank({ key }) {
    return this.get(
      `${this.config.checklistBank}/dataset/gbif-${key}.json`,
    ).catch(err => {
      // if status is 404, the dataset is not in checklistbank and we should simply return null
      // else the error should be allowed to bubble up
      if (err?.extensions?.response?.status === 404) {
        return null;
      }
      throw err;
    });
  }

  async getChecklistBankImport({ key, query = { state: 'finished', limit: 1 } }) {
    return this.get(
      `${this.config.checklistBank}/dataset/${key}/import`,
      stringify(query, { indices: false }),
    );
  }
}

export default DatasetAPI;
