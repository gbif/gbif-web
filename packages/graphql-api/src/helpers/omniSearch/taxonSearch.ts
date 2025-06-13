import config from '#/config';
import { ApolloServer, ExpressContext } from 'apollo-server-express';

const ENDPOINTS = {
  speciesMatch: 'https://api.gbif.org/v1/species/match',
  capabilities: `${config.apiv2}/map/occurrence/density/capabilities.json`,
  occurrence: 'https://api.gbif.org/v1/occurrence/search',
} as const;

const ARTICLE_QUERY = `
query TaxonSearch(
  $taxonKey: ID!
  $languageCode: String = "eng"
) {
  taxon(key: $taxonKey) {
    ...TaxonResult
    acceptedTaxon {
      ...TaxonResult
    }
  }
}

fragment TaxonResult on Taxon {
  key
  nubKey
  scientificName
  canonicalName
  formattedName(useFallback: true)
  kingdom
  phylum
  class
  order
  family
  genus
  rank
  taxonomicStatus
  mapCapabilities {
    total
  }
  parents {
    key
    name: canonicalName
    rank
  }
  accepted
  acceptedKey
  numDescendants
  vernacularNames(limit: 1, language: $languageCode) {
    results {
      vernacularName
      source
      sourceTaxonKey
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
    getTaxonDetails(c.usageKey, languageCode, server).then(
      ([taxon, capabilities]) => ({
        taxon: taxon?.data?.taxon,
        capabilities,
        hasOccurrences: capabilities.total > 0,
        occurrenceCount: null,
      }),
    ),
  );
  const details = await Promise.all(detailsPromises);

  // check the capabilities. if the total is 0, then do an extra call to check the occurrence index
  const results = await Promise.all(
    details.map(async (d) => {
      if (d.capabilities.total > 0) {
        return d;
      }
      const occurrences = await fetch(
        `${ENDPOINTS.occurrence}?taxonKey=${d.taxon.key}&limit=0`,
      ).then((r) => r.json());
      return {
        ...d,
        hasOccurrences: occurrences.count > 0,
        occurrenceCount: occurrences.count,
      };
    }),
  );

  return results;
}

async function getTaxonCandidates(query: string) {
  try {
    const matchResponse = await fetch(
      `${ENDPOINTS.speciesMatch}?name=${encodeURIComponent(
        query,
      )}&verbose=true`,
    ).then((r) => r.json());

    // decide which entries are close enough.
    // if only one match and it is a match with confidence > 90% AND is status is either accepted or a synonym then use it.
    // if there is more than one match, then look at the first one. If it is a match with confidence > 90% AND is status is either accepted or a synonym then use it.
    // if the second match has same confidence score and is accepted, then include it as well.

    const candidates = [];
    // single response
    if (
      matchResponse?.usageKey &&
      matchResponse.confidence > 90 &&
      (['ACCEPTED', 'SYNONYM'].includes(matchResponse.status) ||
        matchResponse.matchType === 'EXACT')
    ) {
      candidates.push({ ...matchResponse, alternatives: undefined });
    } else if (matchResponse.alternatives) {
      const first = matchResponse.alternatives[0];
      if (
        first.confidence > 90 &&
        ['ACCEPTED', 'SYNONYM'].includes(first.status)
      ) {
        candidates.push(first);
      }
      if (
        matchResponse.alternatives[1]?.confidence >= first.confidence &&
        matchResponse.alternatives[1]?.status === 'ACCEPTED'
      ) {
        candidates.push(matchResponse.alternatives[1]);
      }
    }
    return candidates;
  } catch (e) {
    console.error('Error fetching species match', e);
    return [];
  }
}

async function getTaxonDetails(
  taxonKey: number,
  languageCode: string,
  server: ApolloServer<ExpressContext>,
) {
  const taxonPromise = server.executeOperation({
    query: ARTICLE_QUERY,
    variables: { taxonKey, languageCode },
  });

  const capabilitiesPromise = fetch(
    `${ENDPOINTS.capabilities}?taxonKey=${taxonKey}`,
  ).then((r) => r.json());

  return Promise.all([taxonPromise, capabilitiesPromise]);
}
