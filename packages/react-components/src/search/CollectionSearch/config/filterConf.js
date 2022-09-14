export const filters = [
  'q', 'institutionKey', 'code', 'country', 'city', 'active', 'numberSpecimens'
].sort();

const highlighted = [
  'q', 'institutionKey', 'code', 'country', 'city', 'active'
];

export default { filters, included: filters, highlighted };