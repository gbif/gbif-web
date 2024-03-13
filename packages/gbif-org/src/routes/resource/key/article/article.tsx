import { ArticlePageFragment } from '@/gql/graphql';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { fragmentManager } from '@/services/FragmentManager';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { ArticleBody } from '../components/ArticleBody';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleOpenGraph } from '../components/ArticleOpenGraph';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { ArticleTags } from '../components/ArticleTags';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleTitle } from '../components/ArticleTitle';
import { Documents } from '../components/Documents';
import { SecondaryLinks } from '../components/SecondaryLinks';
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
          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
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
                dangerouslySetInnerHTML={{
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
