import { ApiClient } from '../apiClient';
import config from '#/config.js';
import json2str, { parseInputArrayParam } from './utils';

const apiClient = new ApiClient(config.apiv1);

export default async function handleDatasetSearch(args) {
  const params = {
    q: args.q,
    type: parseInputArrayParam(args.type),
    publishingCountry: parseInputArrayParam(args.publishingCountry),
    limit: Math.min(args.limit ?? 20, 100),
    offset: args.offset ?? 0,
  };

  const data = await apiClient.get('/dataset/search', params);

  const summary = `Found ${data.count} total datasets. Showing ${
    data.results?.length ?? 0
  } results (offset: ${data.offset}, limit: ${data.limit}).`;

  return {
    content: [
      {
        type: 'text',
        text: `${summary}\n\n${json2str(
          data.results.map((r) => ({
            key: r.key,
            title: r.title,
            description: r.description,
          })),
        )}`,
      },
    ],
  };
}
