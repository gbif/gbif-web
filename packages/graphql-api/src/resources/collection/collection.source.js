import { getDefaultAgent } from '@/requestAgents';
import { RESTDataSource } from '@/RESTDataSource';
import { stringify } from 'qs';

class CollectionAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL, path);
  }

  async searchCollections({ query }) {
    const response = await this.get(
      '/grscicoll/collection/search',
      stringify(query, { indices: false }),
    );
    response._query = query;
    return response;
  }

  async getCollectionByKey({ key }) {
    return this.get(`/grscicoll/collection/${key}`);
  }

  async searchCollectionDescriptorGroups({ key, limit, offset }) {
    return this.get(`/grscicoll/collection/${key}/descriptorGroup`, {
      limit,
      offset,
    });
  }

  async getCollectionDescriptorGroup({ key, collectionKey }) {
    return this.get(
      `/grscicoll/collection/${collectionKey}/descriptorGroup/${key}`,
    );
  }

  async getCollectionDescriptor({ key, collectionKey, limit, offset }) {
    return this.get(
      `/grscicoll/collection/${collectionKey}/descriptorGroup/${key}/descriptor`,
      {
        limit,
        offset,
      },
    );
  }

  async getCollectionsByInstitutionKey({
    key,
    limit = 20,
    offset = 0,
    ...rest
  }) {
    return this.get(
      '/grscicoll/collection/search',
      stringify({
        institutionKey: key,
        limit,
        offset,
        ...rest,
      }),
    );
  }

  /*
  getCollectionsByKeys({ collectionKeys }) {
    return Promise.all(
      collectionKeys.map(key => this.getCollectionByKey({ key })),
    );
  }
  */
}

export default CollectionAPI;
