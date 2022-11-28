import { gql } from 'apollo-server';

const typeDef = gql`
  type Endpoint {
    key: ID!
    type: EndpointType!
    identifier: String
    url: URL
    createdBy: String!
    created: DateTime!
    modified: String
    machineTags: [MachineTag]
  }
`;

export default typeDef;
