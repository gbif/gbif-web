import { NetworkQuery } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { fragmentManager } from '@/services/fragmentManager';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';

fragmentManager.register(/* GraphQL */ `
  fragment NetworkAboutTab on NetworkProse {
    title
    summary
    excerpt
    body
    primaryImage {
      ...ArticleBanner
    }
    primaryLink {
      label
      url
    }
  }
`);

export function NetworkKeyAbout() {
  const { data } = useParentRouteLoaderData(RouteId.Network) as { data: NetworkQuery };

  const { network } = data;
  if (!network) return null;

  return (
    <ArticleContainer className="pt-0 md:pt-0">
      <ArticleBanner className="mt-8 mb-6" image={network.prose?.primaryImage} />

      <ArticleTextContainer>
        {network.prose?.body && (
          <ArticleBody dangerouslySetBody={{ __html: network.prose?.body }} className="mt-2" />
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

export const NetworkKeyAboutSkeleton = ArticleSkeleton;
