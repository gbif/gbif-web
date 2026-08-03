import { ProgrammePageFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { useLoaderData, useLocation } from 'react-router-dom';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { FundingBanner } from '../components/fundingBanner';
import { BlockItem } from '../composition/blockItem';
import {
  createResourceLoaderWithRedirect,
  ResourceLoaderResult,
} from '../createResourceLoaderWithRedirect';
import { useNotifyOfPartialDataIfErrors } from '@/routes/rootErrorPage';
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
  const { data, errors } = useLoaderData() as ResourceLoaderResult<ProgrammePageFragment>;
  useNotifyOfPartialDataIfErrors(errors);
  const { resource } = data;
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
