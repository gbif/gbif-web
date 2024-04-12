import { Helmet } from 'react-helmet-async';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticlePreTitle } from '../components/articlePreTitle';
import { ArticleTitle } from '../components/articleTitle';
import { PublishedDate } from '../components/publishedDate';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleBody } from '../components/articleBody';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleTags } from '../components/articleTags';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { fragmentManager } from '@/services/fragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { DataUsePageFragment } from '@/gql/graphql';
import { ArticleOpenGraph } from '../components/articleOpenGraph';

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
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.dataUse" />
          </ArticlePreTitle>

          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.createdAt && <PublishedDate className="mt-2" date={resource.createdAt} />}

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="mt-2" />
          )}

          <ArticleIntro className="mt-2">
            <FormattedMessage id="cms.datause.dataViaGbif" /> : {resource.resourceUsed}
          </ArticleIntro>
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="mt-2" />
          )}

          <ArticleFooterWrapper>
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
