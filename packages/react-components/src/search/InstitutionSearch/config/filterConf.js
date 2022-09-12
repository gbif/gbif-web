export const filters = [
  'active', 'name', 'q', 'code', 'country', 'city'
];

const highlighted = [
  'q', 'code', 'country', 'city'
];

export default { filters, included: filters, highlighted };