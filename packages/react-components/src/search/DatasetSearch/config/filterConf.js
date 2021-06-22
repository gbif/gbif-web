export const all = [
  'q',
  'datasetType',
  'license',
  // 'keyword',
  'publisherKey',
  'hostingOrganizationKey',
  // 'decade',
  'publishingCountryCode',
  'hostingCountry',
  'networkKey'
].sort();

const included = [
  'q',
  'datasetType',
  'license',
  'publisherKey',
  'hostingOrganizationKey',
  'publishingCountryCode',
  'hostingCountry',
];
const highlighted = [
  'q',
  'datasetType',
  'publisherKey',
  'license',
];

export default { filters: all, included: included, highlighted };