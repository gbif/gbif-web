export const filters = [
  'datasetKeySingle', 'projectId', 'taxonKeySingle'
].sort();

const highlighted = [
  'taxonKeySingle', 'datasetKeySingle', 'projectId'
];

export default { filters, included: filters, highlighted };