import {
  NormalizePredicateAndCountQuery,
  NormalizePredicateAndCountQueryVariables,
  NormalizePredicateQuery,
  NormalizePredicateQueryVariables,
  Predicate,
} from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { useEffect } from 'react';
import { withSequenceFilter } from './utils';

// `sequenced` counts the subset of the search that a sequence-only format (FASTA archive) would
// actually contain. It is asked for alongside the total so the download flow can tell the user how
// many records such a download would include and how many would be left out.
const PREDICATE_COUNT_QUERY = /* GraphQL */ `
  query normalizePredicateAndCount($predicate: Predicate, $sequencePredicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      _meta
      documents {
        total
      }
    }
    sequenced: occurrenceSearch(predicate: $sequencePredicate) {
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
  >(PREDICATE_COUNT_QUERY, { lazyLoad: true });

  useEffect(() => {
    try {
      const p = typeof predicate === 'string' ? JSON.parse(predicate) : predicate;
      load({
        variables: {
          predicate: p,
          sequencePredicate: withSequenceFilter(p) as Predicate,
        },
      });
    } catch (e) {
      console.error('Failed to parse predicate', e);
    }
  }, [predicate, load]);

  return {
    total: data?.occurrenceSearch?.documents?.total,
    sequencedTotal: data?.sequenced?.documents?.total,
    predicate: data?.occurrenceSearch?._meta?.normalizedPredicate?.predicate,
    loading: loading ?? true,
    error: error,
  };
}

export function useNormalizedPredicate({ predicate }: { predicate?: Predicate | string }) {
  const { data, loading, error, load } = useQuery<
    NormalizePredicateQuery,
    NormalizePredicateQueryVariables
  >(PREDICATE_QUERY, { lazyLoad: true });

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
