import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import EmptyValue from '@/components/emptyValue';
import { fragmentManager } from '@/services/fragmentManager';
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
    <ArticleContainer>
      <ArticleBanner
        testId="network-banner"
        className="g-mt-8 g-mb-6"
        image={network.prose?.primaryImage}
      />

      <ArticleTextContainer>
        {network.prose?.body && (
          <ArticleBody dangerouslySetBody={{ __html: network.prose?.body }} />
        )}
        {!network.prose?.body && network.description && (
          <div className="g-prose g-max-w-none dark:g-prose-invert">{network.description}</div>
        )}
        {!network.prose?.body && !network.description && (
          <EmptyValue id="gbifNetwork.noDescriptionProvided" />
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

export const NetworkKeyAboutSkeleton = ArticleSkeleton;
