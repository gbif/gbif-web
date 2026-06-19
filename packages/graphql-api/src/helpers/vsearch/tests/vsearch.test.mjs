import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import _ from 'lodash';
import VsearchParser from '../vsearchParser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const data = (name) => readFileSync(join(__dirname, 'data', name), 'utf8');

// 400nt query as shown in align1.txt ("Query  400nt >search")
const sequence = { search: 'A'.repeat(400) };

// 205nt sequences for blast6out2.txt and align2.txt, keyed 0–7
const sequences2 = Object.fromEntries(
  [
    'ATTGTCAGCAGGAATCGCACATGGAGGAGCATCAGTTGATCTGGCTATTTTTTCATTACACCTAGCAGGAATTTCATCAATTTTGGGGGCAGTAAATTTTATTACAACAGTAATTAATATGCGATCAACAGGGATTACTCTTGATCGAATACCTCTATTTGTATGATCAGTTGTTATTACTGCAATTCTTTTATTATTATCCCTC',
    'ATTATCTTCATATTTATTTCATTCATCACCATCTGTTGATATTGCAATTTTTTCTCTTCATATAACAGGAATTTCTTCTATTATTGGATCTTTAAATTTTATTGTTACAATTATATTAATAAAAAATTATTCTTTAAGTTATGATCAAATTAATTTATTTTCATGATCAGTTTGTATTACTGTAATTTTATTAATATTATCTTTA',
    'ACTTTCTGCTAGTATTGCACATGGAGGAGCTTCTGTTGATTTAGCTATTTTTTCCCTTCATTTAGCTGGAATATCATCAATTTTAGGGGCTGTAAATTTTATTACTACAGTAATTAATATACGATCTAATGGAATTTCTTATGATCGTATACCTTTATTTGTATGATCAGTAGTAATTACTGCTTTATTATTACTTTTATCATTA',
    'CTTATCAGCCAGTATTGCCCATACAGGAGCTTCTGTAGACTTAGCTATTTTTTCTTTACATTTAGCCGGAATTTCTTCTATTTTAGGAGCTGTAAATTTTATTACAACTACAATTAATATACGATCAAGAGGAATTACATTAGATCGAATACCTTTATTTGTTTGATCTGTTGTCATTACTGCAATTTTATTATTGCTTTCTCTT',
    'TCTTTCTTCAGGAATTGCTCATGGTGGTGCATCAGTAGATTTAGCTATTTTTTCTCTTCATTTAGCAGGAATTTCCTCTATTCTAGGAGCAGTAAACTTCATCACAACCGTGATTAATATACGATCAACAGGAATTACATTTGATCGAATACCTCTATTTGTTTGATCTGTGGTAATTACAGCTATCTTATTGTTACTATCTTTA',
    'ATTGTCAGCAGGAATCGCGCATGGAGGAGCATCAGTTGATCTGGCTATTTTTTCATTACACCTAGCAGGAATTTCATCAATTTTGGGGGCAGTAAATTTTATTACAACAGTAATTAATATGCGATCAACAGGGATTACTCTTGATCGAATACCTCTATTTGTATGATCAGTTGTTATTACTGCAATTCTTTTATTATTATCCCTC',
    'TCTATCCTCAATTATAGGTCATAATTCACCATCAGTAGATTTAGGAATTTTCTCTATTCATATTGCAGGTGTATCATCAATTATAGGATCAATTAATTTTATTGTAACAATTTTAAATATACATACAAAAACTCATTCATTAAACTTTTTACCATTATTTTCATGATCAGTTCTAGTTACAGCAATTCTCCTTTTATTATCATTA',
    'TCTTTCTGCTAGTATTGCACATGGAGGAGCTTCTGTTGATTTAGCTATTTTTTCTCTTCATTTAGCAGGAATATCTTCAATTTTAGGGGCAGTAAATTTTATTACAACAGTAATTAATATACGTTCTAGTGGACTTACTTATGATCGAATACCTTTATTTGTATGATCAGTAGTAATTACAGCTTTATTATTACTTCTATCATTA',
  ].map((s, i) => [i, s]),
);

const parser = new VsearchParser({
  MATCH_THRESHOLD: 97,
  MATCH_CLOSE_THRESHOLD: 95,
});

describe('vsearchResultToJson (blast6 tabular)', () => {
  test('parses all rows from blast6out1.txt', () => {
    const result = parser.vsearchResultToJson(data('blast6out1.txt'), sequence);
    assert.equal(result.length, 4);
  });

  test('maps columns to named fields on first row', () => {
    const [row] = parser.vsearchResultToJson(data('blast6out1.txt'), sequence);
    assert.equal(row['query id'], 'search');
    assert.equal(row['target header'], '960689729247305d1a5fc73c03bb88af');
    assert.equal(row.identity, '91.7');
    assert.equal(row.alignmentLength, '326');
    assert.equal(row.mismatches, '27');
    assert.equal(row.opens, '0');
    assert.equal(row.qstart, '1');
    assert.equal(row.qend, '400');
    assert.equal(row.sstart, '1');
    assert.equal(row.send, '1090');
    assert.equal(row.evalue, '-1');
    assert.equal(row['bit score'], '0');
  });

  test('extracts appliedScientificName from target header (no pipe → full string)', () => {
    const [row] = parser.vsearchResultToJson(data('blast6out1.txt'), sequence);
    // target header has no pipe separators, so appliedScientificName = full hash
    assert.equal(row.appliedScientificName, '960689729247305d1a5fc73c03bb88af');
    assert.equal(row.accession, '');
    assert.equal(row.scientificName, '');
  });

  test('computes qcovs as (alignmentLength / queryLength) * 100, rounded to 1 decimal', () => {
    const [row] = parser.vsearchResultToJson(data('blast6out1.txt'), sequence);
    // 326 / 400 * 100 = 81.5
    assert.equal(row.qcovs, 81.5);
  });

  test('returns BLAST_NO_MATCH sentinel for empty/falsy input', () => {
    assert.deepEqual(parser.vsearchResultToJson('', sequence), {
      matchType: 'BLAST_NO_MATCH',
    });
    assert.deepEqual(parser.vsearchResultToJson(null, sequence), {
      matchType: 'BLAST_NO_MATCH',
    });
  });

  test('returns BLAST_NO_MATCH sentinel for empty file', () => {
    // empty.txt is an empty string → falsy → hits the else branch
    assert.deepEqual(parser.vsearchResultToJson(data('empty.txt'), sequence), {
      matchType: 'BLAST_NO_MATCH',
    });
  });
});

describe('vsearchResultToJsonWithAligment (pairwise alignment)', () => {
  test('parses matches from align1.txt', () => {
    const result = parser.vsearchResultToJsonWithAligment(data('align1.txt'), sequence);
    assert.ok(Array.isArray(result));
    assert.ok(result.length > 0);
  });

  test('each match has required fields', () => {
    const result = parser.vsearchResultToJsonWithAligment(data('align1.txt'), sequence);
    for (const match of result) {
      assert.ok('query id' in match, 'missing query id');
      assert.ok('identity' in match, 'missing identity');
      assert.ok('alignmentLength' in match, 'missing alignmentLength');
      assert.ok('alignment' in match, 'missing alignment');
      assert.ok('accession' in match, 'missing accession');
      assert.ok('scientificName' in match, 'missing scientificName');
    }
  });

  test('identity values are numbers', () => {
    const result = parser.vsearchResultToJsonWithAligment(data('align1.txt'), sequence);
    for (const match of result) {
      assert.equal(typeof match.identity, 'number');
      assert.ok(match.identity > 0 && match.identity <= 100);
    }
  });

  test('filters matches where exact base matches are less than 50% of alignment length', () => {
    // All 4 matches in align1.txt have ~91% identity in real bases,
    // so they should pass the numExactBaseMatches / alignmentLength > 0.5 filter.
    const result = parser.vsearchResultToJsonWithAligment(data('align1.txt'), sequence);
    assert.equal(result.length, 4);
  });

  test('computes qcovs when sequence map is provided', () => {
    const result = parser.vsearchResultToJsonWithAligment(data('align1.txt'), sequence);
    for (const match of result) {
      assert.ok(typeof match.qcovs === 'number', 'qcovs should be a number');
      assert.ok(match.qcovs > 0 && match.qcovs <= 100);
    }
  });

  test('sets qcovs to undefined when query id is not in sequence map', () => {
    const result = parser.vsearchResultToJsonWithAligment(data('align1.txt'), {});
    // query id not in map → catch block fires → qcovs not set
    for (const match of result) {
      assert.equal(match.qcovs, undefined);
    }
  });

  test('returns BLAST_NO_MATCH sentinel for falsy input', () => {
    assert.deepEqual(parser.vsearchResultToJsonWithAligment(null, sequence), {
      matchType: 'BLAST_NO_MATCH',
    });
  });
});

describe('getMatchType', () => {
  test('returns BLAST_EXACT_MATCH at or above MATCH_THRESHOLD', () => {
    assert.equal(parser.getMatchType({ identity: '97' }), 'BLAST_EXACT_MATCH');
    assert.equal(parser.getMatchType({ identity: '100' }), 'BLAST_EXACT_MATCH');
  });

  test('returns BLAST_CLOSE_MATCH between thresholds', () => {
    assert.equal(parser.getMatchType({ identity: '95' }), 'BLAST_CLOSE_MATCH');
    assert.equal(parser.getMatchType({ identity: '96.9' }), 'BLAST_CLOSE_MATCH');
  });

  test('returns BLAST_WEAK_MATCH below MATCH_CLOSE_THRESHOLD', () => {
    assert.equal(parser.getMatchType({ identity: '91.7' }), 'BLAST_WEAK_MATCH');
    assert.equal(parser.getMatchType({ identity: '0' }), 'BLAST_WEAK_MATCH');
  });

  test('returns BLAST_NO_MATCH for falsy match', () => {
    assert.equal(parser.getMatchType(null), 'BLAST_NO_MATCH');
    assert.equal(parser.getMatchType(undefined), 'BLAST_NO_MATCH');
  });
});

describe('vsearchResultToJson (blast6out2.txt — real-world data)', () => {
  let result;
  // parse once and reuse
  test('parses 365 total rows across 8 queries', () => {
    result = parser.vsearchResultToJson(data('blast6out2.txt'), sequences2);
    assert.equal(result.length, 365);
  });

  test('row counts per query match expected', () => {
    result ??= parser.vsearchResultToJson(data('blast6out2.txt'), sequences2);
    const counts = result.reduce((acc, r) => {
      acc[r['query id']] = (acc[r['query id']] || 0) + 1;
      return acc;
    }, {});
    assert.deepEqual(counts, {
      '0': 3,
      '1': 100,
      '2': 100,
      '3': 35,
      '4': 8,
      '5': 3,
      '6': 16,
      '7': 100,
    });
  });

  test('parses pipe-delimited target header into appliedScientificName, accession, scientificName', () => {
    result ??= parser.vsearchResultToJson(data('blast6out2.txt'), sequences2);
    // First row of query 1: centroid=|GBAH0697-06|BOLD:AAD8159|url|seqs:26
    const q1 = result.filter((r) => r['query id'] === '1')[0];
    assert.equal(q1.appliedScientificName, 'centroid=');
    assert.equal(q1.accession, 'GBAH0697-06');
    assert.equal(q1.scientificName, 'BOLD:AAD8159');
  });

  test('computes qcovs = 100 for 100% identity, full-length alignment', () => {
    result ??= parser.vsearchResultToJson(data('blast6out2.txt'), sequences2);
    // Query 1, row 0: alignmentLength=205, identity=100.0, sequence[1].length=205
    const q1top = result.filter((r) => r['query id'] === '1' && r.identity === '100.0')[0];
    assert.equal(q1top.qcovs, 100);
  });

  test('handles empty accession field in target header', () => {
    result ??= parser.vsearchResultToJson(data('blast6out2.txt'), sequences2);
    // Query 0, row 0: centroid=|ANBIO157-19|BOLD:ABU9505||seqs:103 — 4th pipe segment is empty
    const q0top = result.filter((r) => r['query id'] === '0')[0];
    assert.equal(q0top.accession, 'ANBIO157-19');
    assert.equal(q0top.scientificName, 'BOLD:ABU9505');
  });
});

describe('vsearchResultToJsonWithAligment (align2.txt — real-world data)', () => {
  let result;

  test('parses 563 total matches across 8 queries', () => {
    result = parser.vsearchResultToJsonWithAligment(data('align2.txt'), sequences2);
    assert.equal(result.length, 563);
  });

  test('match counts per query match expected', () => {
    result ??= parser.vsearchResultToJsonWithAligment(data('align2.txt'), sequences2);
    const counts = result.reduce((acc, r) => {
      acc[r['query id']] = (acc[r['query id']] || 0) + 1;
      return acc;
    }, {});
    assert.deepEqual(counts, {
      '0': 201,
      '1': 100,
      '2': 100,
      '3': 35,
      '4': 8,
      '5': 3,
      '6': 16,
      '7': 100,
    });
  });

  test('each match has required fields', () => {
    result ??= parser.vsearchResultToJsonWithAligment(data('align2.txt'), sequences2);
    for (const match of result) {
      assert.ok('query id' in match, 'missing query id');
      assert.ok('identity' in match, 'missing identity');
      assert.ok('alignmentLength' in match, 'missing alignmentLength');
      assert.ok('alignment' in match, 'missing alignment');
      assert.ok('accession' in match, 'missing accession');
      assert.ok('scientificName' in match, 'missing scientificName');
    }
  });

  test('parses accession and scientificName from pipe-delimited target id', () => {
    result ??= parser.vsearchResultToJsonWithAligment(data('align2.txt'), sequences2);
    // First match for query 0: centroid=|CNKJE030-14|BOLD:AAR9768|url|seqs:74
    const q0 = result.filter((r) => r['query id'] === '0')[0];
    assert.equal(q0.accession, 'CNKJE030-14');
    assert.equal(q0.scientificName, 'BOLD:AAR9768');
  });

  test('identity values are numbers', () => {
    result ??= parser.vsearchResultToJsonWithAligment(data('align2.txt'), sequences2);
    for (const match of result) {
      assert.equal(typeof match.identity, 'number');
      assert.ok(match.identity > 0 && match.identity <= 100);
    }
  });
});

describe('getMatch (blast6out2.txt grouped by query id)', () => {
  let grouped;

  before(() => {
    const json = parser.vsearchResultToJson(data('blast6out2.txt'), sequences2);
    grouped = _.groupBy(json, 'query id');
  });

  test('returns the highest-identity match as the main result', () => {
    // Query 0: top identity is 99.5%
    const result = parser.getMatch(grouped['0'], false);
    assert.equal(result.identity, 99.5);
    assert.equal(result.distanceToBestMatch, 0);
  });

  test('returned match has the expected shape', () => {
    const result = parser.getMatch(grouped['0'], false);
    const expectedKeys = [
      'name',
      'identity',
      'appliedScientificName',
      'alignmentLength',
      'misMatches',
      'gapOpenings',
      'matchType',
      'bitScore',
      'expectValue',
      'qstart',
      'qend',
      'sstart',
      'send',
      'qcovs',
      'distanceToBestMatch',
      'accession',
    ];
    for (const key of expectedKeys) {
      assert.ok(key in result, `missing key: ${key}`);
    }
  });

  test('BLAST_EXACT_MATCH when top identity >= threshold with no ambiguity', () => {
    // Query 0: best=99.5% BOLD:ABU9505, the only other exact-threshold match (97.1%) has the same BOLD ID
    const result = parser.getMatch(grouped['0'], false);
    assert.equal(result.matchType, 'BLAST_EXACT_MATCH');
    assert.equal(result.name, 'BOLD:ABU9505');
    assert.equal(result.accession, 'ANBIO157-19');
  });

  test('BLAST_AMBIGUOUS_MATCH when another exact match with a different name is within threshold distance', () => {
    // Query 1: best=100% BOLD:AAD8159, second=97.1% BOLD:ACB0211 (different name, distance=2.9 < 3)
    const result = parser.getMatch(grouped['1'], false);
    assert.equal(result.matchType, 'BLAST_AMBIGUOUS_MATCH');
    assert.equal(result.identity, 100);
    assert.equal(result.name, 'BOLD:AAD8159');
  });

  test('BLAST_AMBIGUOUS_MATCH result includes the competing alternative', () => {
    const result = parser.getMatch(grouped['1'], false);
    assert.equal(result.alternatives?.length, 1);
    assert.equal(result.alternatives[0].name, 'BOLD:ACB0211');
    assert.equal(result.alternatives[0].matchType, 'BLAST_EXACT_MATCH');
    // distance from best (100.0) to 97.1% ≈ 2.9
    assert.ok(result.alternatives[0].distanceToBestMatch > 2.8 && result.alternatives[0].distanceToBestMatch < 3);
  });

  test('verbose=false: no alternatives on an unambiguous exact match', () => {
    // Query 0: same BOLD ID for the only other exact-threshold match — filtered out
    const result = parser.getMatch(grouped['0'], false);
    assert.equal(result.alternatives, undefined);
  });

  test('verbose=true: all non-best matches are included as alternatives', () => {
    // Query 0 has 3 total rows → 2 alternatives
    const result = parser.getMatch(grouped['0'], true);
    assert.equal(result.alternatives.length, 2);
  });

  test('verbose=true alternatives include matches below exact threshold', () => {
    // Query 0 verbose: alt[1] should be the 90.2% BOLD:AEC3791 weak match
    const result = parser.getMatch(grouped['0'], true);
    const weakAlt = result.alternatives.find((a) => a.matchType === 'BLAST_WEAK_MATCH');
    assert.ok(weakAlt, 'expected a BLAST_WEAK_MATCH alternative in verbose mode');
    assert.equal(weakAlt.name, 'BOLD:AEC3791');
  });

  test('query with many exact matches can yield many alternatives in verbose mode', () => {
    // Query 2: 100 rows → 99 alternatives in verbose mode
    const result = parser.getMatch(grouped['2'], true);
    assert.equal(result.alternatives.length, 99);
  });

  test('works when destructured from the parser instance (this binding)', () => {
    // Regression: private fields threw when getMatch was called without its instance as 'this'
    const { getMatch } = parser;
    const result = getMatch(grouped['1'], false);
    assert.equal(result.matchType, 'BLAST_AMBIGUOUS_MATCH');
  });
});

describe('sanitizeSequence', () => {
  test('keeps valid IUPAC nucleotide characters', () => {
    const valid = 'ACGTURYSWKMBDHVNacgturyswkmbdhvn';
    assert.equal(parser.sanitizeSequence(valid), valid);
  });

  test('strips non-nucleotide characters', () => {
    // T is a valid IUPAC character; '1', '-', and ' ' are stripped
    assert.equal(parser.sanitizeSequence('A1C-G T'), 'ACGT');
    assert.equal(parser.sanitizeSequence('!@#$%'), '');
  });
});
