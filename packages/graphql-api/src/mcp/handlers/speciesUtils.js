import { uniqBy } from 'lodash';
import { matchSorter } from 'match-sorter';
import { ApiClient } from '../apiClient';
import config from '#/config.js';
import json2str, { McpError } from './utils';

const apiClient = new ApiClient(config.apiv1);
const apiV2Client = new ApiClient(config.apiv2);

export default async function searchSpeciesMultiStrategy(args) {
  if (!args.name || args.name.trim().length === 0) {
    throw new McpError('Parameter name is required', 400);
  }
  const params = {
    q: args.name,
  };

  // const data = await apiClient.get('/species/search', params);
  const results = await searchForName({
    limit: 10,
    q: params.q,
  });

  try {
    // format result for compactness and readability
    const formattedResult = formatResults(results);

    return {
      content: [
        {
          type: 'text',
          text: formattedResult,
        },
      ],
    };
  } catch (error) {
    console.error(error);
    throw McpError('Error processing match result', 500);
  }
}

export function formatResults(results) {
  if (!results || results.length === 0) return 'No results found.';
  const lines = [`Showing top ${results.length} results.`];

  // then list the results
  results.forEach((result, index) => {
    const str = formatResult(result, index + 1);
    lines.push(str);
  });

  return lines.join('\n');
}

function formatResult(result, index) {
  if (!result) return 'No result';
  const lines = [];
  const {
    key,
    scientificName,
    acceptedNameOf,
    vernacularName,
    rank,
    taxonomicStatus,
    classification,
    totalOccurrencesWithCoordinates,
  } = result;

  const obj = {
    key,
    scientificName,
    acceptedNameOf,
    vernacularName,
    rank,
    taxonomicStatus,
    classification,
    totalOccurrencesWithCoordinates,
  };
  // remove undefined properties
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      delete obj[k];
    }
  });
  lines.push(`- ${json2str(obj)}`);
  return lines.join('\n');
}

async function searchForName({
  limit = 20,
  q,
  language = 'eng',
  strictMatching,
  taxonScope = [],
}) {
  const datasetKey = config.gbifBackboneUUID;
  // get vernacular names
  const vernacularPromise = apiClient.get('/species/search', {
    datasetKey,
    q,
    limit,
    qField: 'VERNACULAR',
  });

  const scientificPromise = apiClient.get('/species/search', {
    datasetKey,
    q,
    limit,
    qField: 'SCIENTIFIC',
  });

  const upperFirstQuery = q.charAt(0).toUpperCase() + q.slice(1);
  const matchPromise = apiV2Client.get('/species/match', {
    datasetKey,
    scientificName: upperFirstQuery,
    strict: false,
    verbose: true,
  });

  const [responseVernacular, responseScientific, matchResult] =
    await Promise.all([vernacularPromise, scientificPromise, matchPromise]);

  // check the match result to see if we have a certain match
  const matches = [];
  if (matchResult.usage) {
    matches.push({
      key: matchResult.usage.key,
      status: matchResult.usage.status,
      matchType: matchResult.diagnostics.matchType,
      confidence: matchResult.diagnostics.confidence,
    });
  }
  if (matchResult?.diagnostics?.alternatives) {
    // add first 3 results
    matches.push(
      ...matchResult.diagnostics.alternatives.slice(0, 3).map((x) => ({
        key: x.usage.key,
        status: x.usage.status,
        matchType: x.diagnostics.matchType,
        confidence: x.diagnostics.confidence,
      })),
    );
  }
  // get taxa for each match
  const matchedTaxa = await Promise.all(
    matches.map(async (m) => {
      try {
        const taxon = await apiClient.get(`/species/${m.key}`);
        const { status, matchType, confidence } = m;
        return { taxon, status, matchType, confidence };
      } catch (error) {
        console.error('Error fetching matched taxon for key', m.key, error);
        return null;
      }
    }),
  ).then((results) => results.filter((x) => x !== null));

  // get results matching vernacular name
  let vernacularResults = [];

  // ignore vernacular results if we have a certain match
  if (matchResult.usage) {
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
  const results = matchedTaxa.concat(
    responseScientific.results.concat(vernacularResults),
  );

  // for each result, simplify vernacular names to just an array of strings
  results.forEach((x) => {
    x.vernacularNames = (x.vernacularNames ?? []).map((x) => x.vernacularName);
  });

  // remove duplicates, uniqBy keeps ordering
  let uniqueResults = uniqBy(results, 'key');
  const capLimit =
    matchedTaxa?.[0]?.matchType === 'EXACT' || matchedTaxa?.[0]?.confidence > 99
      ? 3
      : 12;
  uniqueResults = uniqueResults.slice(0, capLimit);

  // get the accepted taxon for each result
  await promiseForEachOneByOne(uniqueResults, async (x) => {
    if (!x.acceptedKey) return;
    try {
      const taxon = await apiClient.get(`/species/${x.acceptedKey}`);
      x.acceptedTaxon = taxon;
    } catch (error) {
      console.error('Error fetching accepted taxon for', x.key, error);
    }
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

  // remove duplicate results (how that we have resolved accepted names, there might be more duplicates - one for the accepted name that was matched and one for the synonym we have transformed to an accepted)
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

  const resultWithCounts = await addMapCounts(filteredResults);

  // map results more easily digestable format
  const structuredResults = resultWithCounts.map((x) => {
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
      taxonomicStatus: x.taxonomicStatus ?? x.status,
      acceptedNameOf: x.acceptedNameOf,
      vernacularName,
      classification,
      totalOccurrencesWithCoordinates: x.totalOccurrencesWithCoordinates ?? 0,
      ...x,
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
  // remove undefined properties
  sortedResults.forEach((x) => {
    Object.keys(x).forEach((key) => {
      if (x[key] === undefined) {
        delete x[key];
      }
    });
  });
  return sortedResults;
}

async function promiseForEachOneByOne(array, callback) {
  for (let i = 0; i < array.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[i], i, array);
  }
  return array;
}

export async function addMapCounts(list) {
  const resultWithCounts = await Promise.all(
    list.map(async (x) => {
      try {
        const mapCapabilities = await apiV2Client.get(
          '/map/occurrence/density/capabilities.json',
          {
            taxonKey: x.key,
            limit: 0,
          },
        );
        return {
          ...x,
          totalOccurrencesWithCoordinates: mapCapabilities?.total || 0,
        };
      } catch (error) {
        return x;
      }
    }),
  );
  return resultWithCounts;
}

export function removeUndefinedProperties(obj) {
  const newObj = { ...obj };
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      delete newObj[k];
    }
  });
  return newObj;
}
