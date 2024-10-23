import {
  AliasHandlingQuery,
  AliasHandlingQueryVariables,
  ArticlePageFragment,
  CompositionPageFragment,
} from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { required } from '@/utils/required';
import { ArticlePage, articlePageLoader } from './article/article';
import { CompositionPage, compositionPageLoader } from './composition/composition';
import { useLoaderData } from 'react-router-dom';
import { ArticleSkeleton } from './components/articleSkeleton';

export const AliasHandlingSkeleton = ArticleSkeleton;

const ALIAS_HANDLING_FRAGMENT = /* GraphQL */ `
  query AliasHandling($alias: String!) {
    resource(alias: $alias) {
      ...ResourceRedirectDetails
    }
  }
`;

export async function aliasHandlingLoader(args: LoaderArgs) {
  const { graphql, params } = args;

  const alias = required(params.alias, 'No alias provided');

  const response = await graphql.query<AliasHandlingQuery, AliasHandlingQueryVariables>(
    ALIAS_HANDLING_FRAGMENT,
    { alias: `/${alias}` }
  );

  const { data } = await response.json();

  if (data.resource == null) {
    throw new Error('404');
  }

  if ('urlAlias' in data.resource) {
    const resource = data.resource;

    const loader = (() => {
      switch (resource.__typename) {
        case 'Article':
          return articlePageLoader;
        case 'Composition':
          return compositionPageLoader;
      }
    })();

    if (typeof loader !== 'function') {
      console.error(`No loader found for resource type ${resource.__typename}`);
      throw new Error('404');
    }

    return loader({ ...args, params: { key: resource.id } });
  }

  throw new Error('404');
}

export function AliasHandling() {
  const { resource } = useLoaderData() as {
    resource: ArticlePageFragment | CompositionPageFragment;
  };

  switch (resource.__typename) {
    case 'Article':
      return <ArticlePage />;
    case 'Composition':
      return <CompositionPage />;
  }

  throw new Error('404');
}
