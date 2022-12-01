export default ({ documents, aggregations }) =>
  aggregations.gbifClassification_acceptedUsage_key_facet.buckets.map(
    ({ key, doc_count: count }) => ({
      count,
      ...documents.results
        .map((result) => ({
          ...result,
          acceptedTaxonRank: result.gbifClassification.acceptedUsage.rank,
        }))
        .find((result) => result.acceptedTaxonKey === key),
    }),
  );
