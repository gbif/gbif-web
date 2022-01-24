export const filters = [
  'q', 'institutionKey', 'city', 'country', 'code'
].sort();

const highlighted = [
  'q', 'institutionKey', 'city', 'country', 'code'
];

export default { filters, included: filters, highlighted };