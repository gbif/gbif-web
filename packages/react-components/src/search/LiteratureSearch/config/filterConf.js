export const all = [
  'q',
  'year',
  'countriesOfResearcher',
  'countriesOfCoverage',
  'datasetKey',
  'publisherKey',
  'literatureType'
].sort();

const highlighted = [
  'q',
  'year',
  'countriesOfResearcher',
  'datasetKey'
];

export default { filters: all, included: all, highlighted };