export const filters = [
  'q', 'institutionKey', 'city', 'country', 'code', 'active'
].sort();

const highlighted = [
  'q', 'institutionKey', 'city', 'country', 'code'
];

export default { filters, included: filters, highlighted };