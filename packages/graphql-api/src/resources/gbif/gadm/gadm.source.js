import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class GadmAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
  }

  async getGadmById({ id }) {
    return this.get(`/geocode/gadm/${id}`);
  }
}

export default GadmAPI;
