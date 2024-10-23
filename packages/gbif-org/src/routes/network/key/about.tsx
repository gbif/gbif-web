import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { fragmentManager } from '@/services/fragmentManager';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useNetworkKeyLoaderData } from '.';

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
  const { data } = useNetworkKeyLoaderData();

  const { network } = data;
  if (!network) return null;

  return (
    <ArticleContainer className="g-pt-0 md:g-pt-0 lg:g-pt-0">
      <ArticleBanner
        testId="network-banner"
        className="g-mt-8 g-mb-6"
        image={network.prose?.primaryImage}
      />

      <ArticleTextContainer>
        {network.prose?.body && (
          <ArticleBody dangerouslySetBody={{ __html: network.prose?.body }} className="g-mt-2" />
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

export const NetworkKeyAboutSkeleton = ArticleSkeleton;
