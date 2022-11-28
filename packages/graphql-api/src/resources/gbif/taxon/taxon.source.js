import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';
import { getParsedName } from '#/helpers/scientificName';

class TaxonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
  }

  async searchTaxa({ query }) {
    const response = await this.get(
      '/species/search',
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
  }

  async searchBackbone({ query }) {
    return this.searchTaxa({
      query: {
        ...stringify(query, { indices: false }),
        datasetKey: this.configBackboneUUID,
      },
    });
  }

  async getTaxonDetails({ resource, key, query }) {
    const response = await this.get(
      `/species/${key}/${resource}`,
      stringify(query, { indices: false }),
    );
    if (query) response._query = query;
    return response;
  }

  async getTaxonByKey({ key }) {
    return this.get(`/species/${key}`);
  }

  async getTaxonNameByKey({ key }) {
    return this.get(`/species/${key}/name`);
  }

  getTaxaByKeys({ taxonKeys }) {
    return Promise.all(taxonKeys.map((key) => this.getTaxonByKey({ key })));
  }

  async getChecklistRoots({ key, query }) {
    const response = await this.get(
      `/species/root/${key}`,
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
  }

  async getParsedName({ key }) {
    return getParsedName(key, this);
  }
}

export default TaxonAPI;
