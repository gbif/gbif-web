import { gql } from 'graphql-tag';

const typeDef = gql`
  extend type Query {
    """
    Validate and normalise a batch of raw nucleotide sequences via the GBIF
    validation/sequence service. Results are returned in the same order as the input; each
    carries the sanitised (normalised) sequence and its nucleotideSequenceID — the hash GBIF
    uses to identify a sequence — so a caller can pair a raw sequence with its interpreted
    counterpart (e.g. an entry in occurrence.nucleotideSequences) regardless of array order.
    A null element means that sequence could not be validated (e.g. an upstream error).
    """
    sequenceValidation(sequences: [String!]!): [SequenceValidationResult]!
  }

  type SequenceValidationResult {
    "The sequence exactly as supplied."
    rawSequence: String
    "The normalised/sanitised sequence (whitespace and gaps removed, ends trimmed, upper-cased)."
    sequence: String
    "Hash identifying the normalised sequence; matches nucleotideSequence.nucleotideSequenceID."
    nucleotideSequenceID: String
    sequenceLength: Int
    "True when the input is not a usable nucleotide sequence."
    invalid: Boolean
    endsTrimmed: Boolean
    gapsOrWhitespaceRemoved: Boolean
    naturalLanguageDetected: Boolean
    nFraction: Float
    nonIupacFraction: Float
    nonACGTNFraction: Float
    gcContent: Float
  }
`;

export default typeDef;
