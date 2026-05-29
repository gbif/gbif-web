import { RESTDataSource } from '@/RESTDataSource';
import { urlSizeLimit } from '@/helpers/utils-ts';
import { getDefaultAgent } from '@/requestAgents';

const MAX_RESULTS = 10000;

class DatasetByPredicateAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiEs;
    this.config = config;
  }

  willSendRequest(path, request) {
    // now that we make a public version, we might as well just make it open since the key is shared with everyone
    request.headers['Authorization'] = `ApiKey-v1 ${this.config.apiEsKey}`;
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async searchDatasetsByPredicate({ query }) {
    const body = {
      ...query,
    };
    if ((query?.from ?? 0) + (query?.size ?? 100) > MAX_RESULTS) {
      throw new Error(
        `Query exceeds maximum allowed size of ${MAX_RESULTS}. Please use our API https://techdocs.gbif.org/en/ or do a download.`,
      );
    }
    let response;
    if (JSON.stringify(body).length < urlSizeLimit) {
      response = await this.get(
        '/dataset',
        { body: JSON.stringify(body) },
        { signal: this.context.abortController.signal },
      );
    } else {
      response = await this.post('/dataset', body, {
        signal: this.context.abortController.signal,
      });
    }
    response._predicate = body.predicate;
    return {
      ...response?.documents,
      count: response?.total || 0,
      predicate: response?._predicate,
      q: response?._q,
    };
  }
}

export default DatasetByPredicateAPI;
