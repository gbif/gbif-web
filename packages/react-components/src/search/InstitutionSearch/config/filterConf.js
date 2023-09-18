export const filters = [
  'active', 'name', 'q', 'code', 'countrySingleGrSciColl', 'city', 'numberSpecimens', 'specimensInGbif', 'alternativeCode', 'identifier'
];

const highlighted = [
  'q', 'code', 'countrySingleGrSciColl', 'specimensInGbif', 'city'
];

export default { filters, included: filters, highlighted };