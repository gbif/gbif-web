import gql from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    countries: [CountryDetail]!
    country(isoCode: Country!): Country
  }

  type CountryDetail {
    key: ID!
    publisherCount: Int!
    datasetCount: Int!
    aboutOccurrenceCount: Int!
    fromOccurrenceCount: Int!
    institutionCount: Int!
    collectionCount: Int!
    participants: [Participant]!
    isVotingParticipant: Boolean!
  }
`;

export default typeDef;
