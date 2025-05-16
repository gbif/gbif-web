export default async function getTaxonVernacularNames({
  taxonKey,
  limit,
  offset,
  language,
  checklistKey,
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
  // first get the checklistKey in checklistBank using the math/metadata API
  const metadata = await dataSources.taxonAPI.getChecklistMetadata({
    checklistKey,
  });
  const checklistBankKey = metadata.mainIndex.datasetKey;
  // now get the vernacular names from the checklistBank
  // https://api.checklistbank.org/dataset/53147/vernacular?q=sommerfugl&language=dan
  const vernacularUrl = `https://api.checklistbank.org/dataset/${checklistBankKey}/taxon/${encodeURIComponent(
    taxonKey,
  )}/vernacular?${stringify({ q, lang, limit })}`;
  const vernacularResponse = await axios.get(vernacularUrl); // returns {offset, limi, total, results: [{name, language, taxonID}]}
  return vernacularResponse.data;
}
