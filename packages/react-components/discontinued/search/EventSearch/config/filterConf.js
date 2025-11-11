export const filters = [
  'eventSamplingProtocol',
  'country',
  'eventDatasetKey',
  'measurementOrFactTypes',
  'year',
  'month',
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
  'month',
  'eventStateProvince',
  'locationId',
  'eventTaxonKey',
];

export default { filters, included: filters, highlighted };