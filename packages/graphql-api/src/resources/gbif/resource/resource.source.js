import { RESTDataSource } from 'apollo-datasource-rest';
import { translateContentfulResponse } from '#/helpers/utils';
import { urlSizeLimit } from '#/helpers/utils-ts';
import { getDefaultAgent } from '#/requestAgents';
import ThrottledRESTDataSource from '#/ThrottledRESTDataSource';

export class ResourceAPI extends ThrottledRESTDataSource {
  constructor(config) {
    super({
      // notice that this only is used if the throttle option is set to true in the request
      maxConcurrent: 3, // Maximum concurrent requests
      minTime: 200, // Minimum amount in ms between requests
    });
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async getEntryById({ id, preview, locale, info }) {
    let path = `/content/${id}`;
    if (preview) path += `/preview?cacheBust=${Date.now()}`;

    const result = await this.get(
      path,
      {},
      { throttle: preview, signal: this.context.abortController.signal },
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

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
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
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/content', body, {
        signal: this.context.abortController.signal,
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
    const response = await this.searchResourceDocuments(
      { query: { ...query, limit: 1 } },
      locale,
    );
    return response.results[0];
  }

  async meta({ query }) {
    const body = { ...query, includeMeta: true };
    const response = await this.post('/content/meta', body);
    return response;
  }
}
