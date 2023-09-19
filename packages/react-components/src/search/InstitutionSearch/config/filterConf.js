export const filters = [
  'active', 'name', 'q', 'code', 'countrySingleGrSciColl', 'city', 'numberSpecimens', 
  'specimensInGbif', 'alternativeCode', 'institutionType', 'discipline'
];

const highlighted = [
  'q', 'code', 'countrySingleGrSciColl', 'numberSpecimens', 'specimensInGbif'
];

export default { filters, included: filters, highlighted };