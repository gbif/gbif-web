// get quick suggestions from the occurrence index.
// get suggestions for recordedBy, catalogNumber, and other fields.
// if there is a perfect match, then show it as highlighted match along with the suggested query param

import config from '#/config';
import { normalizeString } from './countrySearch';
import { OMNI_SEARCH_TIMEOUT } from './omniSearch';

/*
edpoints to use. response is an array of strings
https://api.gbif.org/v1/occurrence/search/catalogNumber?limit=50&q=s
https://api.gbif.org/v1/occurrence/search/recordNumber?limit=50&q=d+065
https://api.gbif.org/v1/occurrence/search/recordedBy?limit=50&q=miller
*/
export default async function getOccurrenceMatches(query: string): Promise<{
  recordedBy?: string;
  catalogNumber?: string;
  recordNumber?: string;
}> {
  if (!query || query.length < 4) {
    return {
      recordedBy: undefined,
      catalogNumber: undefined,
      recordNumber: undefined,
    };
  }

  const results = await Promise.all([
    searchRecordedBy(query),
    searchCatalogNumber(query),
    searchRecordNumber(query),
  ]);
  const [recordedBy, catalogNumber, recordNumber] = results;
  const matches = {
    recordedBy,
    catalogNumber,
    recordNumber,
  };
  return matches;
}

async function searchRecordedBy(query: string): Promise<string | undefined> {
  return search(query, 'recordedBy');
}

async function searchCatalogNumber(query: string): Promise<string | undefined> {
  return search(query, 'catalogNumber');
}

async function searchRecordNumber(query: string): Promise<string | undefined> {
  return search(query, 'recordNumber');
}

async function search(
  query: string,
  field: string,
): Promise<string | undefined> {
  const controller = new AbortController();
  const { signal } = controller;
  setTimeout(() => controller.abort(), OMNI_SEARCH_TIMEOUT);

  const url = `${config.apiv1}/occurrence/search/${field}?limit=2&q=${query}`;
  try {
    const response = await fetch(url, { signal });
    if (response.ok) {
      return response.json().then((data) => filterResults(query, data));
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

function filterResults(query: string, results: string[]): string | undefined {
  return results.find(
    (result) => normalizeString(result) === normalizeString(query),
  );
}
