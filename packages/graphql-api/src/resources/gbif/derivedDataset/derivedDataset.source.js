import { createSignedGetHeader } from '#/helpers/auth/authenticatedGet';
import { RESTDataSource } from 'apollo-datasource-rest';

class DerivedDatasetAPI extends RESTDataSource {
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

  async getUsersDerivedDataset({ username, query }) {
    return this.get(`/derivedDataset/user/${username}`, query, {
      cacheOptions: { ttl: 0 },
    });
  }
}

export default DerivedDatasetAPI;
