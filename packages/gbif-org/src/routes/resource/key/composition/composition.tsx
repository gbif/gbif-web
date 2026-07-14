import { CompositionPageFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { useLoaderData, useLocation } from 'react-router-dom';
import { ArticleSkeleton } from '../components/articleSkeleton';
import {
  createResourceLoaderWithRedirect,
  ResourceLoaderResult,
} from '../createResourceLoaderWithRedirect';
import { useNotifyOfPartialDataIfErrors } from '@/routes/rootErrorPage';
import { BlockItem } from './blockItem';
import PageMetaData from '@/components/PageMetaData';

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
  const { data, errors } = useLoaderData() as ResourceLoaderResult<CompositionPageFragment>;
  useNotifyOfPartialDataIfErrors(errors);
  const { resource } = data;
  const location = useLocation();

  return (
    <article>
      <PageMetaData
        title={resource.maybeTitle}
        description={resource.excerpt}
        path={location.pathname}
      />

      {resource.blocks?.map((block) => (
        <BlockItem resource={block} key={block.id} />
      ))}
    </article>
  );
}
