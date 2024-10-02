import { translateContentfulResponse, objectToQueryString } from '#/helpers/utils';
import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';

export class ResourceAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiv1;
    this.config = context.config;
    this.context = context;
  }

  willSendRequest(_path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);
  }

  async getEntryById({ id, preview, locale }) {
    let path = `/content/${id}`;
    if (preview) path += `/preview?cacheBust=${Date.now()}`;

    const result = await this.get(path);
    return translateContentfulResponse(result, locale);
  }
}

export class ResourceSearchAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiEs;
    this.config = context.config;
    this.context = context;
  }

  willSendRequest(_path, request) {
    console.log(request);

    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);

    // request.headers['User-Agent'] = this.context.userAgent;
    // request.headers['referer'] = this.context.referer;
    // request.agent = getDefaultAgent(this.baseURL);
  }

  search = async (params, locale) => {
    const response = await this.get(`/content`, objectToQueryString(params));
    return translateContentfulResponse(response.documents, locale);
  }

  async getFirstEntryByQuery(params, locale) {
    const response = await this.search(params, locale);
    return response.results[0];
  }
}
