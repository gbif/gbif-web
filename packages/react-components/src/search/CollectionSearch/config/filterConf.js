export const filters = [
  'q', 'institutionKeySingle', 'code', 'countryGrSciColl', 'city', 
  'personalCollection', 'active', 'numberSpecimens', 'specimensInGbif',
  'name', 'alternativeCode', 'collectionContentType', 'preservationType',
  'taxonKeyGrSciColl', 'typeStatus',
  'collectionDescriptorCountry', 'recordedByFreeText'
].sort();

const highlighted = [
  'q', 'code', 'countryGrSciColl', 'numberSpecimens', 'specimensInGbif', 'taxonKeyGrSciColl', 'collectionDescriptorCountry'
];

export default { filters, included: filters, highlighted };