import { ConditionalWrapper } from '@/components/conditionalWrapper';
import EmptyTab from '@/components/EmptyTab';
import { Coordinates, FeatureList, Sequenced, TypeStatus } from '@/components/highlights';
import { Img } from '@/components/Img';
import { Tag } from '@/components/resultCards';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import {
  OccurrenceClusterQuery,
  OccurrenceClusterQueryVariables,
  RelatedOccurrenceDetailsFragment,
  RelatedOccurrenceStubFragment,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { is404 } from '@/routes/rootErrorPage';
import { fragmentManager } from '@/services/fragmentManager';
import { notNull } from '@/utils/notNull';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

const PATHS_404 = [['occurrence'], ['occurrence', 'related', 'currentOccurrence', 'occurrence']];

export function OccurrenceKeyCluster() {
  const key = useParams().key as string;

  const { data, error, loading } = useQuery<
    OccurrenceClusterQuery,
    OccurrenceClusterQueryVariables
  >(RELATED_OCCURRENCES_QUERY, {
    throwAllErrors: false,
    notifyOnErrorsFn: (error) => {
      // Don't notify if the error is a 404
      return !PATHS_404.some((path) => is404({ path, errors: error.graphQLErrors }));
    },
    variables: {
      key,
      clusteringChecklistKey: import.meta.env.PUBLIC_CHECKLIST_KEY_FOR_CLUSTERING,
    },
  });

  // Handle 404 errors
  if (error && PATHS_404.some((path) => is404({ path, errors: error.graphQLErrors }))) {
    return (
      <EmptyTab>
        <FormattedMessage id="occurrenceDetails.cluster.noMatches" />
      </EmptyTab>
    );
  }

  // Handle other errors
  if (error && !loading && !data?.occurrence?.related?.currentOccurrence?.occurrence) {
    throw error;
  }

  if (loading || !data) {
    return (
      <ArticleContainer className="g-bg-slate-100">
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </ArticleContainer>
    );
  }

  // if there are no related occurrenves, then tell the user
  if (data.occurrence?.related?.count === 0) {
    return (
      <EmptyTab>
        <FormattedMessage id="occurrenceDetails.cluster.noMatches" />
      </EmptyTab>
    );
  }

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-0">
      <ArticleTextContainer className="g-max-w-screen-xl xl:g-flex g-gap-x-4">
        <div className="g-flex-1">
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="occurrenceDetails.cluster.current" />
            </CardTitle>
          </CardHeader>
          <RelatedRecord
            occurrence={data.occurrence?.related?.currentOccurrence?.occurrence}
            stub={data.occurrence?.related?.currentOccurrence?.stub}
          />
        </div>
        <div className="g-flex-1">
          <CardHeader>
            <CardTitle>
              <FormattedMessage id="occurrenceDetails.cluster.relatedOccurrences" />
            </CardTitle>
          </CardHeader>
          {data.occurrence?.related?.relatedOccurrences
            ?.filter(notNull)
            .map((relatedOccurrence) => (
              <RelatedRecord
                key={relatedOccurrence.stub?.gbifId}
                occurrence={relatedOccurrence.occurrence}
                stub={relatedOccurrence.stub}
                reasons={relatedOccurrence.reasons.filter(notNull)}
              />
            ))}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

function RelatedRecord({
  stub,
  occurrence,
  reasons,
}: {
  reasons?: string[];
  stub: RelatedOccurrenceStubFragment | null | undefined;
  occurrence?: RelatedOccurrenceDetailsFragment | null;
}) {
  if (!occurrence) {
    return (
      <Card className="g-mb-4">
        <CardHeader className="g-bg-red-500 g-text-white">
          <FormattedMessage id="search.occurrenceClustersView.isDeleted" />
        </CardHeader>
        <CardContent>
          <pre className="g-overflow-auto">{JSON.stringify(stub, null, 2)}</pre>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="g-mb-4">
      <article className="g-p-8">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <h3 className="g-text-base g-font-semibold g-mb-2">
              <ConditionalWrapper
                condition={typeof stub?.gbifId === 'string'}
                wrapper={(children) => (
                  <DynamicLink
                    className="hover:g-text-primary-500 g-underline"
                    pageId="occurrenceKey"
                    variables={{ key: stub!.gbifId! }}
                  >
                    {children}
                  </DynamicLink>
                )}
              >
                {occurrence?.classification?.usage?.name ?? stub?.scientificName ?? 'Unknown'}
              </ConditionalWrapper>
            </h3>
            <p className="g-font-normal g-text-slate-700 g-text-sm">
              <FormattedMessage id="occurrenceDetails.dataset" />:{' '}
              <ConditionalWrapper
                condition={typeof stub?.datasetKey === 'string'}
                wrapper={(children) => (
                  <DynamicLink
                    className="g-underline"
                    pageId="datasetKey"
                    variables={{ key: stub!.datasetKey! }}
                  >
                    {children}
                  </DynamicLink>
                )}
              >
                {occurrence?.datasetTitle}
              </ConditionalWrapper>
            </p>
            <p className="g-font-normal g-text-slate-700 g-text-sm">
              <FormattedMessage id="occurrenceDetails.publisher" />:{' '}
              <ConditionalWrapper
                condition={typeof stub?.publishingOrgKey === 'string'}
                wrapper={(children) => (
                  <DynamicLink
                    className="g-underline"
                    pageId="publisherKey"
                    variables={{ key: stub!.publishingOrgKey! }}
                  >
                    {children}
                  </DynamicLink>
                )}
              >
                {stub?.publishingOrgName}
              </ConditionalWrapper>
            </p>
            <p className="g-font-normal g-text-slate-700 g-text-sm">
              <FormattedMessage id="occurrenceFieldNames.basisOfRecord" />:{' '}
              <FormattedMessage id={`enums.basisOfRecord.${occurrence.basisOfRecord}`} />
            </p>
            <FeatureList className="">
              {occurrence.volatile?.features?.isSequenced && <Sequenced />}
              <Coordinates str={occurrence?.formattedCoordinates} />
              {occurrence?.typeStatus && (
                <TypeStatus types={occurrence?.typeStatus.filter(notNull)} />
              )}
            </FeatureList>
          </div>
          {occurrence?.primaryImage?.identifier && (
            <div className="g-max-w-48 md:g-max-w-64">
              <Img
                className="g-rounded"
                src={occurrence?.primaryImage?.identifier}
                width="300px"
                failedClassName="g-h-36 g-slate-200"
              />
            </div>
          )}
        </div>
        {reasons && (
          <div className="-g-m-1 g-mt-4 g-flex g-flex-row g-items-center g-flex-wrap">
            <span className="g-text-sm g-ms-1">
              <FormattedMessage id="occurrenceDetails.cluster.clusterTags" />:
            </span>
            {reasons.map((reason: string, key: number) => (
              <Tag key={key}>
                <FormattedMessage id={`enums.clusterReasons.${reason}`} />
              </Tag>
            ))}
            <div className="g-flex-grow"></div>
          </div>
        )}
      </article>
    </Card>
  );
}

const RELATED_OCCURRENCES_QUERY = /* GraphQL */ `
  query OccurrenceCluster($key: ID!, $clusteringChecklistKey: ID!) {
    occurrence(key: $key) {
      related {
        count
        currentOccurrence {
          stub {
            ...RelatedOccurrenceStub
          }
          occurrence {
            ...RelatedOccurrenceDetails
          }
        }
        relatedOccurrences {
          reasons
          stub {
            ...RelatedOccurrenceStub
          }
          occurrence {
            ...RelatedOccurrenceDetails
          }
        }
      }
    }
  }
`;

fragmentManager.register(/* GraphQL */ `
  fragment RelatedOccurrenceStub on RelatedOccurrenceStub {
    gbifId
    occurrenceID
    catalogNumber
    publishingOrgKey
    publishingOrgName
    datasetKey
    scientificName
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment RelatedOccurrenceDetails on Occurrence {
    key
    basisOfRecord
    datasetTitle
    publisherTitle
    coordinates
    typeStatus
    soundCount
    stillImageCount
    movingImageCount
    formattedCoordinates
    eventDate
    primaryImage {
      identifier
    }
    classification(checklistKey: $clusteringChecklistKey) {
      usage {
        name
      }
    }
    volatile {
      features {
        isSequenced
        isSamplingEvent
        isTreament
      }
    }
  }
`);
