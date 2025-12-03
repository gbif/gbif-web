import { NewsPageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticlePageSkeleton } from '../article/article';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleBody } from '../components/articleBody';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticlePreTitle, PreTitleDate } from '../components/articlePreTitle';
import { ArticleTags } from '../components/articleTags';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleTitle } from '../components/articleTitle';
import { PageContainer } from '../components/pageContainer';
import { SecondaryLinks } from '../components/secondaryLinks';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { DynamicLink } from '@/reactRouterPlugins/dynamicLink';

export const NewsPageSkeleton = ArticlePageSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment NewsPage on News {
    id
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

export const newsPageLoader = createResourceLoaderWithRedirect({
  fragment: 'NewsPage',
  resourceType: 'News',
});

export function NewsPage() {
  const { resource } = useLoaderData() as { resource: NewsPageFragment };

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer>
          <ArticlePreTitle clickable secondary={<PreTitleDate date={resource.createdAt} />}>
            <DynamicLink to="/resource/search?contentType=news">
              <FormattedMessage id="cms.contentType.news" />
            </DynamicLink>
          </ArticlePreTitle>

          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
          )}
        </ArticleTextContainer>

        <ArticleBanner className="g-mt-8 g-mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="g-mt-2" />
          )}

          <ArticleFooterWrapper>
            {resource.secondaryLinks && (
              <ArticleAuxiliary>
                <SecondaryLinks links={resource.secondaryLinks} className="g-mt-8" />
              </ArticleAuxiliary>
            )}

            {resource.citation && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.auxiliary.citation" />}
                dangerouslySetValue={{
                  __html: resource.citation,
                  classNames: 'underlineLinks',
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
