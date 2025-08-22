import { ClientSideOnly } from '@/components/clientSideOnly';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  GbifNetworkPageQuery,
  GbifNetworkParticipantsQuery,
  GbifNetworkParticipantsQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
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

const NETWORK_PARTICIPANTS_QUERY = /* GraphQL */ `
  query GbifNetworkParticipants {
    nodeSteeringGroup {
      name
      title
      institutionName
      address
      addressCountry
      email
      role
      contact {
        participants {
          id
          name
          gbifRegion
        }
      }
    }
    nodeSearch(limit: 1000) {
      results {
        type
        country
        identifiers {
          type
          identifier
        }
        participant {
          id
          participationStatus
          membershipStart
          name
          gbifRegion
          countryCode
        }
        contacts(type: ["HEAD_OF_DELEGATION", "NODE_MANAGER"]) {
          firstName
          lastName
          type
        }
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
  const { data: listData, loading } = useQuery<
    GbifNetworkParticipantsQuery,
    GbifNetworkParticipantsQueryVariables
  >(NETWORK_PARTICIPANTS_QUERY, { notifyOnErrors: true, throwAllErrors: false });
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

        <ClientSideOnly>
          <Map className="g-mt-8 g-mb-6" listData={listData} />
        </ClientSideOnly>

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

        {!loading && listData && (
          <>
            <ArticleTextContainer className="g-mb-8">
              <div className="g-prose g-max-w-none dark:g-prose-invert">
                <h2>
                  <FormattedMessage id="gbifNetwork.headlines.participants" />
                </h2>
                <Participants listData={listData} />
              </div>
            </ArticleTextContainer>
            {/* <div className="g-prose g-max-w-none dark:g-prose-invert">
              <Participants listData={listData} />
            </div> */}
          </>
        )}
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
};
