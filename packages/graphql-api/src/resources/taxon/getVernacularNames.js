export default function getVernacularNames({
  taxonKey,
  limit,
  offset,
  language,
  checklistKey = 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  dataSources,
  removeDuplicates = false,
}) {
  if (language) {
    newQuery.limit = 1000;
    newQuery.offset = 0;
  }
  return dataSources.taxonAPI
    .getTaxonInfo({
      key: taxonKey,
      datasetKey: checklistKey,
    })
    .then((response) => {
      let apiResponse = response;
      if (language) {
        const filtered = response.vernacularNames.filter(
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

export function getOneVernacularName({ data, language }) {
  /* data has the form:
  {
    "vernacularName": "Silver Fir",
    "language": "dan",
  }
  */
  // the function should return the vernacularName if the language matches, otherwise it should return null
  // it should return the most frequent entry for that language
  // It should choose the most frequent occuring vernacularName if there are multiple with the same language.
  if (!data || !data.results) return null;
  const filtered = data.results.filter((item) => item.language === language);
  if (filtered.length === 0) return null;
  // count how frequent each vernacularName is used
  const counts = filtered.reduce((acc, item) => {
    acc[item.vernacularName] = (acc[item.vernacularName] || 0) + 1;
    return acc;
  }, {});
  // sort the list by the frequency of the vernacularName, this is simply to avoid the odd outliers that occasionally appear since it is a list stiched together from multiple sources
  filtered.sort((a, b) => counts[b.vernacularName] - counts[a.vernacularName]);
  return filtered[0];
}
