export const filters = [
  'eventSamplingProtocol',
  'country',
  'eventDatasetKey',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince',
  'eventId',
  'eventTaxonKey',
  'eventType',
  'locationId',
].sort();

const highlighted = [
  'eventDatasetKey',
  'eventType',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince',
  'locationId',
  'eventTaxonKey',
];

export default { filters, included: filters, highlighted };