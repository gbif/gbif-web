// cross content suggestions
// tims comments: search bor BID or a programme. For the homepage it could be useful.
// my ideas: wkt, sequence, has sequence
// thomas: publishers
import colSuggest from '#/resources/gbif/taxon/colSuggest';
import axios from 'axios';
import { matchSorter } from 'match-sorter';
import config from '../../config';

const translationEndpoint =
  config.translations || 'https://react-components.gbif.org/lib/translations';
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
  'geometry',
];

export async function getFieldNames(lang) {
  const translations = await getTranslations(lang);
  if (!translations) {
    console.error('No translations found');
    return [];
  }
  const filterNames = filters
    .map((f) => ({ filter: f, label: translations[`filters.${f}.name`] || f }))
    .sort();
  // map to format for filters [{filter: 'country', label: 'Denmark', alternativeLabels: []}]
  return filterNames.map((f) => {
    return {
      filter: f.filter,
      label: f.label,
      alsoKnownAs: [f.filter],
      alternativeLabels: [f.filter],
      type: 'FILTER',
    };
  });
}
async function getYearSuggestions({ q } = {}) {
  // if it looks like a single year or a yearspan, then return a suggestion, else return nothing
  // years should be between 1500-20
  const maxYear = new Date().getFullYear();
  const minYear = 1500;

  // parse q as number
  const parts = q.split(/[,\-]/);
  const [start, end] = parts.map((x) => {
    const v = x.trim();
    if (v === '' || v === '*') return '*'; // empty string is a wildcard
    return parseInt(v);
  });

  // if there is only a start and it isn't a number, then return nothing
  if (isNaN(start) && !end) {
    return [];
  }
  // if it is a range, then compose the range
  if (typeof start !== 'undefined' && typeof end !== 'undefined') {
    if (start !== '*' && (start < minYear || start > maxYear)) {
      return [];
    }
    if (end !== '*' && (end < minYear || end > maxYear)) {
      return [];
    }
    if (end !== '*' && start !== '*' && start >= end) {
      // it would be nice to suggest a valid range to the user that still respects what they have entered.
      // E.g. if they enter 1800,18 then suggest 1800-1899 or such. 1930-193 => 1930-1939 , 1930,194 => 1930-1949
      return [];
    }
    if (end === '*' && start === '*') {
      return [];
    }
    // The range should be within 1500- this year + 10
    return [
      {
        filter: 'year',
        value: `${start},${end}`,
        label: `${start}-${end}`,
        alternativeLabels: [],
      },
    ];
  }
  // if it is a number, then check if it is within the range
  if (start > minYear && start <= maxYear) {
    return [
      {
        filter: 'year',
        value: start,
        label: `${start}`,
        alternativeLabels: [],
      },
    ];
  }
  return [];
}

async function getCountryNames(lang) {
  const translations = await getTranslations(lang);
  if (!translations) {
    return [];
  }
  // all country codes are listed in enums.countryCode.DK etc.
  // extract them all as a list of key value pairs {key: 'DK', label: 'Denmark'}
  const countryNames = Object.keys(translations)
    .filter((k) => k.startsWith('enums.countryCode.'))
    .map((k) => ({ key: k.split('.').pop(), label: translations[k] }));

  // map to format for filters [{filter: 'country', value: 'DK', label: 'Denmark', alternativeLabels: []}]
  countryNames.forEach((c) => {
    c.filter = 'country';
    c.value = c.key;
    c.label = c.label;
    c.alternativeLabels = ['country', c.key];
    c.alsoKnownAs = [c.key];
  });
  return countryNames;
}

async function getDatasetSuggestions({ q, limit = 2 }) {
  if (q.length < 3) return [];
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
  return suggestions.map((s) => {
    return {
      filter: 'datasetKey',
      value: s.key,
      label: s.title,
      alternativeLabels: ['dataset', 'ds'],
    };
  });
}

export async function getSpeciesSuggestions({ q, lang, taxonKeys }) {
  // use custom suggest via graphql
  const langMap = {
    en: 'eng',
    da: 'dan',
    es: 'spa',
    de: 'deu',
  };
  const knownLang = langMap[lang] ?? 'en';

  const result = await colSuggest({ language: knownLang, q, taxonKeys });
  return result;
}

export async function getSpeciesMatches({ q, taxonKeys }) {
  const apiUrl = `${config.apiv1}/species/match?name=${q}`;
  try {
    const response = await axios.get(apiUrl); // will return a single result. confidence is a number between 0 and 100
    if (response.data.scientificName && response.data.confidence > 90) {
      return [{ ...response.data, nubKey: response.data.usageKey }];
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getSpecies({ q, taxonKeys, lang }) {
  const suggestions = await getSpeciesSuggestions({ q, taxonKeys, lang });
  // map to format for filters [{filter: 'taxonKey', value: 5, label: 'Aves', alternativeLabels: []}]
  return suggestions
    .map((s) => {
      const result = {
        filter: 'taxonKey',
        value: s.key,
        label: s.scientificName,
        alsoKnownAs: [
          s.vernacularName,
          s.acceptedNameOf,
          s.canonicalName,
        ].filter((x) => x),
        alternativeLabels: [
          'taxon',
          'species',
          'sp',
          s.vernacularName,
          s.acceptedNameOf,
        ].filter((x) => x),
        item: s,
      };
      if (s.acceptedNameOf) {
        result.description = result.description ?? [];
        result.description.push(`Accepted name of: ${s.acceptedNameOf}`);
      }
      if (s.vernacularName) {
        result.description = result.description ?? [];
        result.description.push(`Common name: ${s.vernacularName}`);
      }
      return result;
    })
    .slice(0, 5);
}

async function getGadmSuggestions({ q, gadmId, limit = 2 }) {
  // https://api.gbif.org/v1/geocode/gadm/search?limit=100&q=k%C3%B8benhavn
  const apiUrl = `${config.apiv1}/geocode/gadm/search?limit=100&q=${q}`;
  try {
    const response = await axios.get(apiUrl);
    // map to format for filters [{filter: 'gadmGid', value: 'DK.02', label: 'København', alternativeLabels: []}]
    return response.data.results
      .filter((x) => {
        // remove gadm level 0
        return x.gadmLevel > 0;
      })
      .map((s) => {
        const result = {
          filter: 'gadmGid',
          value: s.id,
          label: s.name,
          alternativeLabels: ['gadm'],
        };
        if (s.higherRegions && s.higherRegions.length > 0) {
          result.description = result.description ?? [];
          result.description.push(
            s.higherRegions.map((x) => x.name).join(' > '),
          );
        }
        return result;
      })
      .slice(0, limit);
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
  const [datasets, countries, species, fields, gadm, years] = await Promise.all(
    [
      getDatasets({ q: query }),
      getCountryNames(lang),
      getSpecies({ q: query, taxonKeys, lang }),
      getFieldNames(lang),
      getGadmSuggestions({ q: query }),
      getYearSuggestions({ q: query }),
    ],
  );
  return datasets
    .concat(
      filterSuggestions({
        list: countries,
        q: query,
        threshold: matchSorter.rankings.WORD_STARTS_WITH,
      }),
    )
    .concat(species)
    .concat(
      filterSuggestions({
        list: fields,
        q: query,
        threshold: matchSorter.rankings.WORD_STARTS_WITH,
      }),
    )
    .concat(gadm)
    .concat(years);
}

function filterSuggestions({ list, q, threshold }) {
  if (!q) return list;
  // add indeces to the list
  list.forEach((item, index) => {
    if (typeof item !== 'object') {
      return;
    }
    item.index = index;
  });
  // if spaces, then split and search for each word
  const parts = q.split(' ');
  const results = [];
  parts.forEach((part) => {
    const sorted = matchSorter(list, part, {
      threshold,
      keys: [
        'label',
        { threshold: matchSorter.rankings.CONTAINS, key: 'alternativeLabels' },
      ],
      // use index to sort the results
      baseSort: (a, b) => {
        return a.index > b.index ? -1 : 1;
      },
    });
    results.push(sorted);
  });
  // if there are multiple parts, then return the intersection of the results
  const intersection = results.reduce((acc, val) =>
    acc.filter((x) => val.includes(x)),
  );
  return intersection;
}

export async function getSuggestions({ lang, q, taxonKeys }) {
  if (!q) return [];
  const candidates = await getCandidates({ lang, query: q, taxonKeys });
  // if spaces, then split and search for each word
  const parts = q.split(' ');
  const results = [];
  parts.forEach((part) => {
    const sorted = matchSorter(candidates, part, {
      threshold: matchSorter.rankings.NO_MATCH,
      keys: [
        'label',
        {
          maxRanking: matchSorter.rankings.CASE_SENSITIVE_EQUAL,
          key: 'alsoKnownAs',
        },
        { maxRanking: matchSorter.rankings.CONTAINS, key: 'alternativeLabels' },
      ],
      // use index to sort the results
      baseSort: (a, b) => {
        // lineas 2346677
        // lam: 7351755
        // some filters should go before others. The ordering should be field, taxonKey, country, other
        // field is of type=FILTER, the other has filter=taxonKey etc
        function decorate(x) {
          let v = x.index / 100 ?? 0;
          const { item } = x;
          if (item.type === 'FILTER') v += 10000;
          const boosts = {
            year: 1000,
            taxonKey: 900,
            country: 800,
            continent: 700,
            gadmGid: 600,
          };
          if (item.filter && boosts[item.filter]) {
            v += boosts[item.filter];
          }
          if (
            item.filter === 'taxonKey' &&
            item?.item?.taxon?.status === 'accepted'
          ) {
            v += 10000;
          }
          return v;
        }
        const aVal = decorate(a);
        const bVal = decorate(b);

        return aVal > bVal ? -1 : 1;
      },
    });
    // move all dataset results to the bottom
    const datasetResults = sorted.filter((x) => x.filter === 'datasetKey');
    const otherResults = sorted.filter((x) => x.filter !== 'datasetKey');
    const combined = otherResults.concat(datasetResults);

    // always show filters on top
    const filters = combined.filter((x) => x.type === 'FILTER');
    const others = combined.filter((x) => x.type !== 'FILTER');
    const filterSorted = filters.concat(others);

    results.push(filterSorted);
  });
  // if there are multiple parts, then return the intersection of the results
  const intersection = results.reduce((acc, val) =>
    acc.filter((x) => val.includes(x)),
  );
  return intersection;
}

// getSuggestions({ q: 'aves', lang: 'en' }).then(console.log)
