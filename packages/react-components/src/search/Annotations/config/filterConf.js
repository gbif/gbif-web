export const filters = [
  'datasetKeySingle', 'projectId', 'taxonKeySingle', 'rulesetId'
].sort();

const highlighted = [
  'taxonKeySingle', 'datasetKeySingle', 'projectId', 'rulesetId'
];

export default { filters, included: filters, highlighted };