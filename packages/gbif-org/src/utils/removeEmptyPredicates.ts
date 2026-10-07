import { Predicate } from '@/gql/graphql';
import { isNullOrUndefined } from './isNullOrUndefined';

type PredicateLike = { predicate?: unknown; predicates?: unknown };

export function removeEmptyPredicates(predicate: unknown): Predicate | undefined {
  if (isNullOrUndefined(predicate)) {
    return undefined;
  }
  const p = predicate as PredicateLike;
  // if predicate has a property called predicate, but it is empty, then return undefined
  if (Object.prototype.hasOwnProperty.call(p, 'predicate') && isNullOrUndefined(p?.predicate)) {
    return undefined;
  }

  if (Array.isArray(p?.predicates)) {
    const predicates = p.predicates
      .filter((x) => !isNullOrUndefined(x))
      .map(removeEmptyPredicates)
      .filter((x): x is Predicate => !isNullOrUndefined(x));
    if (!predicates || predicates.length === 0) {
      return undefined;
    }
    return {
      ...(p as Predicate),
      predicates,
    };
  }
  return p as Predicate;
}
