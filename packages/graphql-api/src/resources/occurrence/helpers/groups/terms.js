/**
 * terms.json is a plain dump of the term list
 * (it partly mirrors https://api.gbif.org/v1/occurrence/term/)
 * and should be kept free of our own additions, so that it can be replaced
 * with a newer dump - or fetched from the API - without losing anything.
 *
 * Everything we need on top of the dump is added here instead:
 *  compareWithVerbatim: false  the interpreted value isn't a version of the verbatim value,
 *                              so we shouldn't flag it as altered/inferred
 *  esField                     where to find the value in the Elasticsearch document
 */
import rawTerms from './terms.json';

// simpleName -> fields that aren't part of the dump
const decorations = {
  datasetID: { compareWithVerbatim: false },
  datasetName: { compareWithVerbatim: false },
  recordedBy: { compareWithVerbatim: false },
  preparations: { compareWithVerbatim: false },
  samplingProtocol: { compareWithVerbatim: false },
  typeStatus: { compareWithVerbatim: false },
  identifiedBy: { compareWithVerbatim: false },
  acceptedScientificName: { esField: 'gbifClassification.acceptedUsage.name' },
  subgenus: { esField: 'gbifClassification.subgenus' },
  specificEpithet: { esField: 'gbifClassification.usageParsedName.specificEpithet' },
  infraspecificEpithet: { esField: 'gbifClassification.usageParsedName.infraspecificEpithet' },
  taxonRank: { esField: 'gbifClassification.usageParsedName.rank' },
  synonym: { esField: 'gbifClassification.synonym' },
  datasetKey: { compareWithVerbatim: false },
  publishingCountry: { compareWithVerbatim: false },
  lastInterpreted: { compareWithVerbatim: false },
  protocol: { compareWithVerbatim: false },
  lastParsed: { compareWithVerbatim: false },
  lastCrawled: { compareWithVerbatim: false },
  repatriated: { compareWithVerbatim: false },
  recordedByID: { compareWithVerbatim: false, esField: 'recordedByIDs' },
  identifiedByID: { compareWithVerbatim: false, esField: 'identifiedByIDs' },
};

const terms = rawTerms.map((term) => ({
  ...term,
  ...decorations[term.simpleName],
}));

export default terms;
