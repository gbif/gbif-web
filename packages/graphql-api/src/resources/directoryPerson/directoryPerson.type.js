import { gql } from 'graphql-tag';

// Each list has its own types with only the fields the website shows.
const typeDef = gql`
  extend type Query {
    directoryTranslators(
      limit: Int
      offset: Int
    ): DirectoryTranslatorSearchResults
    directoryAmbassadors(
      limit: Int
      offset: Int
    ): DirectoryAmbassadorSearchResults
    directoryMentors(limit: Int, offset: Int): DirectoryMentorSearchResults
    directoryAwardWinners(award: [String]): [DirectoryAwardWinner]!
    directoryContact(id: ID!): DirectoryContact
  }

  type DirectoryTerm {
    start: String
    end: String
  }

  type DirectoryTranslatorSearchResults {
    results: [DirectoryTranslatorRole]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DirectoryTranslatorRole {
    personId: Int
    term: DirectoryTerm
    Person: DirectoryTranslator
  }

  type DirectoryTranslator {
    firstName: String
    surname: String
    countryCode: String
    orcidId: String
    languages: [String]
    certifications: [DirectoryCertification]
  }

  type DirectoryCertification {
    year: Int
  }

  type DirectoryAmbassadorSearchResults {
    results: [DirectoryAmbassadorRole]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DirectoryAmbassadorRole {
    personId: Int
    term: DirectoryTerm
    Person: DirectoryAmbassador
  }

  type DirectoryAmbassador {
    firstName: String
    surname: String
    email: String
    orcidId: String
    institutionName: String
    countryCode: String
    areasExpertise: [String]
  }

  type DirectoryMentorSearchResults {
    results: [DirectoryMentorRole]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DirectoryMentorRole {
    personId: Int
    award: String
    term: DirectoryTerm
    Person: DirectoryMentor
  }

  type DirectoryMentor {
    firstName: String
    surname: String
    email: String
    countryCode: String
    areasExpertise: [String]
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
