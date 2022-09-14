export const filters = [
  'active', 'name', 'q', 'code', 'country', 'city', 'numberSpecimens'
];

const highlighted = [
  'q', 'code', 'country', 'city'
];

export default { filters, included: filters, highlighted };