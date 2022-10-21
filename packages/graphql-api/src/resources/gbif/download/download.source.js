import { RESTDataSource } from 'apollo-datasource-rest';

class DownloadAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.gbif.apiv1;
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

export default DownloadAPI;
