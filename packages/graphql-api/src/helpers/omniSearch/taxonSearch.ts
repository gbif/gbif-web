import { ApolloServer, ExpressContext } from 'apollo-server-express';
import config from '@/config';

const ENDPOINTS = {
  speciesMatch: 'https://api.gbif.org/v2/species/match',
  capabilities: `${config.apiv2}/map/occurrence/density/capabilities.json`,
  occurrence: 'https://api.gbif.org/v1/occurrence/search',
} as const;

const TAXON_QUERY = `
  query($datasetKey: ID, $taxonKey: ID!) {
    taxon(datasetKey: $datasetKey, key: $taxonKey) {
      taxonID
      datasetKey
      scientificName
      taxonRank
      taxonomicStatus
      label
      parentTree {
        taxonID
        scientificName
      }
      mapCapabilities {
        total
      }
    }
  }
`;

export default async function searchTaxa({
  query,
  server,
  languageCode = 'eng',
}: {
  query: string;
  languageCode?: string;
  server: ApolloServer<ExpressContext>;
}) {
  const candidates = await getTaxonCandidates(query);

  // for each candidate we should get taxon details using graphql and do a capabilities request
  const detailsPromises = candidates.map((c) =>
    getTaxonDetails(c.usage.key, languageCode, server),
  );
  const details = await Promise.all(detailsPromises);
  return details.sort((a, b) => {
    // sort by map capabilities total descending
    return (b?.mapCapabilities?.total || 0) - (a?.mapCapabilities?.total || 0);
  });
}

async function getTaxonCandidates(
  query: string,
): Promise<{ usage: { key: string } }[]> {
  try {
    // uppercase the first letter as scientific names have that
    const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
    const matchResponse = await fetch(
      `${ENDPOINTS.speciesMatch}?scientificName=${encodeURIComponent(
        formattedQuery,
      )}&verbose=true&checklistKey=${config.defaultChecklist}`,
    ).then((r) => r.json());

    // decide which entries are close enough.
    // if only one match and it is a match with confidence > 90% AND is status is either accepted or a synonym then use it.
    // if there is more than one match, then look at the first one. If it is a match with confidence > 90% AND is status is either accepted or a synonym then use it.
    // if the second match has same confidence score and is accepted, then include it as well.

    const candidates: any[] = [];
    // single response
    if (
      matchResponse?.usage &&
      matchResponse?.diagnostics?.confidence > 90 &&
      (['ACCEPTED', 'SYNONYM'].includes(matchResponse.usage.status) ||
        matchResponse.diagnostics.matchType === 'EXACT')
    ) {
      candidates.push({ ...matchResponse, alternatives: undefined });
    } else if (matchResponse?.diagnostics?.alternatives) {
      const first = matchResponse.diagnostics.alternatives[0];
      const second = matchResponse.diagnostics.alternatives[1];
      if (
        first.diagnostics.confidence > 90 &&
        ['ACCEPTED', 'SYNONYM'].includes(first.usage.status)
      ) {
        candidates.push(first);
      }
      if (
        second.diagnostics?.confidence > 90 &&
        second.diagnostics?.confidence >= first.diagnostics.confidence &&
        second?.usage?.status === 'ACCEPTED'
      ) {
        candidates.push(second);
      }
    }
    return candidates;
  } catch (e) {
    console.error('Error fetching species match', e);
    return [];
  }
}

async function getTaxonDetails(
  taxonKey: string,
  languageCode: string,
  server: ApolloServer<ExpressContext>,
) {
  const variables = { taxonKey, datasetKey: config.defaultChecklist };
  return server
    .executeOperation({
      query: TAXON_QUERY,
      variables,
    })
    .then((r) => {
      return r.data?.taxon;
    });
}
