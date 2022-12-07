import { RESTDataSource } from 'apollo-datasource-rest';

class TaxonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.alaNamematching;
  }

  async getTaxonByKey({ key }) {
    // Call the namematching API & return the taxonomic data
    const data = await this.get(`/getByTaxonID?taxonID=${key}`);
    return {
      key,
      rank: data.rank,
      scientificName: data.scientificName,
      kingdom: data.kingdom,
      kingdomKey: data.kingdomID,
      phylum: data.phylum,
      phylumKey: data.phylumID,
      class: data.class,
      classKey: data.classID,
      order: data.order,
      orderKey: data.orderID,
      family: data.family,
      familyKey: data.familyID,
      genus: data.genus,
      genusKey: data.genusID,
      species: data.species,
      speciesKey: data.speciesID,
    };
  }
}

export default TaxonAPI;
