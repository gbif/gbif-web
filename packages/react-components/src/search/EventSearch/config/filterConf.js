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
  'eventTaxonomy'
].sort();

const highlighted = [
  // 'q',
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'eventId',
  'year',
  'eventStateProvince',
  'occurrenceCount',
  'eventTaxonomy'
];

export default { filters, included: filters, highlighted };