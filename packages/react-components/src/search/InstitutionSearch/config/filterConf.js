export const filters = [
  'q', 'code', 'city', 'country', 'name', 'active'
].sort();

const highlighted = [
  'q', 'code', 'city', 'country'
];

export default { filters, included: filters, highlighted };