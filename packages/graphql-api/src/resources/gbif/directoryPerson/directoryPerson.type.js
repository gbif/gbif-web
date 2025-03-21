import { gql } from 'apollo-server';

const typeDef = gql`
  extend type Query {
    directoryTranslators(
      limit: Int
      offset: Int
    ): DirectoryPersonRoleSearchResults
    directoryAmbassadors(
      limit: Int
      offset: Int
    ): DirectoryContactRoleSearchResults
    directoryMentors(limit: Int, offset: Int): DirectoryContactRoleSearchResults
    directoryAwardWinners(award: [String]): [DirectoryPerson]!
  }

  type DirectoryPersonRole {
    relationshipId: Int
    personId: Int
    role: String
    programme: String
    award: String
    term: DirectoryTerm
    Person: DirectoryPerson
  }

  type DirectoryContactRole {
    relationshipId: Int
    personId: Int
    role: String
    programme: String
    award: String
    term: DirectoryTerm
    Person: DirectoryContact
  }

  type DirectoryTerm {
    start: String
    end: String
  }

  type DirectoryPersonRoleSearchResults {
    results: [DirectoryPersonRole]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DirectoryContactRoleSearchResults {
    results: [DirectoryContactRole]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type DirectoryPerson {
    id: ID!
    firstName: String
    surname: String
    title: String
    orcidId: String
    jobTitle: String
    institutionName: String
    countryCode: String
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    roles: [DirectoryPersonRole]
    certifications: [Certification]
    languages: [String]
    areasExpertise: [String]
    profileDescriptions: [ProfileDescription]
    profilePicture(base64: Boolean): String
  }

  type DirectoryContact {
    id: ID!
    firstName: String
    surname: String
    title: String
    orcidId: String
    jobTitle: String
    institutionName: String
    email: String
    secondaryEmail: String
    phone: String
    skype: String
    address: String
    countryCode: String
    fax: String
    createdBy: String
    modifiedBy: String
    created: DateTime
    modified: DateTime
    roles: [DirectoryPersonRole]
    certifications: [Certification]
    languages: [String]
    areasExpertise: [String]
    profileDescriptions: [ProfileDescription]
    profilePicture(base64: Boolean): String
    participants: [Participant]
  }

  type Certification {
    key: Int
    title: String
    level: String
    year: Int
    createdBy: String
    created: String
  }

  type ProfileDescription {
    key: Int
    language: String
    description: String
    createdBy: String
    created: String
    modifiedBy: String
    modified: String
  }
`;

export default typeDef;
