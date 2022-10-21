import { RESTDataSource } from 'apollo-datasource-rest';
import { stringify } from 'qs';

class CollectionAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.gbif.apiv1;
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

  async getCollectionsByInstitutionKey({ key }) {
    return this.get('/grscicoll/collection', { institution: key }).then(
      (res) => res.results,
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
