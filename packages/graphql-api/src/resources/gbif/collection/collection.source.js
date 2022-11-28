import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class CollectionAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
  }

  async searchCollections({ query }) {
    return this.get(
      '/grscicoll/collection',
      stringify(query, { indices: false }),
    );
  }

  async getCollectionByKey({ key }) {
    return this.get(`/grscicoll/collection/${key}`);
  }

  async getCollectionsByInstitutionKey({ key, limit = 20, offset = 0 }) {
    return this.get('/grscicoll/collection', {
      institution: key,
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
