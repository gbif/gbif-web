import gql from 'graphql-tag';

const typeDef = gql`
  type Contact {
    key: ID
    address: [String]!
    city: String
    country: Country
    created: DateTime
    createdBy: String
    email: [String]
    firstName: String
    homepage: [URL]
    lastName: String
    modified: DateTime
    modifiedBy: String
    organization: String
    phone: [String]
    position: [String]
    postalCode: String
    primary: Boolean
    province: String
    type: String
    userId: [String]
    roles: [String]
    _highlighted: Boolean
  }
`;

export default typeDef;
