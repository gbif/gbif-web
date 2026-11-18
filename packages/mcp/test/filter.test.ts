import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFilter, countryName } from '../src/filter.js';

const lookups = {
  taxonByKey: async (key: string) =>
    key === '2435099'
      ? { key, name: 'Puma concolor (Linnaeus, 1771)', canonicalName: 'Puma concolor', rank: 'SPECIES', status: 'ACCEPTED' }
      : null,
};

test('a strict filter becomes a predicate and echoes itself', async () => {
  const f = await parseFilter('country=DK year=2010-2025 basisOfRecord=HUMAN_OBSERVATION', lookups);
  assert.equal(f.ok, true);
  assert.equal(f.reuse, 'country=DK year=2010-2025 basisOfRecord=HUMAN_OBSERVATION');
  assert.deepEqual(f.predicate, {
    type: 'and',
    predicates: [
      { type: 'equals', key: 'countryCode', value: 'DK' },
      { type: 'and', predicates: [
        { type: 'greaterThanOrEquals', key: 'year', value: 2010 },
        { type: 'lessThanOrEquals', key: 'year', value: 2025 },
      ] },
      { type: 'equals', key: 'basisOfRecord', value: 'HUMAN_OBSERVATION' },
    ],
  });
  assert.deepEqual(f.notApplied, []);
});

test('comma is OR, case of codes is normalised', async () => {
  const f = await parseFilter('country=dk,se', lookups);
  assert.deepEqual(f.predicate, { type: 'in', key: 'countryCode', values: ['DK', 'SE'] });
  assert.equal(f.reuse, 'country=DK,SE');
});

test('open-ended and single-year ranges', async () => {
  assert.deepEqual((await parseFilter('year>=2010', lookups)).predicate, { type: 'greaterThanOrEquals', key: 'year', value: 2010 });
  assert.deepEqual((await parseFilter('year=2020', lookups)).predicate, { type: 'equals', key: 'year', value: 2020 });
  assert.equal((await parseFilter('year=2010-2025', lookups)).links.api.includes('year=2010%2C2025'), true);
});

test('taxonKey is looked up and echoed with its name', async () => {
  const f = await parseFilter('taxonKey=2435099 country=DK', lookups);
  assert.equal(f.ok, true);
  assert.equal(f.reuse, 'taxonKey=2435099 country=DK');
  assert.match(f.description, /Puma concolor \(species\)/);
  assert.equal(f.taxon?.key, '2435099');
});

test('a taxonKey that does not exist is an error, not a name search', async () => {
  const f = await parseFilter('taxonKey=nope', lookups);
  assert.equal(f.ok, false);
  assert.match(f.errors.join(' '), /does not exist/);
});

test('unrecognised input is reported, never dropped silently', async () => {
  const f = await parseFilter('country=DK colour=red invasive', lookups);
  assert.equal(f.ok, true);
  assert.equal(f.notApplied.length, 2);
  assert.match(f.notApplied[0], /colour=red.*NOT limited/);
  assert.match(f.notApplied[1], /free text/);
});

test('a misspelt field gets a suggestion', async () => {
  const f = await parseFilter('contry=DK year=2020', lookups);
  assert.match(f.notApplied[0], /Did you mean country/);
});

test('bad values are reported and leave the rest of the filter working', async () => {
  const f = await parseFilter('country=Denmark year=abc basisOfRecord=nonsense month=6', lookups);
  assert.equal(f.ok, true);
  assert.equal(f.parts.length, 1);
  assert.equal(f.notApplied.length, 3);
});

test('nothing usable gives guidance and no query', async () => {
  const f = await parseFilter('hello', lookups);
  assert.equal(f.ok, false);
  assert.equal(f.predicate, null);
  assert.match(f.errors[0], /No usable filter/);
});

test('negation is reported as not supported', async () => {
  const f = await parseFilter('country=DK country!=SE', lookups);
  assert.match(f.notApplied[0], /negation/);
});

test('links point at gbif.org and the v1 API with the same filter', async () => {
  const f = await parseFilter('country=DK basisOfRecord=PRESERVED_SPECIMEN', lookups);
  assert.equal(f.links.see, 'https://www.gbif.org/occurrence/search?country=DK&basis_of_record=PRESERVED_SPECIMEN');
  assert.equal(f.links.api, 'https://api.gbif.org/v1/occurrence/search?country=DK&basisOfRecord=PRESERVED_SPECIMEN&limit=0');
});

test('country names come from ISO codes', () => {
  assert.equal(countryName('DK'), 'Denmark');
  assert.equal(countryName('ZZ'), undefined);
});
