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
  'eventType',
  'eventDatasetKey',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'year',
  'month',
  'eventStateProvince',
  'locationId',
];

export default { filters, included: filters, highlighted };
