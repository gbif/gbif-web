import { ProgrammePageFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { useLoaderData, useLocation } from 'react-router-dom';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { FundingBanner } from '../components/fundingBanner';
import { BlockItem } from '../composition/blockItem';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import PageMetaData from '@/components/PageMetaData';

export const ProgrammePageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment ProgrammePage on Programme {
    title
    excerpt
    blocks {
      ...BlockItemDetails
    }
    ...ProgrammeFundingBanner
  }
`);

export const programmePageLoader = createResourceLoaderWithRedirect({
  fragment: 'ProgrammePage',
  resourceType: 'Programme',
});

export function ProgrammePage() {
  const { resource } = useLoaderData() as { resource: ProgrammePageFragment };
  const location = useLocation();

  return (
    <article>
      <PageMetaData
        title={resource.title}
        description={resource.excerpt}
        path={location.pathname}
      />

      {resource.blocks?.map((block, idx) => (
        <BlockItem
          resource={block}
          key={idx}
          resourceType="programme"
          resourceLink="/resource/search?contentType=programme"
        />
      ))}

      <FundingBanner resource={resource} />
    </article>
  );
}
