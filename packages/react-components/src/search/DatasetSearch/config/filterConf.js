export const all = [
  'q',
  'datasetType',
  'license',
  // 'keyword',
  'publisherKey',
  'hostingOrganizationKey',
  'endorsingNodeKey',
  'decade',
  'publishingCountryCode',
  'hostingCountry',
  'networkKey'
].sort();

const highlighted = [
  'q',
  'datasetType',
  'publisherKey',
  'license',
];

export default { filters: all, included: all, highlighted };