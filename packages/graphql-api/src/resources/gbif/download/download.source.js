import { createSignedGetHeader } from '#/helpers/auth/authenticatedGet';
import { RESTDataSource } from 'apollo-datasource-rest';

class DownloadAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(request) {
    if (this.context.user) {
      const header = createSignedGetHeader(
        request.path,
        this.config,
        this.context.user.userName,
      );
      Object.keys(header).forEach((x) => request.headers.set(x, header[x]));
    }
  }

  async datasetDownloads({ query }) {
    const { datasetKey, ...params } = query;
    return this.get(`/occurrence/download/dataset/${datasetKey}`, params);
  }

  async getUsersDownloads({ username, query }) {
    return this.get(`/occurrence/download/user/${username}`, query, {
      cacheOptions: { ttl: 0 },
    });
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
