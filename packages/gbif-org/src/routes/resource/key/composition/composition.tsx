import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { BlockItem } from './BlockItem';
import { fragmentManager } from '@/services/FragmentManager';
import { createResourceLoaderWithRedirect } from '../utils';
import { CompositionPageFragment } from '@/gql/graphql';

export const CompositionPageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment CompositionPage on Composition {
    id
    maybeTitle: title
    summary
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
      <Helmet>
        <title>{resource.maybeTitle}</title>
      </Helmet>
      {resource.blocks?.map((block) => (
        <BlockItem resource={block} key={block.id} />
      ))}
    </>
  );
}
