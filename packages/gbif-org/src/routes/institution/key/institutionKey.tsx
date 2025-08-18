import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { NotFoundError } from '@/errors';
import {
  InstitutionFallbackImageQuery,
  InstitutionFallbackImageQueryVariables,
  InstitutionQuery,
  InstitutionQueryVariables,
  InstitutionSummaryMetricsQuery,
  InstitutionSummaryMetricsQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs } from '@/reactRouterPlugins';
import { required } from '@/utils/required';
import { useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import { InstitutionKey as Presentation } from './institutionKeyPresentation';

export async function institutionLoader({ params, graphql, config }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');
  const scope = config.collectionSearch?.scope;

  return graphql.query<InstitutionQuery, InstitutionQueryVariables>(INSTITUTION_QUERY, {
    key,
    collectionScope: scope ?? {},
  });
}

function useErrorPageTest({
  errors,
  primaryObject,
}: {
  errors: Array<{ message: string; path: [string] }>;
  primaryObject?: unknown | null;
}) {
  const { toast } = useToast();

  useEffect(() => {
    if (is404({ path: ['institution'], errors })) {
      throw new NotFoundError();
    }
    if (!primaryObject && errors && errors.length > 0) {
      throw new Error('Unable to load item');
    }

    if (errors && errors.length > 0) {
      toast({
        title: 'Unable to load all content',
        variant: 'destructive',
      });
    }
  }, [primaryObject, errors, toast]);
}

export function InstitutionKey() {
  const { data, errors } = useLoaderData() as {
    data: InstitutionQuery;
    errors: Array<{ message: string; path: [string] }>;
  };
  const config = useConfig();
  useErrorPageTest({ errors, primaryObject: data?.institution });
  // const { toast } = useToast();

  // if (is404({ path: ['institution'], errors })) {
  //   throw new NotFoundError();
  // }
  // if (data.institution === null && errors && errors.length > 0) {
  //   throw new Error('Unable to load item');
  // }

  // useEffect(() => {
  //   if (errors && errors.length > 0) {
  //     toast({
  //       title: 'Unable to load all content',
  //       variant: 'destructive',
  //     });
  //   }
  // }, [data, errors, toast]);

  const collectionScope = config.collectionSearch?.scope;

  const { data: institutionMetrics, load: slowLoad } = useQuery<
    InstitutionSummaryMetricsQuery,
    InstitutionSummaryMetricsQueryVariables
  >(SLOW_QUERY, {
    lazyLoad: true,
    throwAllErrors: false,
  });

  const { data: imageData, load: imageLoad } = useQuery<
    InstitutionFallbackImageQuery,
    InstitutionFallbackImageQueryVariables
  >(IMAGE_QUERY, {
    lazyLoad: true,
    throwAllErrors: false,
  });

  useEffect(() => {
    const id = data.institution?.key;
    if (typeof id !== 'undefined') {
      const institutionPredicate = {
        type: PredicateType.Equals,
        key: 'institutionKey',
        value: id,
      };
      slowLoad({
        variables: {
          collectionScope: collectionScope ?? {},
          key: id,
          predicate: institutionPredicate,
          imagePredicate: {
            type: PredicateType.And,
            predicates: [
              institutionPredicate,
              { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
            ],
          },
          coordinatePredicate: {
            type: PredicateType.And,
            predicates: [
              institutionPredicate,
              { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' },
            ],
          },
          clusterPredicate: {
            type: PredicateType.And,
            predicates: [
              institutionPredicate,
              { type: PredicateType.Equals, key: 'isInCluster', value: 'true' },
            ],
          },
        },
      });
      imageLoad({ variables: { key: id } });
    }
  }, [data.institution?.key, slowLoad, imageLoad, collectionScope]);

  if (!errors && data && !data.institution) throw new NotFoundError();

  return (
    <Presentation
      data={data}
      institutionMetrics={institutionMetrics}
      fallbackImage={imageData?.institution?.featuredImageUrl_fallback}
    />
  );
}

export { InstitutionPageSkeleton } from './institutionKeyPresentation';

const INSTITUTION_QUERY = /* GraphQL */ `
  query Institution($key: ID!, $collectionScope: CollectionSearchInput) {
    institution(key: $key) {
      key
      code
      name
      description
      active
      email
      phone
      homepage
      catalogUrls
      alternativeCodes {
        code
        description
      }
      types
      apiUrls
      institutionalGovernances
      disciplines
      latitude
      longitude
      additionalNames
      foundingDate
      numberSpecimens
      logoUrl

      featuredImageUrl: thumbor(width: 1000, height: 667)
      featuredImageLicense
      featuredImageUrl_fallback: homepageOGImageUrl_volatile(onlyIfNoImageUrl: true, timeoutMs: 300)

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
      collectionCount(query: $collectionScope)
    }
  }
`;

const SLOW_QUERY = /* GraphQL */ `
  query InstitutionSummaryMetrics(
    $key: ID!
    $collectionScope: CollectionSearchInput
    $predicate: Predicate
    $imagePredicate: Predicate
    $coordinatePredicate: Predicate
    $clusterPredicate: Predicate
  ) {
    occurrenceSearch(predicate: $predicate) {
      documents(size: 0) {
        total
      }
    }
    institution(key: $key) {
      key
      collections(limit: 200, query: $collectionScope) {
        key
        excerpt
        code
        name
        active
        numberSpecimens
        richness
        occurrenceCount
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
  query InstitutionFallbackImage($key: ID!) {
    institution(key: $key) {
      featuredImageUrl_fallback: homepageOGImageUrl_volatile(
        onlyIfNoImageUrl: true
        timeoutMs: 3000
      )
    }
  }
`;

function is404({
  path,
  errors,
}: {
  path: [string];
  errors: Array<{ message: string; path: [string] }>;
}) {
  // check if the path match the error path and the message contains 404
  return errors?.some(
    (error) => error.path.join('.') === path.join('.') && error.message.includes('404')
  );
}
