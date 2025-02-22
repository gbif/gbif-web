/* eslint-disable class-methods-use-this */

import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import { get, merge } from 'lodash';
import wikibase from 'wikibase-sdk';
import { decorateProperty, getItemData, getIUCNRedListData } from './helpers';

const USER_AGENT = 'gbif-graphql/1.0';
const WIKI_GBIF_TAXON_IDENTIFIER = 'P846';
const IUCN_TAXON_IDENTIFIER = 'P627';
const IUCN_CONSERVATION_STATUS = 'P141';

class WikiDataAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = '';
    this.wdk = wikibase(config.wikidata);
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', USER_AGENT);
    request.headers.set('Accept', 'application/json');
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async getReverseClaims(property, value) {
    try {
      const response = await this.get(
        this.wdk.getReverseClaims(property, value.toString(), {
          keepProperties: true,
        }),
      );
      return response;
    } catch (err) {
      // Handle the error, logging?
      console.log(err);
    }

    return undefined;
  }

  async getEntities(subjects) {
    try {
      const response = await this.get(this.wdk.getEntities(subjects));
      return response;
    } catch (err) {
      // Handle the error, logging?
      console.log(err);
    }

    return undefined;
  }

  async decorateWithPropertyDescriptions(properties, locale = 'en') {
    if (properties.length === 0) return '';
    try {
      const urls = this.wdk.getManyEntities(
        properties.map((k) => get(k, `mainsnak.property`)),
      );

      const responses = await Promise.all(urls.map((url) => this.get(url)));
      const res = merge({}, ...responses);
      return properties.map((p) => decorateProperty(p, res, locale));
    } catch (err) {
      // Handle the error, logging?
      console.log(err);
    }

    return '';
  }

  async resolveWikiDataItem(id, locale = 'en') {
    try {
      const res = await this.get(this.wdk.getEntities([id]));
      return getItemData(id, res, locale);
    } catch (err) {
      // Handle the error, logging?
      console.log(err);
    }

    return undefined;
  }

  async getWikiDataTaxonData(key, locale) {
    const [source, identifiers, identifier, threatStatus] = await Promise.all([
      this.getTaxonSourceItem(key, locale),
      this.getTaxonIdentifiersFromGbifTaxonKey(key, locale),
      this.getIUCNIdentifier(key, locale),
      this.getIUCNThreatStatus(key, locale),
    ]);
    return {
      source,
      identifiers,
      iucn: {
        identifier,
        threatStatus,
      },
    };
  }

  async getTaxonIdentifiersFromGbifTaxonKey(key, locale) {
    const reverseClaimResponse = await this.getReverseClaims(
      WIKI_GBIF_TAXON_IDENTIFIER,
      key,
    );
    const entitiesIds = this.wdk.simplify.sparqlResults(reverseClaimResponse);
    if (entitiesIds.length === 0) {
      return null;
    }
    const entityResponse = await this.getEntities(
      entitiesIds.map((e) => e.subject),
    );
    const keys = Object.keys(entityResponse.entities);
    const claims = get(entityResponse.entities, `${keys[0]}.claims`) || [];
    const claimKeys = Object.keys(claims);
    const externalIds = claimKeys
      .filter((k) => get(claims, `${k}[0].mainsnak.datatype`) === 'external-id')
      .map((k) => get(claims, `${k}[0]`));
    const identifiers = await this.decorateWithPropertyDescriptions(
      externalIds,
      locale,
    );

    return identifiers;
  }

  async getTaxonSourceItem(key) {
    try {
      const reverseClaimResponse = await this.getReverseClaims(
        WIKI_GBIF_TAXON_IDENTIFIER,
        key,
      );
      const entitiesIds = this.wdk.simplify.sparqlResults(reverseClaimResponse);
      if (entitiesIds.length === 0) {
        return null; // throw new Error('not found');
      }
      const id = get(entitiesIds, '[0].subject');
      return {
        id,
        url: `https://www.wikidata.org/wiki/${id}`,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getIUCNIdentifier(key, locale) {
    const reverseClaimResponse = await this.getReverseClaims(
      WIKI_GBIF_TAXON_IDENTIFIER,
      key,
    );
    const entitiesIds = this.wdk.simplify.sparqlResults(reverseClaimResponse);
    if (entitiesIds.length === 0) {
      return null; // throw new Error('not found');
    }
    const entityResponse = await this.getEntities(
      entitiesIds.map((e) => e.subject),
    );
    const keys = Object.keys(entityResponse.entities);
    const claims = get(entityResponse.entities, `${keys[0]}.claims`) || [];
    const claimKeys = Object.keys(claims);
    const iucnIdentifier = await this.decorateWithPropertyDescriptions(
      claimKeys
        .filter((k) => k === IUCN_TAXON_IDENTIFIER)
        .map((k) => get(claims, `${k}[0]`)),
      locale,
    );
    return iucnIdentifier;
  }

  async getIUCNThreatStatus(key, locale) {
    const reverseClaimResponse = await this.getReverseClaims(
      WIKI_GBIF_TAXON_IDENTIFIER,
      key,
    );
    const entitiesIds = this.wdk.simplify.sparqlResults(reverseClaimResponse);
    if (entitiesIds.length === 0) {
      return null; // throw new Error('not found');
    }
    const entityResponse = await this.getEntities(
      entitiesIds.map((e) => e.subject),
    );
    const keys = Object.keys(entityResponse.entities);
    const claims = get(entityResponse.entities, `${keys[0]}.claims`) || [];
    const claimKeys = Object.keys(claims);

    const threatStatus = get(
      claimKeys
        .filter((k) => k === IUCN_CONSERVATION_STATUS)
        .map((k) => get(claims, `${k}[0]`)),
      '[0]',
    );

    if (!threatStatus) {
      return '';
    }

    const res = await this.getEntities([
      get(threatStatus, `mainsnak.property`),
    ]);
    const value = await this.resolveWikiDataItem(
      get(threatStatus, 'mainsnak.datavalue.value.id'),
      locale,
    );
    return getIUCNRedListData(value, res, threatStatus, locale);
  }

  async getPersonByKey({ key }) {
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

    const response = await this.sparqlQuery({ query });
    return this.getFirstMatch({ response });
  }

  async sparqlQuery({ query }) {
    const response = await this.get(
      `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(
        query,
      )}`,
    );
    // apollo only accept a few content types so we have to parse it as JSON https://github.com/apollographql/apollo-server/issues/1976
    // const entitiesIds = this.wdk.simplify.sparqlResults(response);
    return JSON.parse(response);
  }

  getFirstMatch({ response }) {
    if (response?.results?.bindings?.length >= 1) {
      const person = response.results.bindings[0];
      return {
        source: {
          type: 'WIKIDATA',
        },
        key: person?.human?.value,
        name: person?.humanLabel?.value,
        birthDate: person?.birthDate?.value,
        deathDate: person?.deathDate?.value,
        image: person?.image?.value,
      };
    }
    return null;
  }

  extractFirstClaimOfType({ entity, fields }) {
    return Object.keys(fields).reduce((map, field) => {
      const claim = entity?.claims?.[fields[field]]?.[0];
      if (!claim) return map;

      const { mainsnak } = claim;
      let value = mainsnak?.datavalue?.value;
      if (mainsnak?.datavalue?.type === 'time') {
        const wikibaseTime = mainsnak?.datavalue?.value?.time;
        value = this.wdk.wikibaseTimeToISOString(wikibaseTime);
      }
      if (mainsnak?.datatype === 'commonsMedia') {
        value = this.wdk.getImageUrl(value);
      }
      if (typeof value !== 'undefined') {
        // eslint-disable-next-line no-param-reassign
        map[field] = value;
      }

      return map;
    }, {});
  }

  async getWikidataPersonByViaf({ key }) {
    return this.getWikidataPersonByIdentifier({ property: 'P214', value: key });
  }

  async getWikidataPersonByOrcid({ key }) {
    return this.getWikidataPersonByIdentifier({ property: 'P496', value: key });
  }

  async getWikidataPersonByIpni({ key }) {
    return this.getWikidataPersonByIdentifier({ property: 'P586', value: key });
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

    const response = await this.sparqlQuery({ query });
    return this.getFirstMatch({ response });
  }
}

export default WikiDataAPI;
