export const filters = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'city', 
  'personalCollection', 'active', 'numberSpecimens', 'specimensInGbif',
  'name', 'alternativeCode', 'identifier', 'collectionContentType', 'preservationType'
].sort();

const highlighted = [
  'q', 'institutionKeySingle', 'code', 'countrySingleGrSciColl', 'numberSpecimens', 'specimensInGbif'
];

export default { filters, included: filters, highlighted };