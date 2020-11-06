// const { ApolloError } = require('apollo-server');
const { RESTDataSource } = require('apollo-datasource-rest');
const scientificName = require('../../util/scientificName');
const config = require('../../config');
const API_V1 = config.apiv1;
const GBIF_BACKBONE_UUID = config.gbifBackboneUUID;

class TaxonAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = API_V1;
  }

  async searchTaxa({ query }) {
    const response = await this.get('/species/search', query);
    response._query = query;
    return response;
  }

  async searchBackbone({ query }) {
    return this.searchTaxa({ query: { ...query, datasetKey: GBIF_BACKBONE_UUID } })
  }

  async getTaxonDetails({ resource, key, query }) {
    const response = await this.get(`/species/${key}/${resource}`, query);
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
    return Promise.all(
      taxonKeys.map(key => this.getTaxonByKey({ key })),
    );
  }

  async getChecklistRoots({ key, query }) {
    const response = await this.get(`/species/root/${key}`, query);
    response._query = query;
    return response;
  }

  async getParsedName({ key }) {
    return scientificName.getParsedName(key, this);
  }
}

module.exports = TaxonAPI;