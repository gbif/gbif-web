import config from '#/config';
import axios from 'axios';
import { uniqBy } from 'lodash';
import { matchSorter } from 'match-sorter';
import { stringify } from 'qs';

export default async function colSuggest({
  q,
  checklistKey = config.defaultChecklist,
  language = 'eng',
  limit = 20,
  taxonScope = [],
}) {
  const itemsToGet = taxonScope.length > 0 ? 100 : limit;

  // https://api.checklistbank.org/dataset/2011/nameusage/suggest?status=ACCEPTED&status=PROVISIONALLY_ACCEPTED&status=SYNONYM&status=AMBIGUOUS_SYNONYM&status=MISAPPLIED&q=gadu&limit=20
  if (Math.random() < 2) {
    const url = `https://api.checklistbank.org/dataset/2011/nameusage/suggest?status=ACCEPTED&status=PROVISIONALLY_ACCEPTED&status=SYNONYM&status=AMBIGUOUS_SYNONYM&status=MISAPPLIED&${stringify(
      { q, limit: itemsToGet },
    )}`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'GBIF-API',
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  // https://api.checklistbank.org/dataset/53147/nameusage/suggest?q=Animalia
  const url = `https://api.checklistbank.org/dataset/${checklistKey}/nameusage/suggest?${stringify(
    { q, limit: itemsToGet },
  )}`;
  const nameResponse = axios.get(url);

  // https://api.checklistbank.org/dataset/53147/vernacular?q=sommerfugl&language=dan
  const vernacularUrl = `https://api.checklistbank.org/dataset/${checklistKey}/vernacular?${stringify(
    { q, language, limit: itemsToGet },
  )}`;
  const vernacularResponse = axios.get(vernacularUrl); // return {suggestions: [...]}

  // once we have the nameResponse, then add the acceptedKey to each result if acceptedUsageId differs from usageId
  const nameSuggestions = nameResponse.then((response) => {
    const suggestions = (response.data.suggestions ?? []).filter(
      (s) => s.acceptedUsageId ?? s.usageId, // this is done to remove "bare names" which CLB API returns. They do not have any usageID
    );
    // get full taxon from https://api.checklistbank.org/dataset/53147/taxon/{usageId}
    const taxonPromises = suggestions.map((s) =>
      axios.get(
        `https://api.checklistbank.org/dataset/${checklistKey}/taxon/${
          s.acceptedUsageId ?? s.usageId
        }`,
      ),
    );
    const taxonClassificationPromises = suggestions.map((s) =>
      axios.get(
        `https://api.checklistbank.org/dataset/${checklistKey}/taxon/${
          s.acceptedUsageId ?? s.usageId
        }/classification`,
      ),
    );
    // once we have those then enrich the suggestions with the full taxon and classification
    Promise.all(taxonPromises).then((taxonResponses) => {
      suggestions.forEach((s, i) => {
        s.taxon = taxonResponses[i].data;
      });
    });
    Promise.all(taxonClassificationPromises).then((taxonResponses) => {
      suggestions.forEach((s, i) => {
        s.taxonClassification = taxonResponses[i].data.reverse();
      });
    });

    return Promise.all([...taxonPromises, ...taxonClassificationPromises]).then(
      () => {
        // map suggestions to a more useful format
        return suggestions.map((s) => {
          // we need matchedName, acceptedKey, acceptedName as html, acceptedName as plain text, classification (text and key)
          const result = {
            key: s.acceptedUsageId ?? s.usageId,
            taxon: s.taxon,
            taxonomicStatus: s.taxon.status,
            scientificName: s.taxon.label,
            labelHtml: s.taxon.labelHtml,
            canonicalName: s.taxon.name.scientificName,
            classification: s.taxonClassification,
          };
          if (s.acceptedUsageId) {
            result.acceptedNameOf = s.match;
          }
          return result;
        });
      },
    );
  });

  // once we have the vernacular names, then we need to get the taxon information from via the taxonID field
  const vernacularNames = vernacularResponse.then((response) => {
    const suggestions = (response.data.result ?? []).filter((s) => s.taxonID);

    const taxonPromises = suggestions.map((s) =>
      axios.get(
        `https://api.checklistbank.org/dataset/${checklistKey}/taxon/${s.taxonID}`,
      ),
    );
    const taxonClassificationPromises = suggestions.map((s) =>
      axios.get(
        `https://api.checklistbank.org/dataset/${checklistKey}/taxon/${s.taxonID}/classification`,
      ),
    );
    Promise.all(taxonPromises).then((taxonResponses) => {
      suggestions.forEach((s, i) => {
        s.taxon = taxonResponses[i].data;
      });
    });
    Promise.all(taxonClassificationPromises).then((taxonResponses) => {
      suggestions.forEach((s, i) => {
        s.taxonClassification = taxonResponses[i].data.reverse();
      });
    });

    return Promise.all([...taxonPromises, ...taxonClassificationPromises]).then(
      () => {
        // map suggestions to a more useful format
        return suggestions.map((s) => {
          // we need matchedName, acceptedKey, acceptedName as html, acceptedName as plain text, classification (text and key)
          return {
            key: s.taxonID,
            vernacularName: s.name,
            taxonomicStatus: s.taxon.status,
            scientificName: s.taxon.label,
            labelHtml: s.taxon.labelHtml,
            canonicalName: s.taxon.name.scientificName,
            taxon: s.taxon,
            classification: s.taxonClassification.map((c) => ({
              ...c,
              key: c.id,
            })),
            rank: s?.taxon?.name?.rank,
          };
        });
      },
    );
  });

  // once we have both, then merge them and return the result
  const [list1, list2] = await Promise.all([nameSuggestions, vernacularNames]);
  const allSuggestions = [...list1, ...list2];
  const uniqueSuggestions = uniqBy(allSuggestions, 'key');
  return matchSorter(uniqueSuggestions, q, {
    keys: ['scientificName', 'vernacularName', 'acceptedNameOf'],
  }).slice(0, limit);
}
