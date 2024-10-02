import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from '@apollo/datasource-rest';
import { stringify } from 'qs';

class CollectionAPI extends RESTDataSource {
  constructor(context) {
    super(context);
    this.baseURL = context.config.apiv1;
    this.context = context;
  }

  willSendRequest(_path, request) {
    request.headers['User-Agent'] = this.context.userAgent;
    request.headers['referer'] = this.context.referer;
    request.agent = getDefaultAgent(this.baseURL);
  }

  async searchCollections({ query }) {
    return this.get(
      '/grscicoll/collection/search',
      stringify(query, { indices: false }),
    );
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
    return this.get(`/grscicoll/collection/${collectionKey}/descriptorGroup/${key}`);
  }

  async getCollectionDescriptor({ key, collectionKey, limit, offset }) {
    return this.get(`/grscicoll/collection/${collectionKey}/descriptorGroup/${key}/descriptor`, {
      limit,
      offset,
    });
  }

  async getCollectionsByInstitutionKey({ key, limit = 20, offset = 0 }) {
    return this.get('/grscicoll/collection', {
      institutionKey: key,
      limit,
      offset,
    }).then((res) => res.results);
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
