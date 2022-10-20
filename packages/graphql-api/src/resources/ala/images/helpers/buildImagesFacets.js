const imageFacetNames = [
  'dataResourceUid',
  'dateUploadedYearMonth',
  'format',
  'imageSize',
  // 'creator.keyword',
  'fileType',
  'recognisedLicence',
];

// Transform KVPs to objects,
// i.e. { foo: 123 } => { key: 'foo', count: 123 }
const getFacets = (obj) =>
  Object.entries(obj).map(([key, count]) => ({ key, count }));

// Dynamically generates resolvers from the array of image facet names
export default imageFacetNames.reduce((prev, facet) => {
  return {
    ...prev,
    [facet]: async (parent, { full }, { dataSources }) => {
      // Optionally append the filter query parameter if it exists
      const params = { search: parent._q };
      if (parent._fq) params.filters = parent._fq;

      return getFacets(
        (!full
          ? parent
          : await dataSources.imagesAPI.searchFacet(facet, params))[facet],
      );
    },
  };
}, {});
