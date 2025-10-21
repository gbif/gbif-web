import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  node: 'http://localhost:9200',
});

const INDEX_NAME = 'filter_values';
// const EMBEDDING_SERVICE_URL = 'http://localhost:5001';

// Helper function to get embedding
// export async function getEmbedding(text) {
//   const response = await fetch(`${EMBEDDING_SERVICE_URL}/embed`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ text: text }),
//   });

//   if (!response.ok) {
//     throw new Error(`Embedding service error: ${response.status}`);
//   }

//   const data = await response.json();
//   return data.vector;
// }

export async function suggest({ q, limit = 10 }) {
  if (!q) {
    throw new Error('No q param provided');
  }

  // const queryVector = await getEmbedding(q);

  const result = await esClient.search({
    index: INDEX_NAME,
    body: {
      size: limit,
      query: {
        bool: {
          should: [
            {
              match: {
                'name.keyword': {
                  query: q,
                  fuzziness: 'AUTO',
                  boost: 20.0,
                },
              },
            },
            {
              match: {
                'alternativeNames.keyword': {
                  query: q,
                  fuzziness: 'AUTO',
                  boost: 10.0,
                },
              },
            },
            {
              term: {
                'alternativeNames.keyword': {
                  value: q,
                  boost: 100.0,
                  case_insensitive: true,
                },
              },
            },
            {
              term: {
                'name.keyword': {
                  value: q,
                  boost: 200.0,
                  case_insensitive: true,
                },
              },
            },
            {
              multi_match: {
                boost: 1.0,
                query: q,
                fields: ['name^2', 'alternativeNames'],
                fuzziness: '1',
                type: 'best_fields',
                max_expansions: 10,
                operator: 'and',
              },
            },
          ],
        },
      },
      // knn: {
      //   field: 'nameVector',
      //   query_vector: queryVector,
      //   num_candidates: 100,
      //   k: limit,
      // },
    },
  });

  const hits = result.hits.hits.map((hit) => ({
    id: hit._id,
    score: hit._score,
    ...hit._source,
  }));

  return {
    total: result.hits.total.value,
    results: hits,
  };
}

suggest({ q: 'danmark', limit: 1 })
  .then((res) => console.log(res))
  .catch((err) => console.error(err));
