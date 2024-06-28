// cross content suggestions
import axios from 'axios';
import config from '../../config';
import { matchSorter } from 'match-sorter'

const translationEndpoint = config.translations || 'https://react-components.gbif.org/lib/translations';
// local cache for translations
const translations = {};

// get translation for a given language code
async function getTranslations(lang) {
  if (translations[lang]) {
    return translations[lang];
  }
  const apiUrl = `${translationEndpoint}/${lang}.json`;
  try {
    const response = await axios.get(apiUrl);
    translations[lang] = response.data;
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const filters = [
  'taxonKey',
  'country',
  'publishingCountryCode',
  'datasetKey',
  'publisherKey',
  'institutionCode',
  'catalogNumber',
  'hostingOrganizationKey',
  'networkKey',
  'year',
  'basisOfRecord',
  'typeStatus',
  'occurrenceIssue',
  'mediaType',
  'sampleSizeUnit',
  'license',
  'projectId',
  'coordinateUncertainty',
  'depth',
  'organismQuantity',
  'sampleSizeValue',
  'relativeOrganismQuantity',
  'month',
  'continent',
  'protocol',
  'establishmentMeans',
  'recordedBy',
  'recordNumber',
  'collectionCode',
  'recordedById',
  'identifiedById',
  'occurrenceId',
  'organismId',
  'locality',
  'waterBody',
  'stateProvince',
  'eventId',
  'samplingProtocol',
  'elevation',
  'occurrenceStatus',
  'gadmGid',
  'identifiedBy',
  'isInCluster',
  'hasCoordinate',
  'hasGeospatialIssue',
  'institutionKey',
  'collectionKey',
  'q',
  'iucnRedListCategory',
  'verbatimScientificName',
  'dwcaExtension',
  'geometry'
];

export async function getFieldNames(lang) {
  const translations = await getTranslations(lang);
  if (!translations) {
    return filters;
  }
  const filterNames = filters.map(f => ({ filter: f, label: translations[`filters.${f}.name`] || f })).sort();
  // map to format for filters [{filter: 'country', label: 'Denmark', alternativeLabels: []}]
  return filterNames.map(f => {
    return {
      filter: f.filter,
      label: f.label,
      alternativeLabels: [],
      type: 'FILTER'
    }
  });
}

async function getCountryNames(lang) {
  const translations = await getTranslations(lang);
  if (!translations) {
    return [];
  }
  // all country codes are listed in enums.countryCode.DK etc. 
  // extract them all as a list of key value pairs {key: 'DK', label: 'Denmark'}
  const countryNames = Object.keys(translations).filter(k => k.startsWith('enums.countryCode.')).map(k => ({ key: k.split('.').pop(), label: translations[k] }));

  // map to format for filters [{filter: 'country', value: 'DK', label: 'Denmark', alternativeLabels: []}]
  countryNames.forEach(c => {
    c.filter = 'country';
    c.value = c.key;
    c.label = c.label;
    c.alternativeLabels = ['country'];
  });
  return countryNames;
}

async function getDatasetSuggestions({ q, limit = 1 }) {
  const apiUrl = `${config.apiv1}/dataset/suggest?q=${q}&limit=${limit}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function getDatasets({ q }) {
  const suggestions = await getDatasetSuggestions({ q });
  // map to format for filters [{filter: 'datasetKey', value: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c', label: 'GBIF Backbone Taxonomy'}]
  return suggestions.map(s => {
    return {
      filter: 'datasetKey',
      value: s.key,
      label: s.title,
      alternativeLabels: ['dataset', 'ds']
    };
  });
}

export async function getSpeciesSuggestions({ q, lang, taxonKeys }) {
  // const apiUrl = `${config.apiv1}/species/suggest?datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c&limit=20&limit=200&q=${q}`;
  // use custom suggest via graphql
  const langMap = {
    en: 'eng'
  }
  const knownLang = langMap[lang] ?? 'en';
  const queryString = `
  query{
    taxonSuggestions( q: "${q}", language: ${knownLang}) {
      key
      scientificName
      vernacularName
      taxonomicStatus
      acceptedNameOf
      classification {
        name
      }
    }
  }        
  `
  const apiUrl = `${config.origin}/graphql?query=${encodeURIComponent(queryString)}`;
  try {
    const response = await axios.get(apiUrl);

    // this line because we use our graphql wrapper
    response.data = response.data.data.taxonSuggestions;
    return response.data;

    // const matches = await getSpeciesMatches({ q, taxonKeys });
    // response.data = response.data.concat(matches);
    // remove duplicates based on nubkey
    // const uniqueMatches = response.data.reduce((acc, current) => {
    //   const x = acc.find(item => item.nubKey === current.nubKey);
    //   if (!x) {
    //     return acc.concat([current]);
    //   } else {
    //     return acc;
    //   }
    // }, []);
    // if taxonKeys are provided, filter out records that do not match in either kingdomKey, phylumKey, classKey, orderKey, familyKey, genusKey or speciesKey
    if (taxonKeys && taxonKeys.length > 0) {
      const taxonKeyStrings = taxonKeys.map(k => k.toString());
      return uniqueMatches.filter(r => {
        const recordTaxonKeys = [r.kingdomKey, r.phylumKey, r.classKey, r.orderKey, r.familyKey, r.genusKey, r.speciesKey].filter(x => typeof x !== 'undefined').map(k => k.toString());
        const hasOverlappingKeys = recordTaxonKeys.some(k => taxonKeyStrings.includes(k));
        return hasOverlappingKeys;
      });
    } else {
      return uniqueMatches;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSpeciesMatches({ q, taxonKeys }) {
  const apiUrl = `${config.apiv1}/species/match?name=${q}`;
  try {
    const response = await axios.get(apiUrl); // will return a single result. confidence is a number between 0 and 100
    if (response.data.scientificName && response.data.confidence > 90) {
      return [{ ...response.data, nubKey: response.data.usageKey }];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSpecies({ q, taxonKeys, lang }) {
  const suggestions = await getSpeciesSuggestions({ q, taxonKeys, lang });
  // map to format for filters [{filter: 'taxonKey', value: 5, label: 'Aves', alternativeLabels: []}]
  return suggestions.map(s => {
    return {
      filter: 'taxonKey',
      value: s.key,
      label: s.scientificName,
      alsoKnownAs: [s.vernacularName, s.acceptedNameOf].filter(x => x),
      alternativeLabels: ['taxon', 'species', 'sp', s.vernacularName, s.acceptedNameOf],
      item: s
    };
  });
}

async function getGadmSuggestions({q, gadmId}) {
  // https://api.gbif.org/v1/geocode/gadm/search?limit=100&q=k%C3%B8benhavn
  const apiUrl = `${config.apiv1}/geocode/gadm/search?limit=100&q=${q}`;
  try {
    const response = await axios.get(apiUrl);
    // map to format for filters [{filter: 'gadmGid', value: 'DK.02', label: 'København', alternativeLabels: []}]
    return response.data.results.
    filter(x => {
      // remove gadm level 0
      return x.gadmLevel > 0;
    }).map(s => {
      return {
        filter: 'gadmGid',
        value: s.id,
        label: s.name,
        alternativeLabels: ['gadm']
      };
    }
    );
  } catch (error) {
    console.log(error);
    return [];
  }
}

// getDatasets({ q: 'aves' }).then(console.log)
// getSpecies({q: 'aves', taxonKeys: [5]}).then(console.log)

async function getCandidates({ lang = 'en', query, taxonKeys }) {
  // get datasets, countries, species and field names
  // and concatenate them into a single array
  // fetch them all at the same time
  const [datasets, countries, species, fields, gadm] = await Promise.all([
    getDatasets({ q: query }),
    getCountryNames(lang),
    getSpecies({ q: query, taxonKeys, lang }),
    getFieldNames(lang),
    getGadmSuggestions({ q: query })
  ]);
  return filterSuggestions({ list: datasets, q: query, threshold: matchSorter.rankings.WORD_STARTS_WITH })
    .concat(filterSuggestions({ list: countries, q: query, threshold: matchSorter.rankings.WORD_STARTS_WITH }))
    .concat(filterSuggestions({ list: species, q: query, threshold: matchSorter.rankings.STARTS_WITH }))
    .concat(filterSuggestions({ list: fields, q: query, threshold: matchSorter.rankings.WORD_STARTS_WITH }))
    .concat(filterSuggestions({ list: gadm, q: query, threshold: matchSorter.rankings.WORD_STARTS_WITH }));
}

function filterSuggestions({ list, q, threshold }) {
  if (!q) return list;
  // add indeces to the list
  list.forEach((item, index) => {
    item.index = index;
  });
  // if spaces, then split and search for each word
  const parts = q.split(' ');
  const results = [];
  parts.forEach(part => {
    const sorted = matchSorter(list, part, {
      threshold: threshold,
      keys: ['label', { threshold: matchSorter.rankings.CONTAINS, key: 'alternativeLabels' }],
      // use index to sort the results
      baseSort: (a, b) => {
        return a.index > b.index ? -1 : 1
      }
    });
    results.push(sorted);
  });
  // if there are multiple parts, then return the intersection of the results
  const intersection = results.reduce((acc, val) => acc.filter(x => val.includes(x)));
  return intersection;
}

export async function getSuggestions({ lang, q, taxonKeys }) {
  if (!q) return [];
  const candidates = await getCandidates({ lang, query: q, taxonKeys });
  // if spaces, then split and search for each word
  const parts = q.split(' ');
  const results = [];
  parts.forEach(part => {
    const sorted = matchSorter(candidates, part, {
      // threshold: matchSorter.rankings.STARTS_WITH,
      keys: ['label', { maxRanking: matchSorter.rankings.CASE_SENSITIVE_EQUAL, key: 'alsoKnownAs' }, { maxRanking: matchSorter.rankings.CONTAINS, key: 'alternativeLabels' }],
      // use index to sort the results
      baseSort: (a, b) => {
        return a.index > b.index ? -1 : 1
      }
    });
    results.push(sorted);
  });
  // if there are multiple parts, then return the intersection of the results
  const intersection = results.reduce((acc, val) => acc.filter(x => val.includes(x)));
  return intersection;
}

// getSuggestions({ q: 'aves', lang: 'en' }).then(console.log)
