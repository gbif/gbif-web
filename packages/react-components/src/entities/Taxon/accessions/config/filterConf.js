export const filters = [
  'eventSamplingProtocol',
  'country',
  'eventDatasetKey',
  'measurementOrFactTypes',
  'year',
  'month',
  'eventStateProvince',
  'eventId',
  'locationId',
  'eventCatalogNumber',
].sort();

const highlighted = [
  'eventCatalogNumber',
  'eventDatasetKey',
  'month',
  'year',
  'locationId',
  'eventStateProvince',
];

export default { filters, included: filters, highlighted };
