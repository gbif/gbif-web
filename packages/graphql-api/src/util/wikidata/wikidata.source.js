// const { ApolloError } = require('apollo-server');
const _ = require('lodash')
const { RESTDataSource } = require('apollo-datasource-rest');
const { decorateProperty, getItemData, getIUCNRedListData } = require('./helpers')
const { reducePerson } = require('./reducers');
const config = require('../../config');
const { wikidata } = config;
const USER_AGENT = "gbif-graphql/1.0";
const WIKI_GBIF_TAXON_IDENTIFIER = 'P846';
const IUCN_TAXON_IDENTIFIER = 'P627';
const IUCN_CONSERVATION_STATUS = 'P141';
const wdk = require('wikibase-sdk')(wikidata);

const properties = {
  INSTANCE_OF: 'P31',
  VIAF_ID: 'P214'
};
const entities = {
  HUMAN: 'Q5'
};

class WikiDataAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = '';
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', USER_AGENT);
    request.headers.set('Accept', 'application/json');
  }

  async getReverseClaims(property, value) {
    try {
      const response = await this.get(wdk.getReverseClaims(property, value.toString(), {
        keepProperties: true
      }));
      return response;
    } catch (err) {
      // Handle the error, logging?
      console.log(err)
    }
  }

  async getEntities(subjects) {
    try {
      const response = await this.get(wdk.getEntities(subjects));
      return response;
    } catch (err) {
      // Handle the error, logging?
      console.log(err)
    }
  }

  async decorateWithPropertyDescriptions(properties, locale = 'en') {
    if (properties.length === 0) {
      return '';
    }
    try {
      const res = await this.get(wdk.getEntities(
        properties.map((k) => _.get(k, `mainsnak.property`))
      ));
      return properties.map((p) => decorateProperty(p, res, locale));

    } catch (err) {
      // Handle the error, logging?
      console.log(err)
    }
  }

  async resolveWikiDataItem(id, locale = 'en') {
    try {
      const res = await this.get(wdk.getEntities(
        [id]
      ));
      return getItemData(id, res, locale);

    } catch (err) {
      // Handle the error, logging?
      console.log(err)
    }
  }

  async getWikiDataTaxonData(key, locale) {
    const [source, identifiers, identifier, threatStatus] = await Promise.all(
      [
        this.getTaxonSourceItem(key, locale),
        this.getTaxonIdentifiersFromGbifTaxonKey(key, locale),
        this.getIUCNIdentifier(key, locale),
        this.getIUCNThreatStatus(key, locale)
      ]);
    return {
      source,
      identifiers,
      iucn: {
        identifier,
        threatStatus
      }
    }
  }

  async getTaxonIdentifiersFromGbifTaxonKey(key, locale) {
    const reverseClaimResponse = await this.getReverseClaims(WIKI_GBIF_TAXON_IDENTIFIER, key)
    const entitiesIds = wdk.simplify.sparqlResults(reverseClaimResponse);
    if (entitiesIds.length === 0) {
      return null;
    }
    const entityResponse = await this.getEntities(entitiesIds.map((e) => e.subject))
    const keys = Object.keys(entityResponse.entities);
    const claims = _.get(entityResponse.entities, `${keys[0]}.claims`) || [];
    const claimKeys = Object.keys(claims);
    const externalIds = claimKeys
      .filter(
        (k) => _.get(claims, `${k}[0].mainsnak.datatype`) === 'external-id'
      )
      .map((k) => _.get(claims, `${k}[0]`));
    const identifiers = await this.decorateWithPropertyDescriptions(externalIds, locale);

    return identifiers;
  }

  async getTaxonSourceItem(key) {
    const reverseClaimResponse = await this.getReverseClaims(WIKI_GBIF_TAXON_IDENTIFIER, key)
    const entitiesIds = wdk.simplify.sparqlResults(reverseClaimResponse);
    if (entitiesIds.length === 0) {
      return null//throw new Error('not found');
    }
    const wikidataId = _.get(entitiesIds, '[0].subject');
    return {
      wikidataId: wikidataId,
      wikidataUrl: `https://www.wikidata.org/wiki/${wikidataId}`
    }
  }

  async getIUCNIdentifier(key, locale) {
    const reverseClaimResponse = await this.getReverseClaims(WIKI_GBIF_TAXON_IDENTIFIER, key)
    const entitiesIds = wdk.simplify.sparqlResults(reverseClaimResponse);
    if (entitiesIds.length === 0) {
      return null//throw new Error('not found');
    }
    const entityResponse = await this.getEntities(entitiesIds.map((e) => e.subject))
    const keys = Object.keys(entityResponse.entities);
    const claims = _.get(entityResponse.entities, `${keys[0]}.claims`) || [];
    const claimKeys = Object.keys(claims);
    const iucnIdentifier = await this.decorateWithPropertyDescriptions(claimKeys
      .filter(
        (k) => k === IUCN_TAXON_IDENTIFIER
      )
      .map((k) => _.get(claims, `${k}[0]`)), locale);
    return iucnIdentifier;
  }

  async getIUCNThreatStatus(key, locale) {
    const reverseClaimResponse = await this.getReverseClaims(WIKI_GBIF_TAXON_IDENTIFIER, key)
    const entitiesIds = wdk.simplify.sparqlResults(reverseClaimResponse);
    if (entitiesIds.length === 0) {
      return null//throw new Error('not found');
    }
    const entityResponse = await this.getEntities(entitiesIds.map((e) => e.subject))
    const keys = Object.keys(entityResponse.entities);
    const claims = _.get(entityResponse.entities, `${keys[0]}.claims`) || [];
    const claimKeys = Object.keys(claims);

    const threatStatus = _.get(claimKeys
      .filter(
        (k) => k === IUCN_CONSERVATION_STATUS
      )
      .map((k) => _.get(claims, `${k}[0]`)), '[0]');

    if (!threatStatus) {
      return '';
    }

    const res = await this.getEntities([_.get(threatStatus, `mainsnak.property`)])
    const value = await this.resolveWikiDataItem(_.get(threatStatus, 'mainsnak.datavalue.value.id'), locale);
    return getIUCNRedListData(value, res, threatStatus, locale)
  }

  async getPersonByKey({ key, locale = 'en' }) {
    const query = `SELECT DISTINCT ?human ?humanLabel ?image ?birthDate ?deathDate
      WHERE {
        VALUES ?human { wd:${key} }
        ?human wdt:P31 wd:Q5;       #find person
        OPTIONAL {
          ?human wdt:P18 ?image;
                wdt:P569 ?birthDate;
                wdt:P570 ?deathDate .
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
      }`;

    const response = await this.sparqlQuery({query});
    return this.getUniquePerson({response});
  }

  async sparqlQuery({query}) {
    const response = await this.get(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`);
    // apollo only accept a few content types so we have to parse it as JSON https://github.com/apollographql/apollo-server/issues/1976
    const entitiesIds = wdk.simplify.sparqlResults(response);
    return JSON.parse(response);
  }

  getUniquePerson({response}) {
    if (response?.results?.bindings?.length === 1) {
      const person = response.results.bindings[0];
      return {
        source: {
          type: 'WIKIDATA'
        },
        key: person?.human?.value,
        name: person?.humanLabel?.value,
        birthDate: person?.birthDate?.value,
        deathDate: person?.deathDate?.value,
        image: person?.image?.value,
      }
    }
    return null;
  }

  extractFirstClaimOfType({entity, fields}) {
    return Object.keys(fields).reduce((map, field) => {
      const claim = entity?.claims?.[fields[field]]?.[0];
      if (!claim) return map;

      const mainsnak = claim.mainsnak;
      let value = mainsnak?.datavalue?.value;
      if (mainsnak?.datavalue?.type === 'time') {
        let wikibaseTime = mainsnak?.datavalue?.value?.time;
        value = wdk.wikibaseTimeToISOString(wikibaseTime);
      }
      if (mainsnak?.datatype === 'commonsMedia') {
        value = wdk.getImageUrl(value);
      }
      if (typeof value !== 'undefined') {
        map[field] = value;
      }

      return map;
    }, {});
  }

  async getWikidataPersonByViaf({ key }) {
    return this.getWikidataPersonByIdentifier({property: 'P214', value: key});
  }

  async getWikidataPersonByOrcid({ key }) {
    return this.getWikidataPersonByIdentifier({property: 'P496', value: key});
  }

  async getWikidataPersonByIpni({ key }) {
    return this.getWikidataPersonByIdentifier({property: 'P586', value: key});
  }

  async getWikidataPersonByIdentifier({ property, value }) {
    const query = `SELECT DISTINCT ?human ?humanLabel ?image ?birthDate ?deathDate
      WHERE {
        ?human wdt:P31 wd:Q5 ;                    #find humans
              wdt:${property} '${value}' .       #find entities with a given property
        OPTIONAL {                                # If these properties are presenet, then we would like them as well
          ?human wdt:P18 ?image;
                wdt:P569 ?birthDate;
                wdt:P570 ?deathDate .
        }
        SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en" }
      }`;

    const response = await this.sparqlQuery({query});
    return this.getUniquePerson({response});
  }
}

module.exports = WikiDataAPI;