import { RESTDataSource } from 'apollo-datasource-rest';

class TaxonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.useBie ? config.alaBie : config.apiEs;
    this.useBie = config.useBie;
  }

  async getTaxonByKey({ key }) {
    if (this.useBie) {
      const { taxonConcept, classification } = await this.get(
        `/species/${key}.json`,
      );
      return {
        key,
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

    const { documents } = await this.get(
      `/event-occurrence?apiKey=my-api-key&size=1&gbifClassification_acceptedUsage_key=${key}`,
    );
    const [result] = documents.results;

    return {
      ...result,
      key,
      scientificName: result.acceptedScientificName,
      rank: result.gbifClassification.acceptedUsage.rank,
    };
  }
}

export default TaxonAPI;
