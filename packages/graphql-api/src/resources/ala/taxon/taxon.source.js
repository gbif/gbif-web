import { RESTDataSource } from 'apollo-datasource-rest';

class TaxonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.alaBie;
  }

  async getTaxonByKey({ key }) {
    const { taxonConcept, classification } = await this.get(
      `/species/${key}.json`,
    );
    return {
      taxonKey: key,
      rank: taxonConcept.rankString,
      scientificName: classification.scientificName,
      kingdom: classification.kingdom,
      kingdomKey: classification.kingdomGuid,
      phylum: classification.phylum,
      phylumKey: classification.phylumGuid,
      class: classification.class,
      classKey: classification.classGuid,
      order: classification.order,
      orderKey: classification.orderGuid,
      family: classification.family,
      familyKey: classification.familyGuid,
      genus: classification.genus,
      genusKey: classification.genusGuid,
      species: classification.species,
      speciesKey: classification.speciesGuid,
    };
  }
}

export default TaxonAPI;
