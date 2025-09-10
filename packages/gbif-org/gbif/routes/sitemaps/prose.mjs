import { publicEnv } from '../../envConfig.mjs';
import { fetchWithRetry } from '../auth/utils.mjs';

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const typeNameToPath = {
  Composition: 'composition',
  News: 'news',
  Article: 'article',
  DataUse: 'data-use',
  MeetingEvent: 'event',
  GbifProject: 'project',
  Programme: 'programme',
  Tool: 'tool',
  Document: 'document',
  NetworkProse: 'network',
};

export const RESOURCE_SEARCH_QUERY = `

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
          ... on Composition {
            ...CompositionResult
          }
          ... on News {
            ...NewsResult
          }
          ... on Article {
            ...ArticleResult
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
          ... on Document {
            ...DocumentResult
          }
          ... on NetworkProse {
            ...NetworkProseResult
          }
        }
      }
    }
  }

  fragment CompositionResult on Composition {
    id
    title
    urlAlias
   
  }


  fragment NewsResult on News {
    id
    title
   
  }

  fragment ArticleResult on Article {
    id
    title
    urlAlias
   
  }

  fragment DataUseResult on DataUse {
    id
    title

  }

  fragment EventResult on MeetingEvent {
    id
    title

  }

  fragment ProjectResult on GbifProject {
    id
    title

  }

  fragment ProgrammeResult on Programme {
    id
    title
    
  }

  fragment ToolResult on Tool {
    id
    title
   
  }

  fragment DocumentResult on Document {
    id
    title
  }

  fragment NetworkProseResult on NetworkProse {
    id
    title
    
  }

`;

async function getAllProse() {
  const prose = await fetchWithRetry(publicEnv.PUBLIC_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: RESOURCE_SEARCH_QUERY,
      variables: {
        predicate: {
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
            'composition',
            'article',
            'network',
          ],
        },
        size: 10000,
        from: 0,
      },
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      return json.data.resourceSearch.documents.results?.map((e) => {
        if (e.urlAlias) {
          return { ...e, _url: e.urlAlias };
        } else {
          return {
            ...e,
            _url:
              '/' +
              (typeNameToPath?.[e.__typename] || e.__typename.toLowerCase()) +
              '/' +
              e.id +
              '/' +
              slugify(e.title),
          };
        }
      });
    });
  return prose;
}

export default {
  getAllProse,
};
