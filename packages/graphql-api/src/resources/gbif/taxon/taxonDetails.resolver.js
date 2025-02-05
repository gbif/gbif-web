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
    references: taxonDetails('references'),
    speciesProfiles: taxonDetails('speciesProfiles'),
    vernacularNames: (
      parent,
      { limit = 10, offset = 0, language, source },
      { dataSources },
    ) => {
      // if the language parameter is present, then we need to fetch all the data and then manually filter it for the language, and the apply limit and offset
      const newQuery = { limit, offset, language, source }; // language and source are ignored by the API
      if (language || source) {
        newQuery.limit = 1000;
        newQuery.offset = 0;
      }
      return dataSources.taxonAPI
        .getTaxonDetails({
          key: parent.key,
          resource: 'vernacularNames',
          query: newQuery,
        })
        .then((response) => {
          let apiResponse = response;
          if (language) {
            const filtered = response.results.filter(
              (item) => item.language === language,
            );
            // count how frequent each vernacularName is used
            const counts = filtered.reduce((acc, item) => {
              acc[item.vernacularName] = (acc[item.vernacularName] || 0) + 1;
              return acc;
            }, {});
            // sort the list by the frequency of the vernacularName, this is simply to avoid the odd outliers that occasionally appear since it is a list stiched together from multiple sources
            filtered.sort(
              (a, b) => counts[b.vernacularName] - counts[a.vernacularName],
            );

            const endOfRecords = offset + limit > filtered.length;
            apiResponse = {
              ...apiResponse,
              endOfRecords,
              results: filtered,
            };
          }
          if (source) {
            const filtered = apiResponse.results.filter(
              (item) => item.source === source,
            );
            const endOfRecords = offset + limit > filtered.length;
            apiResponse = {
              ...apiResponse,
              endOfRecords,
              results: filtered,
            };
          }
          return {
            ...apiResponse,
            results: apiResponse.results.slice(offset, offset + limit),
          };
        });
    },
    typeSpecimens: taxonDetails('typeSpecimens'),
    iucnRedListCategory: taxonDetails('iucnRedListCategory'),
  },
  TaxonVernacularName: {
    sourceTaxon: (parent, args, { dataSources }) =>
      dataSources.taxonAPI.getTaxonByKey({ key: parent.sourceTaxonKey }),
  },
};
