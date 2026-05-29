import { ApolloServer, BaseContext } from '@apollo/server';
import config from '@/config';
import createContext from '@/createContext';

const ENDPOINTS = {
  speciesMatch: `${config.apiv2}/species/match`,
  capabilities: `${config.apiv2}/map/occurrence/density/capabilities.json`,
  occurrence: `${config.apiv1}/occurrence/search`,
} as const;

const TAXON_QUERY = `
  query($datasetKey: ID, $taxonKey: ID!) {
    taxon(datasetKey: $datasetKey, key: $taxonKey) {
      taxonID
      label
      datasetKey
      scientificName
      taxonRank
      taxonomicStatus
      parentTree {
        scientificName
        taxonID
      }
      mapCapabilities {
        total
      }
      acceptedTaxon {
        taxonID
        label
        datasetKey
        scientificName
        taxonRank
        taxonomicStatus
        parentTree {
          scientificName
          taxonID
        }
        mapCapabilities {
          total
        }
      }
    }
  }
`;

export default async function searchTaxa({
  query,
  server,
  languageCode = 'eng',
  checklistKey,
}: {
  query: string;
  languageCode?: string;
  server: ApolloServer<BaseContext>;
  checklistKey?: string;
}) {
  const resolvedChecklistKey = checklistKey ?? config.defaultChecklist;
  const candidates = await getTaxonCandidates(query, resolvedChecklistKey);

  // for each candidate we should get taxon details using graphql and do a capabilities request
  const detailsPromises = candidates.map((c) =>
    getTaxonDetails(c.usage.key, languageCode, server, resolvedChecklistKey),
  );
  const details = await Promise.all(detailsPromises);
  return details.sort((a, b) => {
    // sort by map capabilities total descending
    return (b?.mapCapabilities?.total || 0) - (a?.mapCapabilities?.total || 0);
  });
}

async function getTaxonCandidates(
  query: string,
  checklistKey: string,
): Promise<{ usage: { key: string } }[]> {
  try {
    // uppercase the first letter as scientific names have that
    const formattedQuery = query.charAt(0).toUpperCase() + query.slice(1);
    const matchResponse = await fetch(
      `${ENDPOINTS.speciesMatch}?scientificName=${encodeURIComponent(
        formattedQuery,
      )}&verbose=true&checklistKey=${checklistKey}`,
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
  server: ApolloServer<BaseContext>,
  checklistKey: string,
) {
  const variables = { taxonKey, datasetKey: checklistKey };
  // Apollo Server 4+ no longer runs the context function for executeOperation,
  // so we build a context (with initialized data sources) explicitly and pass it
  // as contextValue. The result shape also changed: data now lives under
  // body.singleResult instead of directly on the response.
  const contextValue = createContext({
    user: undefined,
    abortController: new AbortController(),
    userAgent: 'GBIF_GRAPHQL_API',
    referer: null,
    locale: 'en-GB',
    preview: false,
  });
  return server
    .executeOperation(
      {
        query: TAXON_QUERY,
        variables,
      },
      { contextValue },
    )
    .then((response) => {
      if (response.body.kind === 'single') {
        // data is typed as Record<string, unknown>; the previous apollo-server v3
        // executeOperation returned `any`, so we keep that loose typing here.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (response.body.singleResult.data as any)?.taxon;
      }
      return undefined;
    });
}
