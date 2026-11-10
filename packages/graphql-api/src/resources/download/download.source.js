import { RESTDataSource } from '@/RESTDataSource';
import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import { isValidUuid } from '@/helpers/utils';
import { encodePathSegment, splitDoi, urlPath } from '@/helpers/urlPath';

// Download keys look like 0001102-220831081235567. A download can also be looked
// up by its DOI (10.15468/dl.abc123), which the API takes as two path segments.
const DOWNLOAD_KEY_REGEX = /^\d+-\d+$/;
function downloadPath(base, key, suffix = '') {
  if (DOWNLOAD_KEY_REGEX.test(`${key}`)) {
    return `${base}/${encodePathSegment(key)}${suffix}`;
  }
  const doi = splitDoi(key);
  if (doi) {
    return `${base}/${encodePathSegment(doi.prefix)}/${encodePathSegment(doi.suffix)}${suffix}`;
  }
  throw new NotFoundError();
}

class DownloadAPI extends RESTDataSource {
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

  async datasetDownloads({ query }) {
    const { datasetKey, ...params } = query;
    if (!isValidUuid(datasetKey)) throw new NotFoundError();
    return this.get(
      urlPath`/occurrence/download/dataset/${datasetKey}`,
      params,
    );
  }

  async getUsersDownloads({ username, query }) {
    return this.get(urlPath`/occurrence/download/user/${username}`, query, {
      cacheOptions: { ttl: 0 },
    });
  }

  async getUsersEventDownloads({ username, query }) {
    return this.get(urlPath`/experimental/event/download/user/${username}`, query, {
      cacheOptions: { ttl: 0 },
    });
  }

  async getDownloadByKey({ key }) {
    return this.get(
      downloadPath('/occurrence/download', key),
      {
        statistics: true,
        cacheBuste: this.context?.user?.userName,
      },
      {
        cacheOptions: { ttl: this.context.user ? 0 : undefined },
      },
    );
  }

  async getEventDownloadByKey({ key }) {
    return this.get(
      downloadPath('/experimental/event/download', key),
      {
        statistics: true,
        cacheBuste: this.context?.user?.userName,
      },
      {
        cacheOptions: { ttl: this.context.user ? 0 : undefined },
      },
    );
  }

  async getContributingDatasetsByDownloadKey({ key, query }) {
    return this.get(
      downloadPath('/occurrence/download', key, '/datasets'),
      query,
    );
  }

  async getContributingDatasetsByEventDownloadKey({ key, query }) {
    return this.get(
      downloadPath('/experimental/event/download', key, '/datasets'),
      query,
    );
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
