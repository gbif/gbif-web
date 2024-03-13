import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { BlockItem } from './BlockItem';
import { fragmentManager } from '@/services/FragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { CompositionPageFragment } from '@/gql/graphql';
import { ArticleOpenGraph } from '../components/ArticleOpenGraph';

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
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.maybeTitle}</title>
      </Helmet>

      {resource.blocks?.map((block) => (
        <BlockItem resource={block} key={block.id} />
      ))}
    </>
  );
}
