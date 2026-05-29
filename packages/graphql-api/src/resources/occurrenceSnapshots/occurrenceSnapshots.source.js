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
    return this.get(`/occurrence/download/user/download.gbif.org`, query);
  }
}

export default OccurrenceSnapshotsAPI;
