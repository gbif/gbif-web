import { NotFoundError, NotFoundLoaderResponse } from '@/errors';
import {
  AliasHandlingQuery,
  AliasHandlingQueryVariables,
  ArticlePageFragment,
  CompositionPageFragment,
} from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { useLoaderData } from 'react-router-dom';
import { ArticlePage, articlePageLoader } from './article/article';
import { ArticleSkeleton } from './components/articleSkeleton';
import { CompositionPage, compositionPageLoader } from './composition/composition';

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

  const alias = params['*'];

  const response = await graphql.query<AliasHandlingQuery, AliasHandlingQueryVariables>(
    ALIAS_HANDLING_FRAGMENT,
    { alias: `/${alias}` }
  );

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['resource'],
    errors,
    requiredObjects: [data?.resource],
  });

  if ('urlAlias' in data?.resource) {
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
      throw new NotFoundLoaderResponse();
    }

    return loader({ ...args, params: { key: resource.id } });
  }

  throw new NotFoundLoaderResponse();
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

  throw new NotFoundError();
}
