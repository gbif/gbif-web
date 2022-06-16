export const filters = [
  'q',
  'eventSamplingProtocol',
  'country',
  'datasetKey',
  'measurementOrFactTypes',
  'measurementOrFactCount',
  'year',
  'eventStateProvince',
  'eventID',
  'occurrenceCount',
  'eventTaxonomy',
  'eventType',
].sort();

const highlighted = [
  // 'q',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'eventID',
  'year',
  'eventStateProvince',
  'occurrenceCount',
  'eventTaxonomy',
  'eventType',
];

export default { filters, included: filters, highlighted };