import { RESTDataSource } from '@apollo/datasource-rest';

class TaxonAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.config = context.config;
  }

  async getTaxonByKey({ key, useBie }) {
    // Call the namematching API & return the taxonomic data
    const data = await this.get(
      useBie
        ? `${this.config.ala.bie}/species/${key}`
        : `${this.config.ala.namematching}/getByTaxonID?taxonID=${key}`,
    );
    return useBie
      ? {
          key: data.taxonConcept.guid,
          // nubKey: null,
          kingdom: data.classification.kingdom,
          phylum: data.classification.phylum,
          class: data.classification.class,
          order: data.classification.order,
          family: data.classification.family,
          genus: data.classification.genus,
          species: data.classification.species,
          kingdomKey: data.classification.kingdomGuid,
          phylumKey: data.classification.phylumGuid,
          classKey: data.classification.classGuid,
          orderKey: data.classification.orderGuid,
          familyKey: data.classification.familyGuid,
          genusKey: data.classification.genusGuid,
          speciesKey: data.classification.speciesGuid,
          // accepted: null,
          // acceptedKey: null,
          authorship: data.taxonConcept.author,
          canonicalName: data.taxonConcept.nameString,
          // constituentKey: null,
          // constituent: null,
          // constituentTitle: null,
          // datasetKey: null,
          // dataset: null,
          // datasetTitle: null,
          // issues: null,
          // lastCrawled: null,
          // lastInterpreted: null,
          // nameKey: null,
          // nameType: null,
          nomenclaturalStatus: [],
          // numDescendants: null,
          // origin: null,
          // parent: null,
          parentKey: data.taxonConcept.parentGuid,
          rank: data.taxonConcept.rankString?.toUpperCase() || null,
          remarks: data.taxonConcept.taxonRemarks?.join(', ') || null,
          scientificName: data.taxonConcept.nameComplete,
          formattedName: data.taxonConcept.nameFormatted,
          // sourceTaxonKey: null,
          // synonym: null,
          taxonID: data.taxonConcept.guid,
          taxonomicStatus:
            data.taxonConcept.taxonomicStatus?.toUpperCase() || null,
          vernacularName: data.commonNames[0]?.nameString || null,
          // wikiData: null,
        }
      : {
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
