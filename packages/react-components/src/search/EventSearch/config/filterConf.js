export const filters = [
  'q',
  'eventSamplingProtocol',
  'country',
  'datasetKey',
  'measurementOrFactTypes',
  'measurementOrFactCount',
  'year',
  'eventStateProvince',
  'eventId',
].sort();

const highlighted = [
  // 'q',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'eventId',
  'year',
  'eventStateProvince'
];

export default { filters, included: filters, highlighted };