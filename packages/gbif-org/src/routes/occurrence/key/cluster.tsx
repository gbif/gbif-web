import { Coordinates, FeatureList, Sequenced, TypeStatus } from '@/components/highlights';
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
import { usePartialDataNotification } from '@/routes/rootErrorPage';
import { fragmentManager } from '@/services/fragmentManager';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

export function OccurrenceKeyCluster() {
  const { key } = useParams<{ key: string }>();

  const { data, error, load, loading } = useQuery<
    OccurrenceClusterQuery,
    OccurrenceClusterQueryVariables
  >(RELATED_OCCURRENCES_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
  });
  const notifyOfPartialData = usePartialDataNotification();
  useEffect(() => {
    if (error && data && !loading) {
      notifyOfPartialData();
    }
  }, [error, notifyOfPartialData]);

  useEffect(() => {
    if (!key) return;

    load({
      variables: {
        key,
        clusteringChecklistKey: import.meta.env.PUBLIC_CHECKLIST_KEY_FOR_CLUSTERING,
      },
    });
  }, [key, load]);

  if (error && !loading && !data.occurrence?.related?.currentOccurrence?.occurrence) {
    throw error;
  }

  if (loading || !data)
    return (
      <ArticleContainer className="g-bg-slate-100">
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </ArticleContainer>
    );

  // if there are no related occurrenves, then tell the user
  if (data.occurrence?.related?.count === 0) {
    return (
      <ArticleContainer className="g-bg-slate-100">
        <ArticleTextContainer>
          <FormattedMessage id="occurrenceDetails.cluster.noMatches" />
        </ArticleTextContainer>
      </ArticleContainer>
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
          {data.occurrence?.related?.relatedOccurrences?.map(
            (relatedOccurrence: RelatedOccurrenceFragment | null, key: number) => {
              return (
                <RelatedRecord
                  key={relatedOccurrence?.stub?.gbifId}
                  occurrence={relatedOccurrence.occurrence}
                  stub={relatedOccurrence.stub}
                  reasons={relatedOccurrence.reasons}
                />
              );
            }
          )}
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
  reasons?: [string];
  stub: RelatedOccurrenceStubFragment;
  occurrence?: RelatedOccurrenceDetailsFragment;
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
              <DynamicLink
                className="hover:g-text-primary-500 g-underline"
                to={`/occurrence/${stub?.gbifId}`}
                pageId="occurrenceKey"
                variables={{ key: stub?.gbifId }}
              >
                {occurrence?.classification?.usage?.name ?? stub?.scientificName ?? 'Unknown'}
              </DynamicLink>
            </h3>
            <p className="g-font-normal g-text-slate-700 g-text-sm">
              <FormattedMessage id="occurrenceDetails.dataset" />:{' '}
              <DynamicLink
                to={`/dataset/${stub?.datasetKey}`}
                pageId="datasetKey"
                variables={{ key: stub?.datasetKey }}
              >
                {occurrence?.datasetTitle}
              </DynamicLink>
            </p>
            <p className="g-font-normal g-text-slate-700 g-text-sm">
              <FormattedMessage id="occurrenceDetails.publisher" />:{' '}
              <DynamicLink
                to={`/publisher/${stub?.publishingOrgKey}`}
                pageId="publisherKey"
                variables={{ key: stub?.publishingOrgKey }}
              >
                {stub?.publishingOrgName}
              </DynamicLink>
            </p>
            <p className="g-font-normal g-text-slate-700 g-text-sm">
              <FormattedMessage id="occurrenceFieldNames.basisOfRecord" />:{' '}
              <FormattedMessage id={`enums.basisOfRecord.${occurrence.basisOfRecord}`} />
            </p>
            <FeatureList className="">
              {occurrence.volatile?.features?.isSequenced && <Sequenced />}
              <Coordinates str={occurrence?.formattedCoordinates} />
              {occurrence?.typeStatus && <TypeStatus types={occurrence?.typeStatus} />}
            </FeatureList>
          </div>
          {occurrence?.primaryImage?.identifier && (
            <div className="g-max-w-48 md:g-max-w-64">
              <img className="g-rounded" src={occurrence?.primaryImage?.identifier} width="300px" />
            </div>
          )}
        </div>
        {reasons && (
          <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
            <hr className="g-border" />
            <span>
              <FormattedMessage id="occurrenceDetails.cluster.clusterTags" />
            </span>
            {reasons.map((reason: string, key: number) => {
              return (
                <Tag key={key}>
                  <FormattedMessage id={`enums.clusterReasons.${reason}`} />
                </Tag>
              );
            })}
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
