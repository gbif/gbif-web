import { DataUsePageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleBody } from '../components/articleBody';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticlePreTitle, PreTitleDate } from '../components/articlePreTitle';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleTags } from '../components/articleTags';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleTitle } from '../components/articleTitle';
import { PageContainer } from '../components/pageContainer';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { DynamicLink } from '@/reactRouterPlugins';

export const DataUsePageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment DataUsePage on DataUse {
    id
    title
    summary
    resourceUsed
    excerpt
    body
    primaryImage {
      ...ArticleBanner
    }
    primaryLink {
      label
      url
    }
    secondaryLinks {
      label
      url
    }
    countriesOfCoverage
    topics
    purposes
    audiences
    citation
    createdAt
  }
`);

export const dataUsePageLoader = createResourceLoaderWithRedirect({
  fragment: 'DataUsePage',
  resourceType: 'DataUse',
});

export function DataUsePage() {
  const { resource } = useLoaderData() as { resource: DataUsePageFragment };

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-mb-10">
          <ArticlePreTitle clickable secondary={<PreTitleDate date={resource.createdAt} />}>
            <DynamicLink to="/resource/search?contentType=dataUse">
              <FormattedMessage id="cms.contentType.dataUse" />
            </DynamicLink>
          </ArticlePreTitle>

          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
          )}

          {resource.resourceUsed && (
            <ArticleIntro className="g-mt-2 g-font-semibold g-text-sm">
              <FormattedMessage id="cms.datause.dataViaGbif" /> :{' '}
              <span dir="auto">{resource.resourceUsed}</span>
            </ArticleIntro>
          )}
        </ArticleTextContainer>

        <ArticleBanner className="g-mt-8 g-mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="g-mt-2" />
          )}

          <ArticleFooterWrapper>
            {resource.citation && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.auxiliary.citation" />}
                dangerouslySetValue={{
                  __html: resource.citation,
                  classNames: 'underlineLinks coloredLinks',
                }}
              />
            )}

            <ArticleTags resource={resource} className="g-mt-8" />
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </PageContainer>
    </article>
  );
}
