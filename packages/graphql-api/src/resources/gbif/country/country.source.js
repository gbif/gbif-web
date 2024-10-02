import { RESTDataSource } from '@apollo/datasource-rest';
import { getDefaultAgent } from '#/requestAgents';

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

  async getCountryCodes() {
    return this.get('enumeration/basic/Country');
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
