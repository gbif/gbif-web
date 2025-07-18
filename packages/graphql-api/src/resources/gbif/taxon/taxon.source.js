import { getParsedName } from '#/helpers/scientificName';
import { getTaxonAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';
import { uniqBy } from 'lodash';
import { matchSorter } from 'match-sorter';
import { stringify } from 'qs';
import colSuggest from './colSuggest';

class TaxonAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getTaxonAgent(this.baseURL, request.path);
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
        datasetKey: this.config.gbifBackboneUUID,
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

  async getTaxonBySourceId({ sourceId, datasetKey }) {
    const data = await this.get(
      `/species`,
      stringify({ sourceId, datasetKey }, { indices: false }),
    );
    if (data?.results?.[0]) {
      return data?.results?.[0];
    }
    return null;
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

  async getChecklistMetadata({ checklistKey = this.config.defaultChecklist }) {
    return this.get(
      `${this.config.apiv2}/species/match/metadata?`,
      stringify({ checklistKey }, { indices: false }),
    );
  }

  async getSpeciesMatchByUsageKey({
    usageKey,
    checklistKey = this.config.defaultChecklist,
  }) {
    const isIncertaeSedis = usageKey === 0 || usageKey === '0';
    return this.get(
      `${this.config.apiv2}/species/match?`,
      stringify(
        { checklistKey: isIncertaeSedis ? undefined : checklistKey, usageKey },
        { indices: false },
      ),
    ).then((result) => {
      if (!result.usage) {
        return null;
      }
      // extract IUCN status if any
      const iucnEntry = result?.additionalStatus?.find(
        (x) => x.datasetAlias === 'IUCN',
      );
      return {
        ...result,
        checklistKey,
        iucnStatus: iucnEntry?.status,
        iucnStatusCode: iucnEntry?.statusCode,
      };
    });
  }

  async getSuggestions({
    checklistKey = this.config.defaultChecklist,
    limit = 20,
    q,
    language,
    vernacularNamesOnly,
    preferAccepted = true,
    strictMatching,
    taxonScope = [],
  }) {
    if (Math.random() > -1) {
      try {
        const metadata = await this.getChecklistMetadata({
          checklistKey,
        });
        const result = await colSuggest({
          q,
          checklistKey: metadata.mainIndex.clbDatasetKey,
          language,
          limit,
          taxonScope,
          vernacularNamesOnly,
          preferAccepted,
        });
        return result;
      } catch (e) {
        console.error('Error getting checklist metadata', e);
        throw e;
      }
    }

    // get vernacular names
    const responseVernacularPromise = language
      ? this.searchTaxa({
          query: {
            datasetKey,
            q,
            limit: 100,
            qField: 'VERNACULAR',
          },
        })
      : null;

    // get results matching scientific name
    let scientificResults = [];
    if (!vernacularNamesOnly) {
      // const responseScientific = await this.searchTaxa({
      //   query: {
      //     datasetKey,
      //     q,
      //     limit: 100,
      //     qField: 'SCIENTIFIC'
      //   }
      // });
      // responseScientific.results.forEach(x => { delete x.vernacularNames });
      // scientificResults = responseScientific.results;

      const responseScientificSuggestions = await this.get(
        `/species/suggest?limit=100&q=${q}&datasetKey=${datasetKey}`,
      );
      // for each result, check if it is a synonym=true, if so get the full result and from that the accepted result
      // e.g. https://api.gbif.org/v1/species/8156363
      // add acceptedKey to each result
      await promiseForEach(responseScientificSuggestions, async (x) => {
        if (x.synonym) {
          const taxon = await this.getTaxonByKey({ key: x.key });
          x.acceptedKey = taxon.acceptedKey;
        }
      });
      scientificResults = responseScientificSuggestions;
    }

    // get results matching vernacular name
    let vernacularResults = [];
    if (language && responseVernacularPromise) {
      const responseVernacular = await responseVernacularPromise;

      // only include vernacular names in the correct language
      responseVernacular.results.forEach((x) => {
        x.vernacularNames = x.vernacularNames.filter(
          (y) => y.language === language,
        );
      });

      // remove results where there is no vernacular name in the correct language
      vernacularResults = responseVernacular.results.filter(
        (x) => x.vernacularNames.length > 0,
      );
    }

    // concatenated results, putting scientific names first
    const results = scientificResults.concat(vernacularResults);

    results.forEach((x) => {
      x.vernacularNames = (x.vernacularNames ?? []).map(
        (x) => x.vernacularName,
      );
    });

    // remove duplicates, uniqBy keeps ordering
    let uniqueResults = uniqBy(results, 'key');

    // if the datasetKey is not the backbone, then we need to get the backbone taxon
    if (datasetKey !== this.config.gbifBackboneUUID) {
      const uniqueNubKeyResults = uniqBy(results, 'nubKey');
      await promiseForEach(uniqueNubKeyResults, async (x) => {
        // for some reason only some results have a nubKey. There can be two results from the backbone dataset, one has a nubKey the other doesn't. Both accepted names.
        if (!x.nubKey) {
        } else {
          const taxon = await this.getTaxonByKey({ key: x.nubKey });
          x.backboneTaxon = taxon;
        }
      });
      // remove results without a backbone math
      uniqueResults = uniqueNubKeyResults.filter((x) => x.backboneTaxon);
      // flatten results
      uniqueResults = uniqueResults.map((x) => {
        return {
          ...(x.backboneTaxon || x),
          vernacularNames: x.vernacularNames,
        };
      });
    }

    // get the accepted taxon for each result
    if (preferAccepted) {
      await promiseForEach(uniqueResults, async (x) => {
        if (!x.acceptedKey) return;
        const acceptedTaxon = await this.getTaxonByKey({ key: x.acceptedKey });
        x.acceptedTaxon = acceptedTaxon;
      });

      uniqueResults = uniqueResults.map((x) => {
        if (!x.acceptedTaxon) {
          return x;
        }
        return {
          ...x.acceptedTaxon,
          acceptedNameOf: x.scientificName,
          vernacularNames: x.vernacularNames,
        };
      });
    }

    // remove duplicate results
    uniqueResults = uniqBy(uniqueResults, 'key');

    // if a taxonScope is provided, then we need to filter the results to mtch the keys provided.
    // e.g. taxonScope=[1,56,9786] should remove entries that do not exists in item.higherClassificationMap (form {key: name})
    let filteredResults = uniqueResults;
    if (taxonScope && taxonScope.length > 0) {
      const taxonScopeKeys = taxonScope.map((x) => x.toString());
      // so for each entry  in unique, we need to remove results where there isn't an overlap between taxonScope and Object.keys(item.higherClassificationMap)
      filteredResults = uniqueResults.filter((item) => {
        let keys = [];
        if (item.higherClassificationMap) {
          keys = Object.keys(item.higherClassificationMap);
        } else {
          // add kingdomKey, phylumKey, classKey, orderKey, familyKey, genusKey, speciesKey to keys and remove undefined
          keys = [
            'kingdomKey',
            'phylumKey',
            'classKey',
            'orderKey',
            'familyKey',
            'genusKey',
            'speciesKey',
          ]
            .map((x) => item[x])
            .filter((x) => x);
        }
        return taxonScopeKeys.some((x) => keys.includes(x.toString()));
      });
    }

    // map results more easily digestable format
    const structuredResults = filteredResults.map((x) => {
      // create a classification list
      const classification = [];
      [
        'kingdom',
        'phylum',
        'class',
        'order',
        'family',
        'genus',
        'species',
      ].forEach((rank) => {
        if (x[rank]) {
          classification.push({
            rank: rank.toUpperCase(),
            name: x[rank],
            key: x[`${rank}Key`],
          });
        }
      });

      // there might be many vernacular names in the given language, and we do not know wich of them match the users query. try to sort it by best match.
      const bestMatchVernacular = matchSorter(x.vernacularNames ?? [], q, {
        threshold: matchSorter.rankings.NO_MATCH,
      });
      const vernacularName = bestMatchVernacular[0];
      return {
        key: x.key,
        scientificName: x.scientificName,
        canonicalName: x.canonicalName,
        rank: x.rank,
        taxonomicStatus: x.taxonomicStatus || x.status,
        acceptedNameOf: x.acceptedNameOf,
        vernacularName,
        classification,
      };
    });

    const sortedResults = matchSorter(structuredResults, q, {
      keys: [
        'scientificName',
        'acceptedNameOf',
        'vernacularName',
        'canonicalName',
      ],
      threshold: strictMatching
        ? matchSorter.rankings.MATCHES
        : matchSorter.rankings.NO_MATCH,
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
