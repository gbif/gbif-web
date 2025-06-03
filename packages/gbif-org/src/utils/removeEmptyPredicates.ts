import { Predicate } from '@/gql/graphql';
import { isNullOrUndefined } from './isNullOrUndefined';

export function removeEmptyPredicates(predicate: unknown): Predicate | undefined {
  if (isNullOrUndefined(predicate)) {
    return undefined;
  }
  // if predicate has a property called predicate, but it is empty, then return undefined
  if (
    Object.prototype.hasOwnProperty.call(predicate, 'predicate') &&
    isNullOrUndefined(predicate?.predicate)
  ) {
    return undefined;
  }

  if (Array.isArray(predicate?.predicates)) {
    const predicates = predicate.predicates
      .filter((p) => !isNullOrUndefined(p))
      .map(removeEmptyPredicates)
      .filter((p) => !isNullOrUndefined(p));
    if (!predicates || predicates.length === 0) {
      return undefined;
    }
    return {
      ...predicate,
      predicates,
    };
  }
  return predicate;
}
