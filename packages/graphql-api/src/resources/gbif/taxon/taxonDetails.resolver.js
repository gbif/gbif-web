import getVernacularNames from './getVernacularNames';

const taxonDetails =
  (resource) =>
  (parent, query, { dataSources }) => {
    return dataSources.taxonAPI.getTaxonDetails({
      key: parent.key,
      resource,
      query,
    });
  };

const optionalTaxonDetails = (resource) => {
  const details = taxonDetails(resource);
  return async (parent, args, context, info) => {
    try {
      const response = await details(parent, args, context, info);
      return response;
    } catch (err) {
      return null;
    }
  };
};

/**
 * fieldName: (parent, args, context, info) => data;
 * parent: An object that contains the result returned from the resolver on the parent type
 * args: An object that contains the arguments passed to the field
 * context: An object shared by all resolvers in a GraphQL operation. We use the context to contain per-request state such as authentication information and access our data sources.
 * info: Information about the execution state of the operation which should only be used in advanced cases
 */
export default {
  Taxon: {
    children: taxonDetails('children'),
    parents: taxonDetails('parents'),
    related: taxonDetails('related'),
    synonyms: taxonDetails('synonyms'),
    combinations: taxonDetails('combinations'),
    verbatim: optionalTaxonDetails('verbatim'),
    media: taxonDetails('media'),
    name: taxonDetails('name'),
    descriptions: taxonDetails('descriptions'),
    distributions: taxonDetails('distributions'),
    reference: taxonDetails('references'),
    speciesProfiles: taxonDetails('speciesProfiles'),
    vernacularNames: (
      parent,
      { limit = 10, offset = 0, language, source },
      { dataSources },
    ) => {
      return getVernacularNames({
        taxonKey: parent.key,
        limit,
        offset,
        language,
        source,
        dataSources,
      });
    },
    typeSpecimens: taxonDetails('typeSpecimens'),
    iucnRedListCategory: optionalTaxonDetails('iucnRedListCategory'),
  },
  TaxonVernacularName: {
    sourceTaxon: (parent, args, { dataSources }) =>
      parent.sourceTaxonKey
        ? dataSources.taxonAPI.getTaxonByKey({ key: parent.sourceTaxonKey })
        : null,
  },
};
