import { ApiClient } from '../apiClient';
import config from '#/config.js';
import json2str, { parseInputArrayParam } from './utils';

const esApiClient = new ApiClient(config.apiEs, {
  apiKey: config.apiEsKey,
  timeout: 30000,
});

export default async function handleOccurrenceSearch(args) {
  const { params, uiLink } = prepareParams(args);
  console.log('searching occurrences with args', args);
  console.log('searching occurrences with params', params);

  const data = await esApiClient.get('/occurrence', params);

  const summary = `Found ${data.documents.total} total occurrences. Showing ${
    data.documents.results?.length ?? 0
  } results (offset: ${data.documents.from}, limit: ${
    data.documents.size
  }). To explore in the GBIF UI and download, visit: ${uiLink}.`;

  // comments
  let comments = '';
  if (params?.facet === 'taxonKey') {
    comments += `\n\nNote: Faceting on taxonKey returns a mix of ranks. E.g. So an individual bird species will also be counted as animal, chordata, aves etc. Consider faceting on speciesKey for species only counts.`;
  }

  return {
    content: [
      {
        type: 'text',
        text: `${summary}\n\n${json2str(data)}${comments}`,
      },
    ],
  };
}

function prepareParams(args) {
  const params = {
    taxonKey: parseInputArrayParam(args.taxonKey),
    scientificName: args.scientificName,
    country: parseInputArrayParam(args.country),
    continent: parseInputArrayParam(args.continent),
    year: args.year,
    decimalLatitude: args.decimalLatitude,
    decimalLongitude: args.decimalLongitude,
    month: parseInputArrayParam(args.month),
    datasetKey: parseInputArrayParam(args.datasetKey),
    basisOfRecord: parseInputArrayParam(args.basisOfRecord),
    gadmGid: parseInputArrayParam(args.administrativeArea),
    hasCoordinate: args.hasCoordinate,
    hasGeospatialIssue: args.hasGeospatialIssue,
    size: Math.min(args.limit ?? 0, 1000),
    from: args.offset ?? 0,
    stats: parseInputArrayParam(args.stats),
    cardinality: parseInputArrayParam(args.cardinality),
    facet: args?.facet?.field,
    facetLimit: args?.facet?.limit,
    facetOffset: args?.facet?.offset,
    histogram: args?.histogram?.field,
    histogramInterval: args?.histogram?.interval,
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
    histogram,
    histogramInterval,
    stats,
    cardinality,
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
