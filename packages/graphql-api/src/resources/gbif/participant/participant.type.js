import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    participantSearch(
      limit: Int
      offset: Int
      q: String
    ): ParticipantSearchResults
    participant(key: String!): Participant
  }

  type ParticipantSearchResults {
    results: [Participant]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Participant {
    id: ID!
    abbreviatedName: String
    countryCode: Country
    gbifRegion: GbifRegion
    membershipStart: String
    name: String
    participationStatus: ParticipationStatus
    type: NodeType
  }
`;

export default typeDef;
