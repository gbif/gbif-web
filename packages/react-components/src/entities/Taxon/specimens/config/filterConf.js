export const filters = [
  'eventSamplingProtocol',
  'country',
  'eventDatasetKey',
  'measurementOrFactTypes',
  'year',
  'month',
  'eventStateProvince',
  'eventId',
  'eventType',
  'locationId',
].sort();

const highlighted = [
  'eventId',
  'eventType',
  'eventDatasetKey',
  'eventType',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'year',
  'month',
  'eventStateProvince',
  'locationId',
];

export default { filters, included: filters, highlighted };
