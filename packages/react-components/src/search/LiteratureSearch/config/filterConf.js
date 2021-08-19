export const all = [
  'q',
  'year',
  'countriesOfResearcher',
  'countriesOfCoverage',
  'datasetKey',
  'publisherKey'
].sort();

const highlighted = [
  'q',
  'year',
  'countriesOfResearcher',
  'datasetKey'
];

export default { filters: all, included: all, highlighted };