import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';
import { stringify } from 'qs';

class GadmAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiv1;
    this.context = context;
  }

  willSendRequest(_path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);
  }

  async getGadmById({ id }) {
    return this.get(`/geocode/gadm/${id}`);
  }
}

export default GadmAPI;
