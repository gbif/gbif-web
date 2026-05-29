import { RESTDataSource } from '@/RESTDataSource';
import { createSignedGetHeader } from '@/helpers/auth/authenticatedGet';

class OccurrenceSnapshotsAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(path, request) {
    const header = createSignedGetHeader(
      path,
      this.config,
      'download.gbif.org',
    );
    Object.keys(header).forEach((x) => { request.headers[x] = header[x]; });
  }

  async getOccurrenceSnapshots({ query }) {
    // The upstream sends Cache-Control: no-cache because the endpoint is normally
    // used to list a user's private downloads. For download.gbif.org (public
    // snapshot listings) the data only changes when a new snapshot is published,
    // so we override the cache TTL.
    return this.get(`/occurrence/download/user/download.gbif.org`, query, {
      cacheOptions: { ttl: 60 * 60 },
    });
  }
}

export default OccurrenceSnapshotsAPI;
