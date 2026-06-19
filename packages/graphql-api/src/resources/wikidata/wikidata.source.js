/* eslint-disable class-methods-use-this */

import { get, merge } from 'lodash';
import wikibase from 'wikibase-sdk';
import { RESTDataSource } from '@/RESTDataSource';
import { getDefaultAgent } from '@/requestAgents';
import { decorateProperty, getItemData, getIUCNRedListData } from './helpers';
import logger from '@/logger';

const USER_AGENT = 'gbif-graphql/1.0';
const WIKI_GBIF_TAXON_IDENTIFIER = 'P10585'; // col P10585- backbone P846
const IUCN_TAXON_IDENTIFIER = 'P627';
const IUCN_CONSERVATION_STATUS = 'P141';

class WikiDataAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = '';
    this.wdk = wikibase(config.wikidata);
  }

  willSendRequest(path, request) {
    request.headers['User-Agent'] = USER_AGENT;
    request.headers.Accept = 'application/json';
    request.agent = getDefaultAgent(this.baseURL, path);
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
      const urls = this.wdk.getManyEntities(properties.map((k) => get(k, `mainsnak.property`)));

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
      // ignore errors and return undefined, as this is an optional part of the data and we don't want to fail the whole request if it can't be resolved
      logger.debug(`Error resolving Wikidata item ${id}: ${err.message}`);
    }
    return undefined;
  }

  /**
   * Single entry point for taxon data.
   *
   * Previously each of source / identifiers / IUCN identifier / IUCN threat
   * status independently called getReverseClaims (4x) and getEntities (3x) for
   * the same GBIF key. Now we resolve the GBIF key -> Wikidata entity once,
   * fetch that entity once, and derive everything from its `claims`.
   */
  async getWikiDataTaxonData(key, locale = 'en') {
    const empty = {
      source: null,
      identifiers: [],
      iucn: {
        identifier: null,
        threatStatus: '',
      },
    };

    const reverseClaimResponse = await this.getReverseClaims(WIKI_GBIF_TAXON_IDENTIFIER, key);
    const entitiesIds = this.wdk.simplify.sparqlResults(reverseClaimResponse);
    if (!entitiesIds || entitiesIds.length === 0) {
      return empty;
    }

    const id = get(entitiesIds, '[0].subject');
    const entityResponse = await this.getEntities(entitiesIds.map((e) => e.subject));
    const entityKey = Object.keys(entityResponse?.entities || {})[0];
    const claims = get(entityResponse, `entities.${entityKey}.claims`) || {};

    // The three pieces that still need extra entity lookups can run in parallel,
    // but they all share the single `claims` object fetched above.
    const [identifiers, identifier, threatStatus] = await Promise.all([
      this.extractTaxonIdentifiers(claims, locale),
      this.extractIUCNIdentifier(claims, locale),
      this.extractIUCNThreatStatus(claims, locale),
    ]);

    return {
      source: {
        id,
        url: `https://www.wikidata.org/wiki/${id}`,
      },
      identifiers,
      iucn: {
        identifier,
        threatStatus,
      },
    };
  }

  /**
   * Pull every external-id claim off the entity and decorate it with the
   * human-readable property description.
   */
  async extractTaxonIdentifiers(claims, locale = 'en') {
    const externalIds = Object.keys(claims)
      .filter((k) => get(claims, `${k}[0].mainsnak.datatype`) === 'external-id')
      .map((k) => get(claims, `${k}[0]`));

    const identifiers = await this.decorateWithPropertyDescriptions(externalIds, locale);

    return identifiers || [];
  }

  /**
   * Resolve the IUCN taxon identifier (P627) claim, if present.
   */
  async extractIUCNIdentifier(claims, locale = 'en') {
    const claim = get(claims, `${IUCN_TAXON_IDENTIFIER}[0]`);
    if (!claim) {
      return null;
    }

    return this.decorateWithPropertyDescriptions([claim], locale);
  }

  /**
   * Resolve the IUCN conservation status (P141) claim into Red List data.
   */
  async extractIUCNThreatStatus(claims, locale = 'en') {
    const threatStatus = get(claims, `${IUCN_CONSERVATION_STATUS}[0]`);

    if (!threatStatus) {
      return '';
    }

    const [res, value] = await Promise.all([
      this.getEntities([get(threatStatus, `mainsnak.property`)]),
      this.resolveWikiDataItem(get(threatStatus, 'mainsnak.datavalue.value.id'), locale),
    ]);

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
    const response = await this.get(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`);
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
