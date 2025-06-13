export default function getVernacularNames({
  taxonKey,
  limit,
  offset,
  language,
  checklistKey = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  dataSources,
  removeDuplicates = false,
}) {
  // if the language parameter is present, then we need to fetch all the data and then manually filter it for the language, and the apply limit and offset
  const newQuery = {
    limit,
    offset,
    language,
    checklistKey,
  }; // language and source are ignored by the API
  if (language || checklistKey) {
    newQuery.limit = 1000;
    newQuery.offset = 0;
  }
  return dataSources.taxonAPI
    .getTaxonDetails({
      key: taxonKey,
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
      if (removeDuplicates) {
        const filtered = apiResponse.results.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t.vernacularName === item.vernacularName),
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
}
