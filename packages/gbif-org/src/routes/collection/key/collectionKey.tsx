import { CollectionQuery, CollectionQueryVariables, CollectionSummaryMetricsQuery, CollectionSummaryMetricsQueryVariables, PredicateType } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';
import { CollectionKey as Presentation} from './collectionKeyPresentation';
import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';

export async function collectionLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<CollectionQuery, CollectionQueryVariables>(COLLECTION_QUERY, { key });
}

export function CollectionKey() {
  const { data } = useLoaderData() as { data: CollectionQuery };

  const { data: collectionMetrics, load: slowLoad } = useQuery<
    CollectionSummaryMetricsQuery,
    CollectionSummaryMetricsQueryVariables
  >(SLOW_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    const id = data.collection?.key;
    if (typeof id !== 'undefined') {
      const collectionPredicate = {
        type: PredicateType.Equals,
        key: "collectionKey",
        value: id
      };
      slowLoad({
        variables: {
          predicate: collectionPredicate,
          imagePredicate: {
            type: PredicateType.And,
            predicates: [collectionPredicate, { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' }]
          },
          coordinatePredicate: {
            type: PredicateType.And,
            predicates: [
              collectionPredicate,
              { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' }
            ]
          },
          clusterPredicate: {
            type: PredicateType.And,
            predicates: [
              collectionPredicate,
              { type: PredicateType.Equals, key: 'isInCluster', value: 'true' }
            ]
          },
        }
      });
    }
  }, [data.collection?.key]);

  if (data.collection == null) throw new Error('404');
  return <Presentation data={data} collectionMetrics={collectionMetrics}/>;
}

export { CollectionPageSkeleton } from './collectionKeyPresentation';

const COLLECTION_QUERY = /* GraphQL */ `
  query Collection($key: ID!){
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
      importantCollectors

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
      featuredImageUrl_fallback: homepageOGImageUrl_volatile
      
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
      collectionSummary
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
    }
  }
`;

const SLOW_QUERY = /* GraphQL */ `
  query CollectionSummaryMetrics($predicate: Predicate, $imagePredicate: Predicate, $coordinatePredicate: Predicate, $clusterPredicate: Predicate){
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