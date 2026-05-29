import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';
import { RESTDataSource } from '@/RESTDataSource';

class ValidationAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(path, request) {
    if (this.context.user) {
      const header = createSignedGetHeader(
        path,
        this.config,
        this.context.user.userName,
      );
      Object.keys(header).forEach((x) => { request.headers[x] = header[x]; });
    }
  }

  async getUsersValidation({ query }) {
    return this.get(`/validation`, query, {
      cacheOptions: { ttl: 0 },
    });
  }
}

export default ValidationAPI;
