import { RESTDataSource } from '@/RESTDataSource';
import { translateContentfulResponse } from '@/helpers/utils';
import { urlSizeLimit } from '@/helpers/utils-ts';
import { getDefaultAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource';

export class ResourceAPI extends QueuedRESTDataSource {
  constructor(config) {
    super({
      // notice that this only is used if the throttle option is set to true in the request
      concurrency: 3, // Maximum concurrent requests
    });
    this.baseURL = config.apiv1;
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

  async getEntryById({ id, preview, locale, info }) {
    let path = `/content/${id}`;
    if (preview) path += `/preview`;

    const result = await this.get(
      path,
      {},
      {
        enQueue: preview,
        signal: this.context.abortController.signal,
        cacheOptions: {
          ttl: preview
            ? 1 // 1 second
            : 600, // 10 minutes
        },
      },
    );
    if (preview && info) {
      info.cacheControl.setCacheHint({
        maxAge: 1, // seconds
      });
    }
    return translateContentfulResponse(result, locale);
  }
}

export class ResourceSearchAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiEs;
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

  async searchResourceDocuments({ query, locale }) {
    const response = await this.searchResources({ query }, locale);
    return response.documents;
  }

  async searchResources({ query }, locale) {
    const body = { ...query, includeMeta: true };
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/content',
        { body: JSON.stringify(body) },
        {
          signal: this.context.abortController.signal,
          retry: 1,
          enQueue: true,
        },
      );
    } else {
      response = await this.post('/content', body, {
        signal: this.context.abortController.signal,
        retry: 1,
        enQueue: true,
      });
    }
    // map to support APIv1 naming
    response.documents.count = response.documents.total;
    response.documents.limit = response.documents.size;
    response.documents.offset = response.documents.from;
    response._predicate = body.predicate;
    response._q = query.q;
    response.documents.results = translateContentfulResponse(
      response.documents.results,
      locale,
    );
    return response;
  }

  async getFirstEntryByQuery(query, locale) {
    const response = await this.searchResourceDocuments({
      query: { ...query, limit: 1 },
      locale,
    });
    return response.results[0];
  }

  async meta({ query }) {
    const body = { ...query, includeMeta: true };
    const response = await this.post('/content/meta', body, {
      signal: this.context.abortController.signal,
      retry: 1,
      enQueue: true,
    });
    return response;
  }
}
