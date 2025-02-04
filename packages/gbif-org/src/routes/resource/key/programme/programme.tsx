import { ProgrammePageFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { FundingBanner } from '../components/fundingBanner';
import { BlockItem } from '../composition/blockItem';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';

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
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      {resource.blocks?.map((block, idx) => (
        <BlockItem resource={block} key={idx} resourceType="programme" />
      ))}

      <FundingBanner resource={resource} />
    </article>
  );
}
