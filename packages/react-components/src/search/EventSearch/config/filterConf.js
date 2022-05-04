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
  'occurrenceCount',
  'eventTaxonomy',
  'eventType',
].sort();

const highlighted = [
  // 'q',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'eventId',
  'year',
  'eventStateProvince',
  'occurrenceCount',
  'eventTaxonomy',
  'eventType',
];

export default { filters, included: filters, highlighted };