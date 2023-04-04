export const filters = [
  'q', 'datasetKey', 'projectId', 'taxonKey'
].sort();

const highlighted = [
  'datasetKey', 'taxonKey', 'projectId'
];

export default { filters, included: filters, highlighted };