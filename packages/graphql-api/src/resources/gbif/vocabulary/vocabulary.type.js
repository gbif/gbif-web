import { gql } from 'apollo-server';

// since vocabulary search expose non released vocabularies, we will remove this option for now
// vocabularySearch(
//   limit: Int
//   offset: Int
//   q: String
//   name: String
//   deprecated: Boolean
//   key: ID
//   hasUnreleasedChanges: Boolean
//   namespace: String
// ): VocabularySearchResult

const typeDef = gql`
  extend type Query {
    vocabulary(key: ID!): Vocabulary

    vocabularyConcept(vocabulary: ID!, concept: ID!): VocabularyConcept

    vocabularyConceptSearch(
      vocabulary: ID!
      limit: Int
      offset: Int
      q: String
      parentKey: ID
      parent: String
      replacedByKey: ID
      name: String
      deprecated: Boolean
      # key: ID
      hasParent: Boolean
      hasReplacement: Boolean
      includeChildrenCount: Boolean
      includeChildren: Boolean
      includeParents: Boolean
    ): ConceptSearchResult!
    vocabulary(key: ID!): Vocabulary
  }

  type Vocabulary {
    # key: ID!,
    name: String!
    externalDefinitions: [String]!
    editorialNotes: [String]!
    replacedByKey: ID
    deprecated: DateTime
    deprecatedBy: String
    created: DateTime
    createdBy: String
    modified: DateTime
    modifiedBy: String
    namespace: String
    label: [VocabularyLabel]!
    definition: [VocabularyDefinition]!
    uiLabel(language: String): String
    uiDefinition(language: String): String
    concepts(
      limit: Int
      offset: Int
      q: String
      parentKey: ID
      parent: String
      replacedByKey: ID
      name: String
      deprecated: Boolean
      # key: ID
      hasParent: Boolean
      hasReplacement: Boolean
      includeChildrenCount: Boolean
      includeChildren: Boolean
      includeParents: Boolean
    ): ConceptSearchResult!
  }

  type VocabularyDefinition {
    # key: ID!
    language: String!
    value: String!
    created: DateTime
    createdBy: String
    modified: DateTime
    modifiedBy: String
  }

  type VocabularyLabel {
    # key: ID!
    language: String!
    value: String!
    created: DateTime
    createdBy: String
  }

  type VocabularyTag {
    # key: Int!
    name: String!
    description: String
    color: String
    created: String
    createdBy: String
    modified: String
    modifiedBy: String
  }

  type VocabularySearchResult {
    results: [Vocabulary]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type ConceptSearchResult {
    results: [VocabularyConcept!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type VocabularyConcept {
    # key: ID!
    name: String!
    replacedByKey: ID
    deprecated: String
    deprecatedBy: String
    created: String
    createdBy: String
    modified: String
    modifiedBy: String
    vocabularyKey: ID
    parentKey: ID
    childrenCount: Int
    alternativeLabelsLink: String
    hiddenLabelsLink: String
    children: [String]
    parents: [VocabularyConcept!]
    tags: [VocabularyTag]!
    sameAsUris: [String]
    label: [VocabularyLabel]
    definition: [VocabularyDefinition]!
    uiLabel(language: String): String!
    uiDefinition(language: String): String
    editorialNotes: [String]
    externalDefinitions: [String]
    vocabularyName: String
  }
`;

export default typeDef;
