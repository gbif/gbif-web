import { ErrorBoundary } from '@/components/ErrorBoundary';
import { GbifNetworkPageQuery, GbifNetworkParticipantsQuery } from '@/gql/graphql';
import { LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../../resource/key/components/articleAuxiliary';
import { ArticleBody } from '../../resource/key/components/articleBody';
import { ArticleFooterWrapper } from '../../resource/key/components/articleFooterWrapper';
import { ArticleIntro } from '../../resource/key/components/articleIntro';
import { ArticleOpenGraph } from '../../resource/key/components/articleOpenGraph';
import { ArticleSkeleton } from '../../resource/key/components/articleSkeleton';
import { ArticleTags } from '../../resource/key/components/articleTags';
import { ArticleTextContainer } from '../../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../../resource/key/components/articleTitle';
import { Documents } from '../../resource/key/components/documents';
import { PageContainer } from '../../resource/key/components/pageContainer';
import { SecondaryLinks } from '../../resource/key/components/secondaryLinks';
import { Map } from './Map';
import NodeSteeringGroup from './NodeSteeringGroup';
import Participants from './Participants';
import useFetchGet from '@/hooks/useFetchGet';
import { SkeletonTable } from '@/components/ui/skeleton';
// eslint-disable-next-line
import { NETWORK_PARTICIPANTS_QUERY } from './networkParticipantQuery.mjs'; // we import this simply to generate types

const GBIF_NETWORK_QUERY = /* GraphQL */ `
  query GbifNetworkPage {
    resource(alias: "/the-gbif-network/global") {
      __typename
      ... on Article {
        id
        title
        summary
        excerpt
        body
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

async function gbifNetworkPageLoader({ graphql }: LoaderArgs) {
  const response = await graphql.query<GbifNetworkPageQuery, undefined>(
    GBIF_NETWORK_QUERY,
    undefined
  );
  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['resource'],
    errors,
    requiredObjects: [data?.resource],
  });

  return { errors, data };
}

function GbifNetworkPage() {
  const { data } = useLoaderData() as { data: GbifNetworkPageQuery };
  const resource = data.resource;

  const {
    data: listData,
    loading,
    error,
  } = useFetchGet<GbifNetworkParticipantsQuery>({
    endpoint: `/unstable-api/cached-response/network-page`,
  });

  if (error) {
    throw new Error('Failed to load GBIF Network participants data');
  }

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

        <Map className="g-mt-8 g-mb-6" listData={listData} loading={loading} />

        <ArticleTextContainer className="g-mb-8">
          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="g-mt-2" />
          )}

          <div className="g-prose g-max-w-none dark:g-prose-invert">
            <h2>
              <FormattedMessage id="gbifNetwork.headlines.nodesSteeringGroup" />
            </h2>
          </div>
          {listData && (
            <ErrorBoundary type="BLOCK" showReportButton={true}>
              <div className="g-prose g-max-w-none dark:g-prose-invert">
                <NodeSteeringGroup listData={listData} />
              </div>
            </ErrorBoundary>
          )}
        </ArticleTextContainer>

        <ArticleTextContainer className="g-mb-8">
          <div className="g-prose g-max-w-none dark:g-prose-invert" id="participants">
            <h2>
              <FormattedMessage id="gbifNetwork.headlines.participants" />
            </h2>
            {!loading && listData && <Participants listData={listData} />}
            {(loading || !listData) && <SkeletonTable rows={20} columns={3} />}
          </div>
        </ArticleTextContainer>
        <ArticleTextContainer>
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

export const gbifNetworkRoute: RouteObjectWithPlugins = {
  id: 'the-gbif-network',
  element: <GbifNetworkPage />,
  loader: gbifNetworkPageLoader,
  loadingElement: <ArticleSkeleton />,
  path: 'the-gbif-network',
  shouldRevalidate: ({ currentUrl, nextUrl, defaultShouldRevalidate }) => {
    // Only revalidate if the pathname changed, not search params
    if (currentUrl.pathname !== nextUrl.pathname) {
      return true;
    }
    return false;
  },
};
