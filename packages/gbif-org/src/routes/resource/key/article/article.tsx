import { ArticlePageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';
import { useLoaderData, useLocation } from 'react-router-dom';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleBody } from '../components/articleBody';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleTags } from '../components/articleTags';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleTitle } from '../components/articleTitle';
import { Documents } from '../components/documents';
import { PageContainer } from '../components/pageContainer';
import { SecondaryLinks } from '../components/secondaryLinks';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import PageMetaData from '@/components/PageMetaData';

export const ArticlePageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment ArticlePage on Article {
    id
    title
    summary
    excerpt
    body
    primaryImage {
      ...ArticleBanner
    }
    secondaryLinks {
      label
      url
    }
    documents {
      ...DocumentPreview
    }
    topics
    purposes
    audiences
    citation
    createdAt
  }
`);

export const articlePageLoader = createResourceLoaderWithRedirect({
  fragment: 'ArticlePage',
  resourceType: 'Article',
});

export function ArticlePage() {
  const { resource } = useLoaderData() as { resource: ArticlePageFragment };
  const location = useLocation();

  return (
    <article>
      <PageMetaData
        title={resource.title}
        description={resource.excerpt}
        path={location.pathname}
        imageUrl={resource.primaryImage?.file.normal}
        imageAlt={resource.primaryImage?.description}
      />

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-mb-10">
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

            {resource.documents && (
              <ArticleAuxiliary>
                <Documents documents={resource.documents} className="g-mt-8" />
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
