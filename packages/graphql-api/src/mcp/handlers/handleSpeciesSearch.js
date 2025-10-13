import { ApiClient } from '../apiClient';
import config from '#/config.js';
import json2str from './utils';
import { addMapCounts } from './speciesUtils';

const apiClient = new ApiClient(config.apiv1);

export default async function handleSpeciesSearch(args) {
  const params = {
    q: args.q,
    rank: args.rank,
    highertaxonKey: args.highertaxonKey,
    status: args.status,
    limit: Math.min(args.limit ?? 10, 300),
    offset: args.offset ?? 0,
    datasetKey: config.defaultChecklist,
    // hl: true, // highlight search terms in results. We should remove them before returning to user, but it can help us decide what is relevant to return
  };

  const data = await apiClient.get('/species/search', params);
  data.results = await addMapCounts(data.results);

  try {
    // format result for compactness and readability
    const formattedResult = formatResults(data);

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
    throw GBIFAPIError('Error processing match result', 500);
  }
}

function formatResults({ results, count, limit, offset }) {
  if (count === 0) return 'No results found.';
  if (count > 0 && results.length === 0)
    return 'No more results. Try with a smaller offset.';
  const lines = [
    `Found ${count} total results. Showing ${results.length} results (offset: ${offset}, limit: ${limit}).`,
  ];

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
    taxonomicStatus,
    rank,
    kingdom,
    phylum,
    order,
    family,
    genus,
    species,
    totalOccurrencesWithCoordinates,
  } = result;

  const obj = {
    key,
    scientificName,
    rank,
    taxonomicStatus,
    kingdom,
    phylum,
    order,
    family,
    genus,
    species,
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
