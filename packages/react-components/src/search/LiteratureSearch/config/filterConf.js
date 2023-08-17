export const filters = [
  'q',
  'year',
  'countriesOfResearcher',
  'countriesOfCoverage',
  'datasetKey',
  'gbifPublisherKey',
  'literatureType'
].sort();

const highlighted = [
  'q',
  'year',
  'countriesOfResearcher',
  'datasetKey'
];

export default { filters, included: filters, highlighted };