export const filters = [
  'active', 'name', 'q', 'code', 'countryGrSciColl', 'city', 'numberSpecimens', 
  'specimensInGbif', 'alternativeCode', 'institutionType', 'discipline'
];

const highlighted = [
  'q', 'code', 'countryGrSciColl', 'numberSpecimens', 'specimensInGbif'
];

export default { filters, included: filters, highlighted };