export const filters = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'city', 'personalCollection', 'active', 'numberSpecimens', 'specimensInGbif'
].sort();

const highlighted = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'city', 'active'
];

export default { filters, included: filters, highlighted };