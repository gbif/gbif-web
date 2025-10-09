import { ApiClient } from '../apiClient';
import config from '#/config.js';
import json2str from './utils';

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
  };

  const data = await apiClient.get('/species/search', params);

  // const summary = `Found ${data.count} total results. Showing ${
  //   data.results?.length ?? 0
  // } results (offset: ${data.offset}, limit: ${data.limit}). End of records: ${
  //   data.endOfRecords
  // }`;

  try {
    // format result for compactness and readability
    const formattedResult = formatMatchResult(data);

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

function formatMatchResult(data) {
  if (!data) return 'No match data';
  const lines = [];

  lines.push(`\n${json2str(data)}`);
  return lines.join('\n');
}
