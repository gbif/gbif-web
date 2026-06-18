import { stringify } from 'qs';
import { getDefaultAgent } from '@/requestAgents';
import QueuedRESTDataSource from '@/QueuedRESTDataSource';

class DatasetAPI extends QueuedRESTDataSource {
  constructor(config) {
    super({
      // Serialise a single GraphQL request's dataset fan-out (e.g. a dataset
      // search where every result resolves its key) so one operation cannot
      // flood the upstream. Each call still gets its full timeout once it runs.
      concurrency: 5,
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
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async searchDatasets({ query }) {
    const response = await this.get(
      '/dataset/search',
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
  }

  async listDatasets({ query }) {
    const response = await this.get(
      '/dataset',
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
  }

  async getDatasetByKey({ key }) {
    const response = await this.get(`/dataset/${key}`, null, {
      retry: 0,
      enQueue: true,
      signal: this.context.abortController.signal,
    });
    return response;
  }

  getDatasetsByKeys({ datasetKeys }) {
    return Promise.all(datasetKeys.map((key) => this.getDatasetByKey({ key })));
  }

  async getConstituents({ key, query }) {
    return this.get(
      `/dataset/${key}/constituents`,
      stringify(query, { indices: false }),
    );
  }

  async getNetworks({ key, query }) {
    return this.get(
      `/dataset/${key}/networks`,
      stringify(query, { indices: false }),
    );
  }

  async getMetrics({ key, query }) {
    return this.get(
      `/dataset/${key}/metrics`,
      stringify(query, { indices: false }),
    );
  }

  async getGridded({ key, query }) {
    return this.get(
      `/dataset/${key}/gridded`,
      stringify(query, { indices: false }),
    );
  }

  async getFromChecklistBank({ key }) {
    return this.get(
      `${this.config.checklistBank}/dataset/gbif-${key}.json`,
    ).catch((err) => {
      // if status is 404, the dataset is not in checklistbank and we should simply return null
      // else the error should be allowed to bubble up
      if (err?.extensions?.response?.status === 404) {
        return null;
      }
      throw err;
    });
  }

  async getChecklistBankImport({
    key,
    query = { state: 'finished', limit: 1 },
  }) {
    return this.get(
      `${this.config.checklistBank}/dataset/${key}/import`,
      stringify(query, { indices: false }),
    );
  }

  async getClbVernacularNamesByTaxonKey({
    checklistKey,
    taxonKey,
    query = { lang },
  }) {
    const results = await this.get(
      `${this.config.checklistBank}/dataset/${checklistKey}/taxon/${taxonKey}/vernacular`,
      stringify(query, { indices: false }),
    );

    // count how frequent each vernacularName is used
    const counts = results.reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    }, {});
    // sort the list by the frequency of the vernacularName, this is simply to avoid the odd outliers that occasionally appear since it is a list stiched together from multiple sources
    results.sort((a, b) => counts[b.name] - counts[a.name]);
    return results;
  }

  async getClbReferenceByKey({ datasetKey, referenceId }) {
    return this.get(
      `${this.config.checklistBank}/dataset/${datasetKey}/reference/${referenceId}`,
    );
  }

  async getClbNameUsageSuggestions({
    checklistKey,
    q,
    limit,
    status = [
      'ACCEPTED',
      'PROVISIONALLY_ACCEPTED',
      'SYNONYM',
      'AMBIGUOUS_SYNONYM',
      'MISAPPLIED',
    ],
  }) {
    const response = await this.get(
      `${this.config.checklistBank}/dataset/${checklistKey}/nameusage/suggest`,
      stringify({ q, status, limit }, { indices: false }),
    );
    return response;
  }

  async getTaxGroupByName({ name }) {
    const response = await this.get(
      `${this.config.checklistBank}/vocab/taxgroup`,
    );
    const taxGroup = response.find((group) => group.name === name);
    if (taxGroup) {
      return taxGroup;
    }
    // If the tax group is not found, return an empty object or handle it as needed
    return null;
  }
}

export default DatasetAPI;
