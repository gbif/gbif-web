export const filters = [
  'q',
  'eventSamplingProtocol',
  'country',
  'datasetKey',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince',
  'eventID',
  'eventTaxonomy',
  'eventType',
].sort();

const highlighted = [
  'datasetKey',
  'eventType',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'year',
  'eventStateProvince'
];

export default { filters, included: filters, highlighted };