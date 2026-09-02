import { gql } from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    """
    The Darwin Core data package validation report for a dataset, as produced by the
    validator service. Defaults to the report for the dataset's latest crawl attempt;
    pass attempt to fetch the report for a specific past attempt.
    """
    dwdpValidationReport(datasetKey: ID!, attempt: String): DwdpValidationReport
  }

  type DwdpValidationReport {
    datasetKey: ID!
    attempt: String
    version: String
    metadata: DwdpValidationMetadata
    result: DwdpValidationResult
  }

  type DwdpValidationMetadata {
    features: [DwdpValidationFeature!]
    started: String
    finished: String
    valid: Boolean
  }

  enum DwdpValidationFeature {
    COUNT
    COUNT_DISTINCT
    FOREIGN_KEY_CONSTRAINT
    PRIMARY_KEY_UNIQUE
    DATA_TYPE_CONSTRAINT
    DESCRIPTOR_VALIDATION
    EML_VALIDATION
  }

  type DwdpValidationResult {
    descriptorValidation: DwdpDescriptorValidation
    emlValidation: DwdpEmlValidation
    resourceAnalysisResults: [DwdpResourceAnalysisResult!]
  }

  type DwdpDescriptorValidation {
    isValid: Boolean
    hasDataAnalysis: Boolean
    issues: [DwdpValidationIssue!]
  }

  type DwdpEmlValidation {
    isValid: Boolean
    isPresent: Boolean
    issues: [DwdpValidationIssue!]
  }

  type DwdpValidationIssue {
    severity: DwdpValidationIssueSeverity
    violationType: DwdpValidationViolationType
    message: String
    detail: String
    location: String
  }

  enum DwdpValidationIssueSeverity {
    ERROR
    WARNING
    INFO
  }

  enum DwdpValidationViolationType {
    DESCRIPTOR_NOT_FOUND
    INVALID_JSON
    MISSING_RESOURCES
    PATH_NOT_FOUND
    MISSING_NAME
    RESOURCE_MISSING_NAME
    FK_UNKNOWN_REFERENCE_RESOURCE
    UNKNOWN_FIELD_TYPE
    UNRECOGNIZED_PROFILE_VERSION
    JSON_SCHEMA_VIOLATION
    JSON_SCHEMA_UNAVAILABLE
    REQUIRED_FIELD_MISSING
    FIELD_TYPE_MISMATCH
    FOREIGN_KEY_MISSING
    UNKNOWN_FIELD
    TABLE_SCHEMA_UNAVAILABLE
    INVALID_XML
    EML_MISSING_TITLE
    EML_MISSING_CREATOR
    EML_XSD_VIOLATION
    EML_XSD_UNAVAILABLE
  }

  type DwdpResourceAnalysisResult {
    name: String
    totalRows: Int
    columnStatistics: [DwdpColumnAnalysis!]
    dataTypeViolations: [DwdpDataTypeViolation!]
    foreignKeyViolations: [DwdpForeignKeyViolation!]
    primaryKeyViolation: DwdpPrimaryKeyViolation
  }

  type DwdpColumnAnalysis {
    name: String
    populatedValues: Int
    uniqueValues: Int
  }

  type DwdpDataTypeViolation {
    resource: String
    field: String
    declaredType: String
    violationCount: Int
    sampleValues: [String!]
  }

  type DwdpForeignKeyViolation {
    resource: String
    fields: [String!]
    referenceResource: String
    referenceFields: [String!]
    violationCount: Int
    sampleRows: [JSON!]
  }

  type DwdpPrimaryKeyViolation {
    resource: String
    fields: [String!]
    violationCount: Int
    sampleRows: [JSON!]
  }
`;

export default typeDef;
