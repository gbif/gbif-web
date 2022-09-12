export const filters = [
  'q', 'institutionKey', 'code', 'country', 'city', 'active'
].sort();

const highlighted = [
  'q', 'institutionKey', 'code', 'country', 'city', 'active'
];

export default { filters, included: filters, highlighted };