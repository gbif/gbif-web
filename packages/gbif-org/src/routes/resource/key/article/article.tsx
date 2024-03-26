import { ArticlePageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleBody } from '../components/articleBody';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleTags } from '../components/articleTags';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleTitle } from '../components/articleTitle';
import { Documents } from '../components/documents';
import { SecondaryLinks } from '../components/secondaryLinks';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';

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

  return (
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

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

            {resource.documents && (
              <ArticleAuxiliary>
                <Documents documents={resource.documents} className="mt-8" />
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
