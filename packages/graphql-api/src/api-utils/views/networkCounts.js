// function to get all organizations and count how many there are per country.
// and similar for collections per country
// the results should be cached since it requires multiple calls to get all the data
// and it's not expected to change often
// the cache should be invalidated every 1 hour, but refreshed only when the data is requested
// the cache can just be stored in memory
import staticDump from './networkCountsStaticData';

let organizationsPerCountry;
let collectionsPerCountry;

export default async function getNetworkCounts() {
  if (!organizationsPerCountry || !collectionsPerCountry) {
    return staticDump;
  }
  return { organizationsPerCountry, collectionsPerCountry };
}

async function refresh() {
  const organizations = await fetchAllGBIFOrganizations();
  const collections = await fetchAllGBIFCollections();
  organizationsPerCountry = countPublishersPerCountry(organizations);
  collectionsPerCountry = countCollectionsPerCountry(collections);
  return { organizationsPerCountry, collectionsPerCountry };
}
refresh();
setInterval(refresh, 1000 * 60 * 60);

async function fetchAll(baseUrl) {
  let offset = 0;
  const limit = 1000;
  let allOrganizations = [];
  let hasMore = true;

  while (hasMore) {
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(`${baseUrl}?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    // eslint-disable-next-line no-await-in-loop
    const data = await response.json();
    allOrganizations = allOrganizations.concat(data.results);

    if (data.results.length < limit) {
      hasMore = false;
    } else {
      offset += limit;
    }
  }

  return allOrganizations;
}

async function fetchAllGBIFOrganizations() {
  const baseUrl = 'https://api.gbif.org/v1/organization';
  return fetchAll(baseUrl).then((data) =>
    data.filter((item) => item.numPublishedDatasets > 0),
  );
}

async function fetchAllGBIFCollections() {
  const baseUrl = 'https://api.gbif.org/v1/grscicoll/collection';
  return fetchAll(baseUrl);
}

function countPublishersPerCountry(data) {
  return data.reduce((acc, item) => {
    const country = item?.country || 'Unknown';
    acc[country] = acc[country] ? acc[country] + 1 : 1;
    return acc;
  }, {});
}

function countCollectionsPerCountry(data) {
  return data.reduce((acc, item) => {
    const country =
      item.address?.country ?? item.mailingAddress?.country ?? 'zz'; // 'zz' is used for unknown countries
    acc[country] = acc[country] ? acc[country] + 1 : 1;
    return acc;
  }, {});
}
