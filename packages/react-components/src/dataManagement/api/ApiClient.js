import queryGraphQl from './queryGraphQL';
import axios from './axios';
import env from '../../../.env.json';

class ApiClient {
  constructor(config) {
    this.gql = config.gql;
    this.v1 = config.v1;
    this.esApi = config.esApi;
    this.utils = config.utils ?? {endpoint: env.UTILS_API};
    this.request;
    this.graphs = {
      DEFAULT: config.gql
    };
  }

  query({ query, variables, queue, graph = 'DEFAULT' }) {
    const client = this.graphs[graph];
    if (!client) {
      return console.error('No configuration has been provided to the GraphQLClient');
    }
    return queryGraphQl(query, { variables, client }, queue);
  }

  get(url, options) {
    return axios.get(url, options);
  }

  v1Get(url, options) {
    return this.get(this.v1.endpoint + url, options);
  }

  esApiGet(url, options) {
    return this.get(this.esApi.endpoint + url, options);
  }
}

export default ApiClient;
