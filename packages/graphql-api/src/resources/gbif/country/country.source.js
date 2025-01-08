import { getDefaultAgent } from '#/requestAgents';
import { RESTDataSource } from 'apollo-datasource-rest';

class CollectionAPI extends RESTDataSource {
  constructor(config) {
    super();
    this.baseURL = config.apiv1;
  }

  willSendRequest(request) {
    request.headers.set('User-Agent', this.context.userAgent);
    request.headers.set('referer', this.context.referer);
    request.agent = getDefaultAgent(this.baseURL, request.path);
  }

  async getCountryCodes() {
    return this.get('enumeration/basic/Country');
  }

  async getCollectionByKey({ key }) {
    return this.get(`/grscicoll/collection/${key}`);
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
