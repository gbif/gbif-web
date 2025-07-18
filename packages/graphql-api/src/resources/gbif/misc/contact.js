import { gql } from 'apollo-server';

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
    # Comes from the directory and is currently only added in the Node.contacts resolver
    title: String
    surname: String
    institutionName: String
  }
`;

export default typeDef;
