import queryGraphQl from './queryGraphQL';

class GraphqlClient {
  constructor(config) {
    this.config = config;
  }

  query({ query, variables }) {
    if (!this.config) {
      return console.error('No configuration has been provided to the GraphQLClient');
    }
    return queryGraphQl(query, { variables, client: this.config });
  }
}

export default GraphqlClient;
