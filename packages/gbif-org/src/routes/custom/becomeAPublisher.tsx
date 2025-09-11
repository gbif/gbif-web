import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { BecomeAPublisherPageQuery } from '@/gql/graphql';
import { LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../resource/key/components/articleAuxiliary';
import { ArticleBody } from '../resource/key/components/articleBody';
import { ArticleFooterWrapper } from '../resource/key/components/articleFooterWrapper';
import { ArticleIntro } from '../resource/key/components/articleIntro';
import { ArticleOpenGraph } from '../resource/key/components/articleOpenGraph';
import { ArticleSkeleton } from '../resource/key/components/articleSkeleton';
import { ArticleTags } from '../resource/key/components/articleTags';
import { ArticleTextContainer } from '../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../resource/key/components/articleTitle';
import { Documents } from '../resource/key/components/documents';
import { PageContainer } from '../resource/key/components/pageContainer';
import { SecondaryLinks } from '../resource/key/components/secondaryLinks';
import { BecomeAPublisherForm } from '../resource/key/composition/blocks/customComponents/becomeAPublisherForm';
import { ProtectedForm } from '@/components/protectedForm';

const BECOME_A_PUBLISHER_QUERY = /* GraphQL */ `
  query BecomeAPublisherPage {
    resource(alias: "/become-a-publisher") {
      __typename
      ... on Article {
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
    }
  }
`;

function becomeAPublisherPageLoader(args: LoaderArgs) {
  return args.graphql.query<BecomeAPublisherPageQuery, undefined>(
    BECOME_A_PUBLISHER_QUERY,
    undefined
  );
}

function BecomeAPublisherPage() {
  const { data } = useLoaderData() as { data: BecomeAPublisherPageQuery };
  const resource = data.resource;

  // This should not happen as long as the become a publisher page is of type Article in Contentful
  if (resource?.__typename !== 'Article') {
    throw new Error('Invalid resource type');
  }

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded className="g-bg-white">
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

          <hr className="g-mt-8" />

          <ProtectedForm
            className="g-mt-4"
            title={<FormattedMessage id="eoi.loginToRegisterOrganization.title" />}
            message={<FormattedMessage id="eoi.loginToRegisterOrganization.message" />}
          >
            <StaticRenderSuspence>
              <BecomeAPublisherForm className="g-px-0" />
            </StaticRenderSuspence>
          </ProtectedForm>

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

export const becomeAPublisherRoute: RouteObjectWithPlugins = {
  id: 'become-a-publisher',
  element: <BecomeAPublisherPage />,
  loader: becomeAPublisherPageLoader,
  loadingElement: <ArticleSkeleton />,
  path: 'become-a-publisher',
};
