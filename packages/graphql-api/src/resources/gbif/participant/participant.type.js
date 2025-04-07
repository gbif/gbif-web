import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    participantSearch(
      limit: Int
      offset: Int
      q: String
      type: NodeType
      participationStatus: ParticipationStatus
    ): ParticipantSearchResults
    participant(key: String!): Participant
    nodeSteeringGroup: [NsgMember!]
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
    participantUrl: String
    countryCode: Country
    gbifRegion: GbifRegion
    membershipStart: String
    name: String
    participationStatus: ParticipationStatus
    type: NodeType
    # This data comes from our cms system
    nodeHasMandate: Boolean
    title: String
    nodeEstablishmentDate: DateTime
    nodeStructure: String
    nodeMission: String
    nodeHistory: String
    nodeFunding: String
    linksToSocialMedia: [Link]
    secondaryLinks: [Link]
    progressAndPlans: String
    newsletters: [Link]
    rssFeeds: [Link]
    primaryLink: Link
  }

  type NsgMember {
    id: ID!
    name: String
    title: String
    institutionName: String
    address: String
    addressCountry: String
    email: String
    role: String
    contact: DirectoryContact
  }
`;

export default typeDef;
