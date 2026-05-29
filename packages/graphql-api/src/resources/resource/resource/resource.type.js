import { RESORUCE_OPTIONS } from './resource.constants';

const { gql } = require('graphql-tag');

const typeDef = gql`
  extend type Query {
    resource(id: String, alias: String, machineIdentifier: String): Resource
  }

  union Resource = ${RESORUCE_OPTIONS.map((option) => option.graphQLType).join(
    ' | ',
  )}
`;

export default typeDef;
