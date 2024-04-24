import { DynamicLink } from '@/components/dynamicLink';
import { Coordinates, FeatureList, Sequenced, TypeStatus } from '@/components/highlights';
import { CountTag, Tag } from '@/components/resultCards';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import {
  OccurrenceClusterQuery,
  OccurrenceClusterQueryVariables,
  RelatedOccurrence,
  RelatedOccurrenceDetailsFragment,
  RelatedOccurrenceFragment,
  RelatedOccurrenceStub,
  RelatedOccurrenceStubFragment,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
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
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    // load publishers and refresh when pages change
    if (!key) return;

    load({
      variables: {
        key,
      },
    });
  }, [key]);

  if (loading || !data)
    return (
      <ArticleContainer className="bg-slate-100">
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </ArticleContainer>
    );

  return (
    <ArticleContainer className="bg-slate-100 pt-0">
      <ArticleTextContainer className="max-w-screen-xl xl:flex gap-x-4">
        <div className="flex-1">
          <CardHeader>
            <CardTitle>Current</CardTitle>
          </CardHeader>
          <RelatedRecord
            occurrence={data.occurrence?.related?.currentOccurrence?.occurrence}
            stub={data.occurrence?.related?.currentOccurrence?.stub}
          />
        </div>
        <div className="flex-1">
          <CardHeader>
            <CardTitle>Related</CardTitle>
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
    return <Card>Record has since been deleted</Card>;
  }
  return (
    <Card className="mb-4">
      <article className="p-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <h3 className="text-base font-semibold mb-2">
              <DynamicLink to={`/occurrence/${stub?.gbifId}`}>
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      occurrence?.gbifClassification?.usage?.formattedName ??
                      stub?.scientificName ??
                      'Unknown',
                  }}
                ></span>
              </DynamicLink>
            </h3>
            <p className="font-normal text-slate-700 text-sm">
              Dataset:{' '}
              <DynamicLink to={`/dataset/${stub?.datasetKey}`}>
                {occurrence?.datasetTitle}
              </DynamicLink>
            </p>
            <p className="font-normal text-slate-700 text-sm">
              Publisher:{' '}
              <DynamicLink to={`/publisher/${stub?.publishingOrgKey}`}>
                {stub?.publishingOrgName}
              </DynamicLink>
            </p>
            <p className="font-normal text-slate-700 text-sm">
              Basis of record:{' '}
              <FormattedMessage id={`enums.basisOfRecord.${occurrence.basisOfRecord}`} />
            </p>
            <FeatureList className="">
              <Sequenced />
              <Coordinates str={occurrence?.formattedCoordinates} />
              {occurrence?.typeStatus && <TypeStatus types={occurrence?.typeStatus} />}
            </FeatureList>
          </div>
          {occurrence?.primaryImage?.identifier && (
            <div className="max-w-48 md:max-w-64">
              <img className="rounded" src={occurrence?.primaryImage?.identifier} width="300px" />
            </div>
          )}
        </div>
        {reasons && (
          <div className="-m-1 mt-2 flex flex-row items-center flex-wrap">
            <hr className="border" />
            <span>Cluster tags</span>
            {reasons.map((reason: string, key: number) => {
              return <Tag key={key}>{reason}</Tag>;
            })}
            <div className="flex-grow"></div>
          </div>
        )}
      </article>
    </Card>
  );
}

const RELATED_OCCURRENCES_QUERY = /* GraphQL */ `
  query OccurrenceCluster($key: ID!) {
    occurrence(key: $key) {
      related {
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
    gbifClassification {
      usage {
        formattedName
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
