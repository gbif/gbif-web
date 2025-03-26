import { ApolloServer, ExpressContext } from 'apollo-server-express';

const ENDPOINTS = {
  species: 'https://api.gbif.org/v1/species/search',
  speciesMatch: 'https://api.gbif.org/v1/species/match',
  dataset: 'https://api.gbif.org/v1/dataset/search',
  organization: 'https://api.gbif.org/v1/organization',
  article: 'https://hp-search.gbif.org/content',
  occurrence: 'https://api.gbif.org/v1/occurrence/search',
} as const;

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type:
    | 'occurrence'
    | 'species'
    | 'dataset'
    | 'publisher'
    | 'article'
    | 'species_match';
  thumbnail?: string;
  url: string;
  score?: number;
}

const ARTICLE_QUERY = `
query ResourceSearch(
  $from: Int
  $size: Int
  $predicate: Predicate
  $contentType: [ContentType!]
) {
  resourceSearch(predicate: $predicate, contentType: $contentType) {
    documents(from: $from, size: $size) {
      from
      size
      total
      results {
        __typename
        ... on News {
          ...NewsResult
        }
        ... on DataUse {
          ...DataUseResult
        }
        ... on MeetingEvent {
          ...EventResult
        }
        ... on GbifProject {
          ...ProjectResult
        }
        ... on Programme {
          ...ProgrammeResult
        }
        ... on Tool {
          ...ToolResult
        }
        ... on Document {
          ...DocumentResult
        }
      }
    }
  }
}

fragment NewsResult on News {
  id
  title
  excerpt
  primaryImage {
    ...ResultCardImage
  }
  createdAt
}

fragment ResultCardImage on AssetImage {
  file {
    url: thumbor(width: 180, height: 120)
  }
}

fragment DataUseResult on DataUse {
  id
  title
  excerpt
  primaryImage {
    ...ResultCardImage
  }
  createdAt
}

fragment EventResult on MeetingEvent {
  id
  title
  excerpt
  country
  location
  venue
  start
  end
  primaryLink {
    url
  }
  gbifsAttendee
  allDayEvent
}

fragment ProjectResult on GbifProject {
  id
  title
  excerpt
  primaryImage {
    ...ResultCardImage
  }
  createdAt
  programme {
    id
    title
  }
  purposes
}

fragment ProgrammeResult on Programme {
  id
  title
  excerpt
  primaryImage {
    ...ResultCardImage
  }
}

fragment ToolResult on Tool {
  id
  title
  excerpt
  primaryImage {
    ...ResultCardImage
  }
}

fragment DocumentResult on Document {
  id
  title
  excerpt
}
`;

export default async function searchAll({
  query,
  server,
}: {
  query: string;
  server: ApolloServer<ExpressContext>;
}) {
  if (!query || !query.trim()) {
    return {
      results: [],
      counts: {
        species: 0,
        occurrences: 0,
        datasets: 0,
        publishers: 0,
        articles: 0,
      },
    };
  }

  const [
    speciesMatch,
    species,
    datasets,
    publishers,
    articlesResponse,
    occurrences,
  ] = await Promise.all([
    fetch(`${ENDPOINTS.speciesMatch}?name=${encodeURIComponent(query)}`).then(
      (r) => r.json(),
    ),
    fetch(
      `${ENDPOINTS.species}?q=${encodeURIComponent(
        query,
      )}&limit=5&datasetKey=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c`,
    ).then((r) => r.json()),
    fetch(`${ENDPOINTS.dataset}?q=${encodeURIComponent(query)}&limit=5`).then(
      (r) => r.json(),
    ),
    fetch(
      `${ENDPOINTS.organization}?q=${encodeURIComponent(query)}&limit=5`,
    ).then((r) => r.json()),
    // fetch(`${ENDPOINTS.article}?size=5&q=${encodeURIComponent(query)}`).then(
    //   (r) => r.json(),
    // ),
    server.executeOperation({
      query: ARTICLE_QUERY,
      variables: {
        predicate: {
          type: 'and',
          predicates: [
            {
              type: 'in',
              key: 'contentType',
              values: [
                'news',
                'dataUse',
                'event',
                'project',
                'programme',
                'tool',
                'document',
              ],
            },
            {
              type: 'fuzzy',
              key: 'q',
              value: query,
            },
          ],
        },
        size: 20,
        from: 0,
      },
    }),
    fetch(
      `${ENDPOINTS.occurrence}?q=${encodeURIComponent(query)}&limit=0`,
    ).then((r) => r.json()),
  ]);

  const articles = articlesResponse?.data?.resourceSearch?.documents;
  console.log(
    JSON.stringify(
      articlesResponse?.data?.resourceSearch?.documents.results[0],
      null,
      2,
    ),
  );
  const results: SearchResult[] = [];

  // Add species match if found
  if (speciesMatch?.matchType && speciesMatch.matchType !== 'NONE') {
    results.push({
      id: `species-${speciesMatch.usageKey}`,
      type: 'species_match',
      title: speciesMatch.scientificName,
      description: `${speciesMatch?.rank?.toLowerCase()} in family ${
        speciesMatch.family
      } (${speciesMatch.kingdom})`,
      url: `https://www.gbif.org/species/${speciesMatch.usageKey}`,
    });
  }

  // Add keyword-matched articles first
  // const keywordArticles = articles?.results
  //   ? articles.results.filter((article: any) =>
  //       article.keywords?.some(
  //         (k: string) => k.toLowerCase() === query.toLowerCase(),
  //       ),
  //     )
  //   : [];

  // results.push(
  //   ...keywordArticles.map((article: any) => ({
  //     id: `article-${article.id}`,
  //     type: 'article',
  //     title:
  //       article.title?.['en-GB'] ||
  //       article.title?.en ||
  //       Object.values(article.title)[0],
  //     description:
  //       article.summary?.['en-GB'] ||
  //       article.summary?.en ||
  //       `${article.body?.['en-GB']?.substring(0, 150)}...` ||
  //       '',
  //     url: article.url,
  //     score: 100,
  //   })),
  // );

  // Add remaining results in fixed order
  const transformers = {
    species: (item: any) => ({
      id: `species-${item.key}`,
      type: 'species',
      title: item.scientificName,
      description: `${item?.rank?.toLowerCase()} in family ${item.family} (${
        item.kingdom
      })`,
      url: `https://www.gbif.org/species/${item.key}`,
    }),
    dataset: (item: any) => ({
      id: `dataset-${item.key}`,
      type: 'dataset',
      title: item.title,
      description: `${item.description?.substring(0, 150)}...`,
      url: `https://www.gbif.org/dataset/${item.key}`,
    }),
    publisher: (item: any) => ({
      id: `publisher-${item.key}`,
      type: 'publisher',
      title: item.title,
      description: `${item.description?.substring(0, 150)}...`,
      url: `https://www.gbif.org/publisher/${item.key}`,
    }),
    article: (article: any) => ({
      id: `article-${article.id}`,
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: article.url,
    }),
  };

  // Add remaining results in fixed order
  results.push(
    ...(species?.results || [])
      .filter(
        (item: any) => !results.some((r) => r.id === `species-${item.key}`),
      )
      .map(transformers.species),
    ...(datasets?.results || []).map(transformers.dataset),
    ...(publishers?.results || []).map(transformers.publisher),
    ...(articles?.results || [])
      .filter(
        (item: any) => !results.some((r) => r.id === `article-${item.id}`),
      )
      .map(transformers.article),
  );

  return {
    results,
    counts: {
      species: species?.count || 0,
      occurrence: occurrences?.count || 0,
      dataset: datasets?.count || 0,
      publisher: publishers?.count || 0,
      resource: articles?.total || 0,
    },
  };
}
