/* eslint-env mocha */
import { deepEqual, equal } from 'assert';
import v1ToOccurrence, { isUnavailable, splitMultiValue, toLicense } from './v1ToOccurrence';

// trimmed down from https://api.gbif.org/v1/occurrence/1291505203
const holotype = {
  key: 1291505203,
  datasetKey: '7e380070-f762-11e1-a439-00145eb45e9a',
  networkKeys: ['17abcf75-2f1e-46dd-bf75-a5b21dd02655'],
  recordedBy: 'J Delacour|W P. Lowe',
  typeStatus: 'Holotype',
  higherGeography: 'Asia; Laos',
  otherCatalogNumbers: 'NHMUK:ecatalogue:2300616',
  issues: ['TAXON_MATCH_HIGHERRANK', 'INSTITUTION_MATCH_FUZZY', 'INSTITUTION_COLLECTION_MISMATCH'],
  classifications: {
    'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c': {
      usage: { key: '2492993', name: 'Pteruthius aenobarbus (Temminck, 1836)', rank: 'SPECIES' },
      classification: [{ key: '1', name: 'Animalia', rank: 'KINGDOM' }],
      issues: ['TAXON_MATCH_HIGHERRANK'],
      iucnRedListCategoryCode: 'LC',
    },
  },
  nucleotideSequence: [],
  gadm: {},
};

describe('v1ToOccurrence', () => {
  it('splits pipe-joined multi-value fields into lists', () => {
    const occurrence = v1ToOccurrence(holotype);
    deepEqual(occurrence.recordedBy, ['J Delacour', 'W P. Lowe']);
    deepEqual(occurrence.typeStatus, ['Holotype']);
    deepEqual(occurrence.higherGeography, ['Asia; Laos']);
    deepEqual(occurrence.otherCatalogNumbers, ['NHMUK:ecatalogue:2300616']);
  });

  it('returns empty lists for missing multi-value fields', () => {
    const occurrence = v1ToOccurrence(holotype);
    deepEqual(occurrence.identifiedBy, []);
    deepEqual(occurrence.datasetName, []);
    deepEqual(occurrence.preparations, []);
  });

  it('turns classifications into a list with the checklistKey on each item', () => {
    const occurrence = v1ToOccurrence(holotype);
    equal(occurrence.classifications.length, 1);
    equal(occurrence.classifications[0].checklistKey, 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c');
    equal(occurrence.classifications[0].usage.key, '2492993');
    equal(occurrence.classifications[0].iucnRedListCategoryCode, 'LC');
  });

  it('derives nonTaxonomicIssues from the classification issues', () => {
    const occurrence = v1ToOccurrence(holotype);
    deepEqual(occurrence.nonTaxonomicIssues, ['INSTITUTION_MATCH_FUZZY', 'INSTITUTION_COLLECTION_MISMATCH']);
    equal(occurrence.issues.length, 3);
  });

  it('treats taxon match issues as taxonomic when there are no classifications', () => {
    // e.g. https://api.gbif.org/v1/occurrence/3014930942 has TAXON_MATCH_NONE and no classifications
    const occurrence = v1ToOccurrence({
      key: 3014930942,
      issues: ['COLLECTION_MATCH_NONE', 'TAXON_MATCH_NONE'],
    });
    deepEqual(occurrence.nonTaxonomicIssues, ['COLLECTION_MATCH_NONE']);
  });

  it('maps license URLs to the License enum', () => {
    equal(toLicense('http://creativecommons.org/licenses/by/4.0/legalcode'), 'CC_BY_4_0');
    equal(toLicense('http://creativecommons.org/licenses/by-nc/4.0/legalcode'), 'CC_BY_NC_4_0');
    equal(toLicense('http://creativecommons.org/publicdomain/zero/1.0/legalcode'), 'CC0_1_0');
    equal(toLicense('CC_BY_4_0'), 'CC_BY_4_0');
    equal(toLicense('https://example.org/some-other-license'), 'UNSUPPORTED');
    equal(toLicense(undefined), undefined);
  });

  it('falls back to the first identifiers entry for identifier', () => {
    // e.g. https://api.gbif.org/v1/occurrence/784091062
    const occurrence = v1ToOccurrence({
      key: 784091062,
      identifiers: [{ identifier: 'urn:catalog:MfN:Neptune Database:5063_DASTR0100' }],
    });
    equal(occurrence.identifier, 'urn:catalog:MfN:Neptune Database:5063_DASTR0100');
  });

  it('renames networkKeys and nucleotideSequence', () => {
    const occurrence = v1ToOccurrence({
      ...holotype,
      nucleotideSequence: [{ nucleotideSequenceID: 'abc', sequence: 'ACGT', targetGene: 'COI' }],
    });
    deepEqual(occurrence.networkKey, ['17abcf75-2f1e-46dd-bf75-a5b21dd02655']);
    equal(occurrence.networkKeys, undefined);
    equal(occurrence.nucleotideSequence, undefined);
    deepEqual(occurrence.nucleotideSequences, [
      { nucleotideSequenceID: 'abc', sequence: 'ACGT', targetGene: { concept: 'COI', lineage: null } },
    ]);
  });

  it('defaults lists that resolvers expect to exist', () => {
    const occurrence = v1ToOccurrence({ key: 1 });
    deepEqual(occurrence.issues, []);
    deepEqual(occurrence.media, []);
    deepEqual(occurrence.classifications, []);
    deepEqual(occurrence.nonTaxonomicIssues, []);
  });

  it('drops a top-level verbatimScientificName, which is another term with the same name', () => {
    // e.g. https://api.gbif.org/v1/occurrence/6216428301 carries http://plazi.org/terms/1.0/verbatimScientificName
    const occurrence = v1ToOccurrence({
      ...holotype,
      verbatimScientificName: 'Primula maershanensis J. L. Gu & Z. K. Wu',
    });
    equal('verbatimScientificName' in occurrence, false);
  });

  it('recognises records es-api could not load', () => {
    equal(isUnavailable({ key: 1 }), true);
    equal(isUnavailable(holotype), false);
    equal(isUnavailable(null), false);
  });

  it('gives the same result when run twice', () => {
    const record = {
      ...holotype,
      nucleotideSequence: [{ nucleotideSequenceID: 'abc', sequence: 'ACGT', targetGene: 'COI' }],
      license: 'http://creativecommons.org/licenses/by/4.0/legalcode',
    };
    deepEqual(v1ToOccurrence(v1ToOccurrence(record)), v1ToOccurrence(record));
  });

  it('leaves values that are already lists alone', () => {
    deepEqual(splitMultiValue(['a', 'b']), ['a', 'b']);
    deepEqual(splitMultiValue(' a | | b '), ['a', 'b']);
    deepEqual(splitMultiValue(undefined), []);
  });
});
