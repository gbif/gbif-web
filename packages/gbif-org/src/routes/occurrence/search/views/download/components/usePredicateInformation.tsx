import {
  NormalizePredicateAndCountQuery,
  NormalizePredicateAndCountQueryVariables,
  NormalizePredicateQuery,
  NormalizePredicateQueryVariables,
  Predicate,
} from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { useEffect } from 'react';

const PREDICATE_COUNT_QUERY = /* GraphQL */ `
  query normalizePredicateAndCount($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      _meta
      documents {
        total
      }
    }
  }
`;

const PREDICATE_QUERY = /* GraphQL */ `
  query normalizePredicate($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      _meta
    }
  }
`;

export function usePredicateInformation({ predicate }: { predicate?: Predicate | string }) {
  const { data, loading, error, load } = useQuery<
    NormalizePredicateAndCountQuery,
    NormalizePredicateAndCountQueryVariables
  >(PREDICATE_COUNT_QUERY, { lazyLoad: false });

  useEffect(() => {
    try {
      const p = typeof predicate === 'string' ? JSON.parse(predicate) : predicate;
      load({ variables: { predicate: p } });
    } catch (e) {
      console.error('Failed to parse predicate', e);
    }
  }, [predicate, load]);

  return {
    total: data?.occurrenceSearch?.documents?.total,
    predicate: data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate,
    loading: loading ?? true,
    error: error,
  };
}

export function useNormalizedPredicate({ predicate }: { predicate?: Predicate | string }) {
  const { data, loading, error, load } = useQuery<
    NormalizePredicateQuery,
    NormalizePredicateQueryVariables
  >(PREDICATE_QUERY);

  useEffect(() => {
    if (predicate) {
      try {
        const pred = typeof predicate === 'string' ? JSON.parse(predicate) : predicate;
        load({ variables: { predicate: pred } });
      } catch (e) {
        console.error('Failed to parse predicate', e);
      }
    }
  }, [predicate, load]);

  return {
    predicate: data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate,
    loading,
    error: !loading ? error : null,
  };
}
