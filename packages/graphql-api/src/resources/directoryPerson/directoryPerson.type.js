import { gql } from 'graphql-tag';

// Each list has its own types with only the fields the website shows.
const typeDef = gql`
  extend type Query {
    directoryVolunteers(role: String!, limit: Int, offset: Int): DirectoryVolunteerSearchResults
    directoryAwardWinners(award: [String]): [DirectoryAwardWinner]!
    directoryContact(id: ID!): DirectoryContact
  }

  type DirectoryTerm {
    start: String
    end: String
  }

  type DirectoryVolunteerSearchResults {
    results: [DirectoryVolunteerRole]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DirectoryVolunteerRole {
    personId: Int
    term: DirectoryTerm
    Person: DirectoryVolunteer
  }

  type DirectoryVolunteer {
    firstName: String
    surname: String
    email: String
    orcidId: String
    institutionName: String
    countryCode: String
    languages: [String]
    badges: [DirectoryBadge]
  }

  type DirectoryBadge {
    title: String
    year: Int
  }

  type DirectoryAwardWinner {
    firstName: String
    surname: String
    countryCode: String
    orcidId: String
    roles: [DirectoryAward]
  }

  type DirectoryAward {
    award: String
    term: DirectoryTerm
  }

  type DirectoryContact {
    id: ID!
    firstName: String
    surname: String
    orcidId: String
    jobTitle: String
    institutionName: String
    email: String
    phone: String
    address: String
    countryCode: String
    languages: [String]
    dataExpertise: [String]
    thematicExpertise: [String]
    badges: [DirectoryBadge]
    roles: [DirectoryRole]
    profilePicture: String
    participants: [Participant]
  }

  type DirectoryRole {
    role: String
    term: DirectoryTerm
  }
`;

export default typeDef;
