export const filters = [
  'q', 'institutionKeySingle', 'code', 'countryGrSciColl', 'city', 
  'personalCollection', 'active', 'numberSpecimens', 'specimensInGbif',
  'name', 'alternativeCode', 'collectionContentType', 'preservationType',
  'taxonKey', 'recordedBy', 'typeStatus',
  'countriesOfCoverage', 
].sort();

const highlighted = [
  'q', 'institutionKeySingle', 'code', 'countryGrSciColl', 'numberSpecimens', 'specimensInGbif'
];

export default { filters, included: filters, highlighted };