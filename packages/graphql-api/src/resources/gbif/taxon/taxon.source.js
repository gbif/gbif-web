import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';
import { getParsedName } from '#/helpers/scientificName';
import { uniqBy } from 'lodash';
import { matchSorter } from 'match-sorter'

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

  async searchBackbone({ query = {} } = {}) {
    return this.searchTaxa({
      query: {
        ...query,
        datasetKey: this.config.gbifBackboneUUID
      }
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

  async getSuggestions({ datasetKey = this.config.gbifBackboneUUID, limit = 10, q, language, vernacularNamesOnly, preferAccepted = true, strictMatching }) {

    // get results matching scientific name
    let scientificResults = [];
    if (!vernacularNamesOnly) {
      const responseScientific = await this.searchTaxa({
        query: {
          datasetKey,
          q,
          limit: 100,
          qField: 'SCIENTIFIC'
        }
      });
      scientificResults = responseScientific.results;
    }

    // get results matching vernacular name
    let vernacularResults = [];
    if (language) {
      const responseVernacular = await this.searchTaxa({
        query: {
          datasetKey,
          q,
          limit: 100,
          qField: 'VERNACULAR'
        }
      });

      // only include vernacular names in the correct language
      responseVernacular.results.forEach(x => {
        x.vernacularNames = x.vernacularNames.filter(y => y.language === language);
      });

      // remove results where there is no vernacular name in the correct language
      vernacularResults = responseVernacular.results.filter(x => x.vernacularNames.length > 0);
    }

    // concatenated results, putting scientific names first
    const results = scientificResults.concat(vernacularResults);

    results.forEach(x => {
      x.vernacularNames = (x.vernacularNames ?? []).map(x => x.vernacularName);
    });

    // remove duplicates, uniqBy keeps ordering
    let uniqueResults = uniqBy(results, 'key');


    // if the datasetKey is not the backbone, then we need to get the backbone taxon
    if (datasetKey !== this.config.gbifBackboneUUID) {
      let uniqueNubKeyResults = uniqBy(results, 'nubKey');
      await promiseForEach(uniqueNubKeyResults, async x => {
        // for some reason only some results have a nubKey. There can be two results from the backbone dataset, one has a nubKey the other doesn't. Both accepted names.
        if (!x.nubKey) {
          return;
        } else {
          const taxon = await this.getTaxonByKey({ key: x.nubKey });
          x.backboneTaxon = taxon;
        }
      });
      // remove results without a backbone math
      uniqueResults = uniqueNubKeyResults.filter(x => x.backboneTaxon);
      // flatten results
      uniqueResults = uniqueResults.map(x => {
        return {
          ...(x.backboneTaxon || x),
          vernacularNames: x.vernacularNames,
        }
      });
    }

    // get the accepted taxon for each result
    if (preferAccepted) {
      await promiseForEach(uniqueResults, async x => {
        if (!x.acceptedKey) return;
        const acceptedTaxon = await this.getTaxonByKey({ key: x.acceptedKey });
        x.acceptedTaxon = acceptedTaxon;
      });

      uniqueResults = uniqueResults.map(x => {
        if (!x.acceptedTaxon) {
          return x;
        } else {
          return {
            ...x.acceptedTaxon,
            acceptedNameOf: x.scientificName,
            vernacularNames: x.vernacularNames,
          }
        }
      });
    }

    // remove duplicate results
    uniqueResults = uniqBy(uniqueResults, 'key');

    // map results more easily digestable format
    let structuredResults = uniqueResults.map(x => {
      // create a classification list
      let classification = [];
      ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species']
        .forEach(rank => {
          if (x[rank]) {
            classification.push({
              rank: rank.toUpperCase(),
              name: x[rank],
              key: x[`${rank}Key`],
            });
          }
        });

      // there might be many vernacular names in the given language, and we do not know wich of them match the users query. try to sort it by best match.
      const bestMatchVernacular = matchSorter(x.vernacularNames ?? [], q, { threshold: matchSorter.rankings.NO_MATCH });
      const vernacularName = bestMatchVernacular[0];
      return {
        key: x.key,
        scientificName: x.scientificName,
        canonicalName: x.canonicalName,
        rank: x.rank,
        taxonomicStatus: x.taxonomicStatus,
        acceptedNameOf: x.acceptedNameOf,
        vernacularName,
        classification,
      }
    });

    const sortedResults = matchSorter(structuredResults, q, {
      keys: ['scientificName', 'acceptedNameOf', 'vernacularName'], 
      threshold: strictMatching ? matchSorter.rankings.MATCHES : matchSorter.rankings.NO_MATCH
    });
    return sortedResults;
  }
}

export default TaxonAPI;


async function promiseForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}
