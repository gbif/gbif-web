export const filters = [
  'active', 'name', 'q', 'code', 'countrySingleGrSciColl', 'city', 'numberSpecimens'
];

const highlighted = [
  'q', 'code', 'countrySingleGrSciColl', 'city'
];

export default { filters, included: filters, highlighted };