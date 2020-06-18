import queryGraphQl from './queryGraphQL';
import axios from './axios';

class ApiClient {
  constructor(config) {
    this.gql = config.gql;
    this.v1 = config.v1;
    this.request
  }

  query({ query, variables }) {
    if (!this.gql) {
      return console.error('No configuration has been provided to the GraphQLClient');
    }
    return queryGraphQl(query, { variables, client: this.gql });
  }

  get(url, options) {
    return axios.get(url, options);
  }

  v1Get(url, options) {
    return this.get(this.v1.endpoint + url, options);
  }
}

export default ApiClient;
