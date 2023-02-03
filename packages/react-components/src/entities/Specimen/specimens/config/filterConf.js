export const filters = [
  'eventSamplingProtocol',
  'measurementOrFactTypes',
  'year',
  'month',
  'eventId',
  'taxonKey',
].sort();

const highlighted = ['taxonKey', 'month', 'year', 'measurementOrFactTypes'];

export default { filters, included: filters, highlighted };
