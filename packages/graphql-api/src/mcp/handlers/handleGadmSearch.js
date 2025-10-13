import { ApiClient } from '../apiClient';
import config from '#/config.js';
import json2str, { parseInputArrayParam } from './utils';
import { removeUndefinedProperties } from './speciesUtils';

const apiClient = new ApiClient(config.apiv1);

export default async function handleGadmSearch(args) {
  const params = {
    q: args.q,
    type: parseInputArrayParam(args.type),
    publishingCountry: parseInputArrayParam(args.publishingCountry),
    limit: Math.min(args.limit ?? 20, 100),
    offset: args.offset ?? 0,
  };

  const data = await apiClient.get('/geocode/gadm/search', params);

  const summary = `Found ${data.count} total candidates for ${
    args.q
  }. Showing ${data.results?.length ?? 0} results (offset: ${
    data.offset
  }, limit: ${data.limit}).`;

  return {
    content: [
      {
        type: 'text',
        text: `${summary}\n\n${json2str(
          data.results.map((r) =>
            removeUndefinedProperties({
              id: r.id,
              name: r.name,
              englishType: r.englishType,
              higherRegions: (r.higherRegions ?? [])
                .map((hr) => hr.name)
                .join(', '),
            }),
          ),
        )}`,
      },
    ],
  };
}
