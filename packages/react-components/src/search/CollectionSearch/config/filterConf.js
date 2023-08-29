export const filters = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'city', 'active', 'numberSpecimens', 'specimensInGbif'
].sort();

const highlighted = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'city', 'active', 'specimensInGbif'
];

export default { filters, included: filters, highlighted };