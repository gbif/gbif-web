export const filters = [
  'active', 'name', 'q', 'code', 'countrySingleGrSciColl', 'city', 'numberSpecimens', 'specimensInGbif'
];

const highlighted = [
  'q', 'code', 'countrySingleGrSciColl', 'city', 'specimensInGbif'
];

export default { filters, included: filters, highlighted };