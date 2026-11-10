/**
 * Map an occurrence from the GBIF API v1 (`/occurrence/{key}`, and the records es-api returns from
 * search, which are in the same format) to the shape the Occurrence GraphQL type has always used.
 * The type was written against the Elasticsearch document, so the v1 record needs a few adjustments:
 *
 * - multi-value fields come from v1 as one string joined by `|`; the schema has them as lists
 * - classifications is an object keyed by checklistKey in v1; the schema has a list
 * - nucleotideSequence is called nucleotideSequences in the schema, and targetGene is an object
 * - nonTaxonomicIssues isn't in v1; it is the issues that no classification lists as its own
 * - networkKeys is called networkKey in the schema
 * - license is a URL in v1; the schema has the License enum
 * - identifier is left out of v1 for some records, but is still in identifiers
 *
 * verbatimScientificName isn't in the v1 record at all. The resolver gets it from the verbatim
 * record when it is asked for.
 */

const MULTI_VALUE_FIELDS = [
  'recordedBy',
  'identifiedBy',
  'typeStatus',
  'higherGeography',
  'otherCatalogNumbers',
  'datasetID',
  'datasetName',
  'samplingProtocol',
  'preparations',
];

// Issues about matching the record to a taxonomy. The same list as the API's
// OccurrenceIssue.TAXONOMIC_RULES; it covers records that didn't match at all and so have no
// classifications to take the issues from.
const TAXONOMIC_ISSUES = [
  'TAXON_MATCH_FUZZY',
  'TAXON_MATCH_HIGHERRANK',
  'TAXON_MATCH_AGGREGATE',
  'TAXON_MATCH_NONE',
  'TAXON_MATCH_NAME_AND_ID_AMBIGUOUS',
  'TAXON_MATCH_SCIENTIFIC_NAME_ID_IGNORED',
  'TAXON_MATCH_TAXON_CONCEPT_ID_IGNORED',
  'TAXON_MATCH_TAXON_ID_IGNORED',
  'SCIENTIFIC_NAME_ID_NOT_FOUND',
  'TAXON_CONCEPT_ID_NOT_FOUND',
  'TAXON_ID_NOT_FOUND',
  'SCIENTIFIC_NAME_AND_ID_INCONSISTENT',
];

const LICENSES = ['CC0_1_0', 'CC_BY_4_0', 'CC_BY_NC_4_0', 'UNSPECIFIED', 'UNSUPPORTED'];

export function toLicense(license) {
  if (!license) return undefined;
  if (LICENSES.includes(license)) return license;
  if (license.includes('creativecommons.org/publicdomain/zero/')) return 'CC0_1_0';
  if (license.includes('creativecommons.org/licenses/by-nc/')) return 'CC_BY_NC_4_0';
  if (license.includes('creativecommons.org/licenses/by/')) return 'CC_BY_4_0';
  return 'UNSUPPORTED';
}

export function splitMultiValue(value) {
  if (value === null || typeof value === 'undefined') return [];
  if (Array.isArray(value)) return value;
  return String(value)
    .split('|')
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
}

function toClassifications(classifications) {
  if (!classifications) return [];
  if (Array.isArray(classifications)) return classifications;
  return Object.keys(classifications).map((checklistKey) => ({
    ...classifications[checklistKey],
    checklistKey,
  }));
}

function toNucleotideSequences(sequences) {
  if (!Array.isArray(sequences)) return [];
  return sequences.map((sequence) => {
    const { targetGene } = sequence;
    if (typeof targetGene === 'string') {
      return { ...sequence, targetGene: { concept: targetGene, lineage: null } };
    }
    return sequence;
  });
}

function getNonTaxonomicIssues(issues, classifications) {
  const taxonomicIssues = new Set([...TAXONOMIC_ISSUES, ...classifications.flatMap((c) => c.issues ?? [])]);
  return issues.filter((issue) => !taxonomicIssues.has(issue));
}

export default function v1ToOccurrence(record) {
  if (!record) return record;
  const occurrence = { ...record };

  MULTI_VALUE_FIELDS.forEach((field) => {
    occurrence[field] = splitMultiValue(record[field]);
  });

  occurrence.issues = record.issues ?? [];
  occurrence.classifications = toClassifications(record.classifications);
  occurrence.nonTaxonomicIssues = getNonTaxonomicIssues(occurrence.issues, occurrence.classifications);
  occurrence.nucleotideSequences = toNucleotideSequences(record.nucleotideSequence ?? record.nucleotideSequences);
  delete occurrence.nucleotideSequence;
  occurrence.networkKey = record.networkKeys ?? record.networkKey ?? [];
  delete occurrence.networkKeys;

  occurrence.media = record.media ?? [];
  occurrence.facts = record.facts ?? [];
  occurrence.recordedByIDs = record.recordedByIDs ?? [];
  occurrence.identifiedByIDs = record.identifiedByIDs ?? [];
  occurrence.gadm = record.gadm ?? {};
  occurrence.license = toLicense(record.license);
  occurrence.identifier = record.identifier ?? record.identifiers?.[0]?.identifier;

  return occurrence;
}
