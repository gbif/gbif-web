import { gql } from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    userValidations(limit: Int, offset: Int): ValidationListResults!
      @cacheControl(maxAge: 0, scope: PRIVATE)
    """
    A validation by key. Needs a signed in user; any signed in user can read any validation.
    """
    validation(key: ID!): Validation @cacheControl(maxAge: 0, scope: PRIVATE)
    """
    The categories of validator issues, in the order the validator evaluates them.
    """
    validationEvaluationCategories: [String!]!
  }

  type ValidationListResults {
    results: [Validation!]!
    limit: Int!
    offset: Int!
    count: Int!
    endOfRecords: Boolean!
  }

  type Validation {
    key: String!
    created: DateTime
    modified: DateTime
    username: String
    file: String
    fileSize: Long
    fileFormat: String
    status: String
    metrics: ValidationMetrics
    """
    The EML of a validated Darwin Core Archive, as parsed by the validator.
    """
    eml: JSON @cacheControl(maxAge: 0, scope: PRIVATE)
  }

  type ValidationMetrics {
    indexeable: Boolean
    error: String
    files: [ValidationFile!]
    stepTypes: [ValidationStep!]
  }

  type ValidationStep {
    stepType: String
    status: String
    executionOrder: Int
    message: String
  }

  type ValidationFile {
    fileType: String
    fileName: String
    rowType: String
    count: Long
    indexedCount: Long
    """
    The registered Darwin Core extension or core of the row type
    """
    extension: DwcExtension
    terms: [ValidationTerm!]
    issues: [ValidationIssue!]
  }

  type DwcExtension {
    identifier: String!
    title: String
    description: String
    url: String
  }

  type ValidationTerm {
    term: String
    rawIndexed: Long
    interpretedIndexed: Long
  }

  type ValidationIssue {
    issue: String
    issueCategory: String
    count: Long
    """
    ERROR, WARNING or INFO, from the interpretationRemark enumeration
    """
    severity: String
    samples: [ValidationIssueSample!]
  }

  type ValidationIssueSample {
    recordId: String
    relatedData: JSON
  }
`;

export default typeDef;
