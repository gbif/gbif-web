import gql from 'graphql-tag';

const typeDef = gql`
  type ContactPerson {
    key: ID
    firstName: String
    lastName: String
    position: [String]!
    phone: [String]!
    fax: [String]!
    email: [String]!
    address: [String]!

    city: String
    country: Country
    province: String
    postalCode: String

    primary: Boolean

    taxonomicExpertise: [String]!
    userIds: [UserId]!

    created: DateTime
    createdBy: String
    
    modified: DateTime
    modifiedBy: String
  }

  type UserId {
    type: String
    id: String
  }
`;

export default typeDef;