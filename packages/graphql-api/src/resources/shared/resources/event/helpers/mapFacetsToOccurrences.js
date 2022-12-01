const getTaxon = async ({ eventAPI, key }) => {
  const { results } = await eventAPI.searchOccurrenceDocuments({
    query: {
      gbifClassification_acceptedUsage_key: key,
    },
  });

  // Hoist the acceptedUsage rank into its own acceptedTaxonRank property
  return {
    ...results[0],
    acceptedTaxonRank: results[0].gbifClassification.acceptedUsage.rank,
  };
};

export default async ({ result, dataSources }) =>
  result.aggregations.gbifClassification_acceptedUsage_key_facet.buckets.map(
    async ({ key, doc_count: count }) => ({
      count,
      ...(await getTaxon({ eventAPI: dataSources.eventAPI, key })),
    }),
  );
