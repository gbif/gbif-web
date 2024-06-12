import { InstitutionQuery, InstitutionQueryVariables, InstitutionSummaryMetricsQuery, InstitutionSummaryMetricsQueryVariables, PredicateType } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';
import { InstitutionKey as Presentation} from './institutionKeyPresentation';
import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';

export async function institutionLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<InstitutionQuery, InstitutionQueryVariables>(INSTITUTION_QUERY, { key });
}

export function InstitutionKey() {
  const { data } = useLoaderData() as { data: InstitutionQuery };

  const { data: institutionMetrics, load: slowLoad } = useQuery<
    InstitutionSummaryMetricsQuery,
    InstitutionSummaryMetricsQueryVariables
  >(SLOW_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    const id = data.institution?.key;
    if (typeof id !== 'undefined') {
      const institutionPredicate = {
        type: PredicateType.Equals,
        key: "institutionKey",
        value: id
      };
      slowLoad({
        variables: {
          key: id,
          predicate: institutionPredicate,
          imagePredicate: {
            type: PredicateType.And,
            predicates: [institutionPredicate, { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' }]
          },
          coordinatePredicate: {
            type: PredicateType.And,
            predicates: [
              institutionPredicate,
              { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' }
            ]
          },
          clusterPredicate: {
            type: PredicateType.And,
            predicates: [
              institutionPredicate,
              { type: PredicateType.Equals, key: 'isInCluster', value: 'true' }
            ]
          },
        }
      });
    }
  }, [data.institution?.key]);

  if (data.institution == null) throw new Error('404');
  return <Presentation data={data} institutionMetrics={institutionMetrics}/>;
}

export { InstitutionPageSkeleton } from './institutionKeyPresentation';

const INSTITUTION_QUERY = /* GraphQL */ `
  query Institution($key: ID!) {
    institution(key: $key) {
      key
      code
      name
      description
      active
      email
      phone
      homepage
      catalogUrl
      alternativeCodes {
        code
        description
      }
      type
      apiUrl
      institutionalGovernance
      disciplines
      latitude
      longitude
      additionalNames
      foundingDate
      geographicDescription
      taxonomicDescription
      numberSpecimens
      indexHerbariorumRecord
      logoUrl
      citesPermitNumber

      masterSourceMetadata {
        key
        source
        sourceId
      }

      created
      deleted
      modified
      modifiedBy
      replacedByInstitution {
        name
        key
      }

      identifiers {
        identifier
        type
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
      numberSpecimens
      
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
      collections(limit: 200) {
        key
        excerpt
        code
        name
        active
        numberSpecimens
        richness
      }
    }
  }
`;

const SLOW_QUERY = /* GraphQL */ `
  query InstitutionSummaryMetrics($key: ID!, $predicate: Predicate, $imagePredicate: Predicate, $coordinatePredicate: Predicate, $clusterPredicate: Predicate){
    occurrenceSearch(predicate: $predicate) {
      documents(size: 0) {
        total
      }
    }
    institution(key: $key) {
      key
      collections(limit: 200) {
        key
        occurrenceCount
        richness
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