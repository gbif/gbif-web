import { RESTDataSource } from '@/RESTDataSource';
import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import { splitDoi, urlPath } from '@/helpers/urlPath';

// Derived datasets are identified by their DOI (10.15468/dd.abc123), which the
// API takes as two path segments.
function derivedDatasetPath(key, suffix = '') {
  const doi = splitDoi(key);
  if (!doi) throw new NotFoundError();
  return urlPath`/derivedDataset/${doi.prefix}/${doi.suffix}` + suffix;
}

class DerivedDatasetAPI extends RESTDataSource {
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
        { userName: this.context.user.userName },
      );
      Object.keys(header).forEach((x) => { request.headers[x] = header[x]; });
    }
  }

  async getUsersDerivedDataset({ username, query }) {
    return this.get(urlPath`/derivedDataset/user/${username}`, query, {
      cacheOptions: { ttl: 0 },
    });
  }

  async getDerivedDataset({ key }) {
    return this.get(derivedDatasetPath(key), null, {
      cacheOptions: { ttl: 0 },
    });
  }

  async getContributingDatasetsByDerivedDatasetKey({ key, query }) {
    return this.get(derivedDatasetPath(key, '/datasets'), query, {
      cacheOptions: { ttl: 0 },
    });
  }
}

export default DerivedDatasetAPI;
