import { NotFoundError } from '@/errors';
import {
  CollectionFallbackImageQuery,
  CollectionFallbackImageQueryVariables,
  CollectionQuery,
  CollectionQueryVariables,
  CollectionSummaryMetricsQuery,
  CollectionSummaryMetricsQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { CollectionKey as Presentation } from './collectionKeyPresentation';

export async function collectionLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<CollectionQuery, CollectionQueryVariables>(
    COLLECTION_QUERY,
    { key }
  );

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['collection'],
    errors,
    requiredObjects: [data?.collection],
  });

  return response;
}

export function CollectionKey() {
  const { data } = useLoaderData() as { data: CollectionQuery };

  const { data: collectionMetrics, load: slowLoad } = useQuery<
    CollectionSummaryMetricsQuery,
    CollectionSummaryMetricsQueryVariables
  >(SLOW_QUERY, {
    lazyLoad: true,
    notifyOnErrors: true,
    throwAllErrors: false,
  });

  const { data: imageData, load: imageLoad } = useQuery<
    CollectionFallbackImageQuery,
    CollectionFallbackImageQueryVariables
  >(IMAGE_QUERY, {
    lazyLoad: true,
    notifyOnErrors: true,
    throwAllErrors: false,
  });

  useEffect(() => {
    const id = data.collection?.key;
    if (typeof id !== 'undefined') {
      const collectionPredicate = {
        type: PredicateType.Equals,
        key: 'collectionKey',
        value: id,
      };
      slowLoad({
        variables: {
          predicate: collectionPredicate,
          imagePredicate: {
            type: PredicateType.And,
            predicates: [
              collectionPredicate,
              { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
            ],
          },
          coordinatePredicate: {
            type: PredicateType.And,
            predicates: [
              collectionPredicate,
              { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' },
            ],
          },
          clusterPredicate: {
            type: PredicateType.And,
            predicates: [
              collectionPredicate,
              { type: PredicateType.Equals, key: 'isInCluster', value: 'true' },
            ],
          },
        },
      });
      imageLoad({ variables: { key: id } });
    }
  }, [data.collection?.key, imageLoad, slowLoad]);

  if (data.collection == null) throw new NotFoundError();
  return (
    <Presentation
      data={data}
      collectionMetrics={collectionMetrics}
      fallbackImage={imageData?.collection?.featuredImageUrl_fallback}
    />
  );
}

export { CollectionPageSkeleton } from './collectionKeyPresentation';

const COLLECTION_QUERY = /* GraphQL */ `
  query Collection($key: ID!) {
    collection(key: $key) {
      key
      active
      code
      name
      description
      taxonomicCoverage
      geographicCoverage
      temporalCoverage
      notes
      homepage

      numberSpecimens
      incorporatedCollections

      contentTypes

      personalCollection
      email
      phone

      catalogUrls
      apiUrls
      preservationTypes
      accessionStatus

      featuredImageUrl: thumbor(width: 1000, height: 667)
      featuredImageLicense
      featuredImageUrl_fallback: homepageOGImageUrl_volatile(onlyIfNoImageUrl: true, timeoutMs: 300)

      created
      deleted
      modified
      modifiedBy
      replacedByCollection {
        name
        key
      }

      institutionKey
      identifiers {
        key
        type
        identifier
        primary
      }
      contactPersons {
        key
        firstName
        lastName
        phone
        email
        taxonomicExpertise
        primary
        position
        userIds {
          type
          id
        }
      }
      alternativeCodes {
        code
        description
      }
      institution {
        code
        name
        key
      }

      mailingAddress {
        address
        city
        province
        postalCode
        country
      }
      address {
        address
        city
        province
        postalCode
        country
      }
      descriptorGroups(limit: 0) {
        count
      }
    }
  }
`;

const SLOW_QUERY = /* GraphQL */ `
  query CollectionSummaryMetrics(
    $predicate: Predicate
    $imagePredicate: Predicate
    $coordinatePredicate: Predicate
    $clusterPredicate: Predicate
  ) {
    occurrenceSearch(predicate: $predicate) {
      documents(size: 0) {
        total
      }
      cardinality {
        recordedBy
      }
    }
    withImages: occurrenceSearch(predicate: $imagePredicate) {
      documents(size: 0) {
        total
      }
    }
    withCoordinates: occurrenceSearch(predicate: $coordinatePredicate) {
      documents(size: 0) {
        total
      }
    }
    withClusters: occurrenceSearch(predicate: $clusterPredicate) {
      documents(size: 0) {
        total
      }
    }
  }
`;

const IMAGE_QUERY = /* GraphQL */ `
  query CollectionFallbackImage($key: ID!) {
    collection(key: $key) {
      featuredImageUrl_fallback: homepageOGImageUrl_volatile(
        onlyIfNoImageUrl: true
        timeoutMs: 3000
      )
    }
  }
`;
