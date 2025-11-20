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
    participant(key: ID!): Participant
    nodeSteeringGroup: [NsgMember!]
    budgetCommittee: [CommitteeMember!]
    executiveCommittee: [CommitteeMember!]
    scienceCommittee: [CommitteeMember!]
    nodeManagersCommittee: [NodeManagersCommitteeMember!]
    secretariat: [SecretariatMember!]
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
    people(id: ID): [ParticipantPerson]

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
    node: Node
  }

  type ParticipantPerson {
    id: ID!
    role: String
    title: String
    firstName: String
    surname: String
    termStart: String
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

  type CommitteeMember {
    personId: ID!
    name: String
    title: String
    email: String
    roles: [String!]
  }

  type NodeManagersCommitteeMember {
    personId: ID!
    name: String
    title: String
    email: String
    roles: [String!]
    participationStatus: ParticipationStatus
    participant: String
  }

  type SecretariatMember {
    id: ID!
    firstName: String
    surname: String
    jobTitle: String
    email: String
    address: String
  }
`;

export default typeDef;
