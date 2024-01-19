import { translateContentfulResponse, objectToQueryString } from '#/helpers/utils';
import { RESTDataSource } from 'apollo-datasource-rest';

export class ResourceAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  async getEntryById({ id, preview, locale }) {
    let path = `/content/${id}`;
    if (preview) path += `/preview?cacheBust=${Date.now()}`;

    const result = await this.get(path);
    return translateContentfulResponse(result, locale);
  }
}

export class ResourceSearchAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiEs;
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
