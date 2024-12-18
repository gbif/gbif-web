import { CompositionPageFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { BlockItem } from './blockItem';

export const CompositionPageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment CompositionPage on Composition {
    id
    maybeTitle: title
    summary
    excerpt
    blocks {
      ...BlockItemDetails
    }
  }
`);

export const compositionPageLoader = createResourceLoaderWithRedirect({
  fragment: 'CompositionPage',
  resourceType: 'Composition',
});

export function CompositionPage() {
  const { resource } = useLoaderData() as { resource: CompositionPageFragment };

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.maybeTitle}</title>
      </Helmet>

      {resource.blocks?.map((block) => <BlockItem resource={block} key={block.id} />)}
    </article>
  );
}
