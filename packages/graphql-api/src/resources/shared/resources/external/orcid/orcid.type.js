import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    orcid(key: ID!): OrcID
  }

  type OrcID {
    key: ID!
    name: String
    wikidata: JSON
  }
`;

export default typeDef;
