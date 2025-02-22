import { getOccurrenceAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';

class DownloadAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.agent = getOccurrenceAgent(this.baseURL, request.path);
  }

  async datasetDownloads({ query }) {
    const { datasetKey, ...params } = query;
    return this.get(`/occurrence/download/dataset/${datasetKey}`, params);
  }

  async getDownloadByKey({ key }) {
    return this.get(`/occurrence/download/${key}?statistics=true`);
  }

  async getContributingDatasetsByDownloadKey({ key, query }) {
    return this.get(`/occurrence/download/${key}/datasets`, query);
  }

  /*
  getDownloadsByKeys({ downloadKeys }) {
    return Promise.all(
      downloadKeys.map(key => this.getDownloadByKey({ key })),
    );
  }
  */
}

export default DownloadAPI;
