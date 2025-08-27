import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage } from '@/components/highlights';
import PageMetaData from '@/components/PageMetaData';
import { NotFoundError } from '@/errors';
import {
  NodeDetailsFragment,
  ParticipantDetailsQuery,
  ParticipantDetailsQueryVariables,
} from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors, usePartialDataNotification } from '@/routes/rootErrorPage';
import { fragmentManager } from '@/services/fragmentManager';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { AboutContent } from './help';

fragmentManager.register(/* GraphQL */ `
  fragment ParticipantDetails on Participant {
    id
    title: name
    gbifRegion
    participationStatus
    membershipStart
    nodeEstablishmentDate
    participantUrl
    rssFeeds {
      label
      url
    }
    newsletters {
      label
      url
    }
    linksToSocialMedia {
      label
      url
    }
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment NodeDetails on Node {
    key
    title
    homepage
    contacts {
      key
      type
      firstName
      lastName
      email
      phone
      homepage
      organization
      roles
      userId
    }
    dataset(limit: 0) {
      count
    }
    publisher: organization(limit: 0) {
      count
    }
    headOfDelegation: contacts(type: "HEAD_OF_DELEGATION") {
      key
      firstName
      lastName
    }
    participantNodeManager: contacts(type: "NODE_MANAGER") {
      key
      firstName
      lastName
    }
  }
`);

const PARTICIPANT_QUERY = /* GraphQL */ `
  query ParticipantDetails($key: ID!) {
    participant(key: $key) {
      ...ParticipantDetails
      node {
        ...NodeDetails
      }
    }
  }
`;

export async function participantLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<ParticipantDetailsQuery, ParticipantDetailsQueryVariables>(
    PARTICIPANT_QUERY,
    { key }
  );
  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['participant'],
    errors,
    requiredObjects: [data?.participant, data?.participant?.node],
    query: PARTICIPANT_QUERY,
    variables: { key },
  });

  return { errors, data };
}

export function ParticipantPage() {
  const { data, errors } = useLoaderData() as { data: ParticipantDetailsQuery; errors: unknown };
  const notifyOfPartialData = usePartialDataNotification();
  useEffect(() => {
    if (errors) {
      notifyOfPartialData();
    }
  }, [errors, notifyOfPartialData]);

  if (data.participant == null) throw new NotFoundError();
  const { participant } = data;

  return (
    <article className="g-bg-background">
      <PageMetaData title={participant.title} path={`/participant/${participant.id}`} />

      <DataHeader aboutContent={<AboutContent />}></DataHeader>

      <PageContainer topPadded hasDataHeader>
        <ArticleTextContainer className="g-max-w-screen-lg">
          <ArticlePreTitle
            secondary={
              <FormattedMessage
                id={`enums.participationStatus.${participant.participationStatus}`}
                defaultMessage={participant.participationStatus ?? 'Unknown'}
              />
            }
          >
            <FormattedMessage id={`participant.participant`} />
          </ArticlePreTitle>
          <ArticleTitle>{participant.title}</ArticleTitle>
          <ParticipantHeaderInfo url={participant.participantUrl} node={participant.node} />
        </ArticleTextContainer>
      </PageContainer>

      <div className="g-bg-slate-100">
        <ArticleContainer>
          <ArticleTextContainer className="g-max-w-screen-lg">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </ArticleTextContainer>
        </ArticleContainer>
      </div>
    </article>
  );
}

export const ParticipantPageSkeleton = ArticleSkeleton;

export function ParticipantHeaderInfo({
  url,
  node,
}: {
  url?: string | null;
  node?: NodeDetailsFragment | null;
}) {
  return (
    <HeaderInfo>
      <HeaderInfoMain>
        <FeatureList>
          {url && <Homepage url={url} />}
          {(node?.dataset?.count ?? 0) > 0 && (
            <GenericFeature>
              <a href="#datasetList">
                <FormattedMessage id="counts.nDatasets" values={{ total: node?.dataset?.count }} />
              </a>
            </GenericFeature>
          )}
          {(node?.publisher?.count ?? 0) > 0 && (
            <GenericFeature>
              <a href="#publisherList">
                <FormattedMessage
                  id="counts.nEndorsedPublishers"
                  values={{ total: node?.publisher?.count }}
                />
              </a>
            </GenericFeature>
          )}
        </FeatureList>
      </HeaderInfoMain>
    </HeaderInfo>
  );
}
