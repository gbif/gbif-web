import { getOccurrenceRecordAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import v1ToOccurrence from './helpers/v1ToOccurrence';

const MAX_LONG = 9223372036854775807n;

function isValidKey(key) {
  const str = String(key);
  return /^\d+$/.test(str) && BigInt(str) <= MAX_LONG;
}

function isClientError(err) {
  const status = err?.extensions?.response?.status ?? err?.extensions?.http?.status;
  return status >= 400 && status < 500;
}

/**
 * Occurrence records looked up by key in the GBIF API v1. Elasticsearch only holds the IDs, so
 * every occurrence the GraphQL API returns is fetched here.
 */
class OccurrenceRecordAPI extends QueuedRESTDataSource {
  constructor(config) {
    super({
      // Bulkhead pool for the per-record lookups. Configure it in .env
      // (requestPools.occurrenceRecord.*); see requestPools.ts.
      pool: 'occurrenceRecord',
    });
    this.baseURL = config.apiv1;
    this.config = config;
  }

  willSendRequest(path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    if (this.context.referer) request.headers.referer = this.context.referer;
    if (this.context.clientPriority) request.headers['x-client-priority'] = this.context.clientPriority;
    if (this.context.siteUrl) request.headers['x-gbif-site-url'] = this.context.siteUrl;
    if (this.context.requestId) request.headers['x-request-id'] = this.context.requestId;
    if (this.context.clientIp) request.headers['x-client-ip'] = this.context.clientIp;
    request.agent = getOccurrenceRecordAgent(this.baseURL, path);
  }

  async getOccurrenceByKey({ key }) {
    if (!isValidKey(key)) {
      throw new NotFoundError();
    }
    const record = await this.get(`/occurrence/${key}`, undefined, {
      signal: this.context.abortController?.signal,
      enQueue: true,
      retry: true,
    });
    return v1ToOccurrence(record);
  }

  async getVerbatim({ key }) {
    return this.get(`/occurrence/${key}/verbatim`, undefined, {
      signal: this.context.abortController?.signal,
      enQueue: true,
      retry: true,
    });
  }

  /**
   * Look up several records, keeping the order of the keys. A record that can't be found (typically
   * deleted since the search index was built) is returned as null.
   */
  async getOccurrencesByKeys({ keys }) {
    return Promise.all(
      keys.map((key) =>
        this.getOccurrenceByKey({ key }).catch((err) => {
          if (isClientError(err)) return null;
          throw err;
        }),
      ),
    );
  }
}

export default OccurrenceRecordAPI;
