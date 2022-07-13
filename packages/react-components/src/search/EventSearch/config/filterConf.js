export const filters = [
  'eventSamplingProtocol',
  'country',
  'eventDatasetKey',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince',
  'eventID',
  'eventTaxonomy',
  'eventType',
].sort();

const highlighted = [
  'eventDatasetKey',
  'eventType',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince'
];

export default { filters, included: filters, highlighted };