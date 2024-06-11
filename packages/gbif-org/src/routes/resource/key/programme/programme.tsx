import { Helmet } from 'react-helmet-async';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { BlockItem } from '../composition/blockItem';
import { useLoaderData } from 'react-router-dom';
import { FundingBanner } from '../components/fundingBanner';
import { fragmentManager } from '@/services/fragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { ProgrammePageFragment } from '@/gql/graphql';
import { ArticleOpenGraph } from '../components/articleOpenGraph';

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
