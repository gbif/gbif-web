export const filters = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'city', 'active'
].sort();

const highlighted = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'city', 'active'
];

export default { filters, included: filters, highlighted };