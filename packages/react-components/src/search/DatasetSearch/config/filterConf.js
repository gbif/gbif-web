export const filters = [
  'q',
  'datasetType',
  'license',
  // 'keyword',
  'anyPublisherKey',
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
  'anyPublisherKey',
  'hostingOrganizationKey',
  'publishingCountryCode',
  'hostingCountry',
];
const highlighted = [
  'q',
  'datasetType',
  'anyPublisherKey',
  'license',
];

export default { filters, included: included, highlighted };