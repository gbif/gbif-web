import { NewsPageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { fragmentManager } from '@/services/FragmentManager';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticlePageSkeleton } from '../article/article';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleTitle } from '../components/ArticleTitle';
import { PublishedDate } from '../components/PublishedDate';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { ArticleOpenGraph } from '../components/ArticleOpenGraph';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { SecondaryLinks } from '../components/SecondaryLinks';

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
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer>
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.news" />
          </ArticlePreTitle>

          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          <PublishedDate className="mt-2" date={resource.createdAt} />

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="mt-2" />
          )}
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="mt-2" />
          )}

          <ArticleFooterWrapper>
            {resource.secondaryLinks && (
              <ArticleAuxiliary>
                <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
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

            <ArticleTags resource={resource} className="mt-8" />
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}
