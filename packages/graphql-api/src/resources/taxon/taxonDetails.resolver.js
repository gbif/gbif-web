const optionalTaxonDetails = resource => {
  const details = taxonDetails(resource);
  return async (parent, args, context, info) => {
    try {
      const response = await details(parent, args, context, info);
      return response;
    } catch(err) {
      return null;
    }
  }
}
const taxonDetails = resource => (parent, query, { dataSources }) => {
  return dataSources.taxonAPI.getTaxonDetails({
    key: parent.key, 
    resource: resource, 
    query
  })
}

/** 
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
*/
module.exports = {
  Taxon: {
    children: taxonDetails('children'),
    parents: taxonDetails('parents'),
    related: taxonDetails('related'),
    synonyms: taxonDetails('synonyms'),
    verbatim: optionalTaxonDetails('verbatim'),
    media: taxonDetails('media'),
    name: taxonDetails('name'),
    descriptions: taxonDetails('descriptions'),
    distributions: taxonDetails('distributions'),
    references: taxonDetails('references'),
    speciesProfiles: taxonDetails('speciesProfiles'),
    vernacularNames: taxonDetails('vernacularNames'),
    typeSpecimens: taxonDetails('typeSpecimens'),
  }
};
