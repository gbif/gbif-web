import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import { isValidUuid } from '@/helpers/utils';
import { urlPath } from '@/helpers/urlPath';
import { RESTDataSource } from '@/RESTDataSource';

const ONE_HOUR = 3600;

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

  // the job is polled while it runs, so a cached answer would freeze its status
  async getValidation(key) {
    if (!isValidUuid(key)) throw new NotFoundError();
    return this.get(urlPath`/validation/${key}`, undefined, {
      cacheOptions: { ttl: 0 },
    });
  }

  async getEml(key) {
    if (!isValidUuid(key)) throw new NotFoundError();
    return this.get(urlPath`/validation/${key}/eml`, undefined, {
      cacheOptions: { ttl: 0 },
    });
  }

  async getEvaluationCategories() {
    return this.get('/validation/enumeration/EvaluationCategory', undefined, {
      cacheOptions: { ttl: ONE_HOUR },
    });
  }
}

export default ValidationAPI;
