import { getDefaultAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource';
import { NotFoundError } from '@/helpers/GraphQL404Error';
import v1ToOccurrence from './helpers/v1ToOccurrence';

/**
 * Occurrence calls to the GBIF API v1. Kept apart from occurrenceAPI (es-api) so they use the
 * default request pool instead of the one for es-api traffic, and don't get es-api's API key.
 */
class OccurrenceV1API extends QueuedRESTDataSource {
  constructor(config) {
    super({ pool: 'default' });
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
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async getOccurrenceByKey({ key }) {
    // Validate key: must be numeric and within the valid range for a long
    if (!/^\d+$/.test(String(key)) || BigInt(key) > 9223372036854775807n) {
      throw new NotFoundError();
    }
    const record = await this.get(`/occurrence/${key}`);
    return v1ToOccurrence(record);
  }

  async getRelated({ key }) {
    return this.get(`/occurrence/${key}/experimental/related`);
  }

  async getFragment({ key }) {
    return this.get(`/occurrence/${key}/fragment`);
  }

  async getVerbatim({ key }) {
    return this.get(`/occurrence/${key}/verbatim`, undefined, {
      signal: this.context.abortController?.signal,
      enQueue: true,
    });
  }
}

export default OccurrenceV1API;
