import { ApiClient } from '../apiClient';
import EsApiClient from '../esApiClient';

const apiClient = new ApiClient();
const esApiClient = new EsApiClient();

export async function handleSpeciesMatch(args) {
  const params = {
    name: args.name,
    strict: args.strict,
    verbose: args.verbose,
    datasetKey: config.defaultChecklist,
  };

  const data = await apiClient.get('/species/match', params);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export async function handleSpeciesSearch(args) {
  const params = {
    q: args.q,
    rank: args.rank,
    highertaxonKey: args.highertaxonKey,
    status: args.status,
    limit: Math.min(args.limit ?? 20, 300),
    offset: args.offset ?? 0,
    datasetKey: config.defaultChecklist,
  };

  const data = await apiClient.get('/species/search', params);

  const summary = `Found ${data.count} total results. Showing ${
    data.results?.length ?? 0
  } results (offset: ${data.offset}, limit: ${data.limit}). End of records: ${
    data.endOfRecords
  }`;

  return {
    content: [
      {
        type: 'text',
        text: `${summary}\n\n${JSON.stringify(data, null, 2)}`,
      },
    ],
  };
}

export async function handleSpeciesSuggest(args) {
  const params = {
    q: args.q,
    rank: args.rank,
    limit: Math.min(args.limit ?? 20, 100),
  };

  const data = await apiClient.get('/species/suggest', params);

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

export async function handleDatasetSearch(args) {
  const params = {
    q: args.q,
    type: args.type,
    keyword: args.keyword,
    publishingCountry: args.publishingCountry,
    limit: Math.min(args.limit ?? 20, 100),
    offset: args.offset ?? 0,
  };

  const data = await apiClient.get('/dataset/search', params);

  const summary = `Found ${data.count} total datasets. Showing ${
    data.results?.length ?? 0
  } results (offset: ${data.offset}, limit: ${data.limit}). End of records: ${
    data.endOfRecords
  }`;

  return {
    content: [
      {
        type: 'text',
        text: `${summary}\n\n${JSON.stringify(data, null, 2)}`,
      },
    ],
  };
}

export async function handleOccurrenceSearch(args) {
  const { params, uiLink } = prepareParams(args);
  console.log('searching occurrences with args', args);
  console.log('searching occurrences with params', params);

  const data = await esApiClient.get('/occurrence', params);

  let summary = `Found ${data.documents.total} total occurrences. Showing ${
    data.documents.results?.length ?? 0
  } results (offset: ${data.documents.from}, limit: ${
    data.documents.size
  }). To explore in the GBIF UI and download, visit: ${uiLink}.`;

  if (data.facets && data.facets.length > 0) {
    summary += `\n\nFacets returned: ${data.facets
      .map((f) => f.field)
      .join(', ')}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: `${summary}\n\n${JSON.stringify(data, null, 2)}`,
      },
    ],
  };
}

export function prepareParams(args) {
  const params = {
    taxonKey: args.taxonKey,
    scientificName: args.scientificName,
    country: args.country,
    continent: args.continent,
    year: args.year,
    decimalLatitude: args.decimalLatitude,
    decimalLongitude: args.decimalLongitude,
    month: args.month,
    datasetKey: args.datasetKey,
    basisOfRecord: args.basisOfRecord,
    hasCoordinate: args.hasCoordinate,
    hasGeospatialIssue: args.hasGeospatialIssue,
    size: Math.min(args.limit ?? 0, 1000),
    from: args.offset ?? 0,
    facet: args.facet,
    stats: args.stats,
    cardinality: args.cardinality,
    facetLimit: args.facetLimit,
    facetOffset: args.facetOffset,
  };
  // parse parameter values for negated terms and then remove the ~ and add a negation flag ! in fromt of the parameter name
  Object.keys(params).forEach((key) => {
    const value = params[key];
    // remove values that start with ~and put them into a negated parameter. Leave values that do not start with ~~
    // if the value is an array, process each value in the array
    if (Array.isArray(value)) {
      const negatedValues = value.filter(
        (v) => typeof v === 'string' && v.startsWith('~'),
      );
      if (negatedValues.length > 0) {
        params[`!${key}`] = negatedValues.map((v) => v.substring(1));
        params[key] = value.filter((v) => !negatedValues.includes(v));
        if (params[key].length === 0) {
          delete params[key];
        }
      }
    } else if (typeof value === 'string' && value.startsWith('~')) {
      params[`!${key}`] = value.substring(1);
      delete params[key];
    }
  });

  const {
    size,
    from,
    limit,
    offset,
    facet,
    facetLimit,
    facetOffset,
    ...uiParams
  } = params;
  // construct a link to the gbif user interface with the same parameters for further exploration and downloads
  // start with the url https://demo.gbif.org/occurrence/search?
  // and repeat parameters that are arrays
  let uiLink = 'https://demo.gbif.org/occurrence/search?';
  Object.keys(uiParams).forEach((key) => {
    const value = uiParams[key];
    if (Array.isArray(value)) {
      value.forEach((v) => {
        uiLink += `${key}=${encodeURIComponent(v)}&`;
      });
    } else if (value !== undefined) {
      uiLink += `${key}=${encodeURIComponent(value)}&`;
    }
  });
  // add a note about the link to the response
  // remove trailing &
  uiLink = uiLink.replace(/&$/, '');
  return { params, uiLink };
}
