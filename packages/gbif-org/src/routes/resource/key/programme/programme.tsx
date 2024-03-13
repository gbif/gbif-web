import { Helmet } from 'react-helmet-async';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { BlockItem } from '../composition/BlockItem';
import { useLoaderData } from 'react-router-dom';
import { FundingBanner } from '../components/FundingBanner';
import { fragmentManager } from '@/services/FragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { ProgrammePageFragment } from '@/gql/graphql';
import { ArticleOpenGraph } from '../components/ArticleOpenGraph';

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

  return (
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      {resource.blocks?.map((block, idx) => (
        <BlockItem resource={block} key={idx} resourceType="programme" />
      ))}

      <FundingBanner resource={resource} />
    </>
  );
}
