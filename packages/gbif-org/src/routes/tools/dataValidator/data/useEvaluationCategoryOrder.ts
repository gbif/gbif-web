import type { DataValidatorEvaluationCategoriesQuery } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';

const EVALUATION_CATEGORIES_QUERY = /* GraphQL */ `
  query DataValidatorEvaluationCategories {
    validationEvaluationCategories
  }
`;

// undefined until loaded, or when the enumeration cannot be fetched
export function useEvaluationCategoryOrder(): string[] | undefined {
  const { data } = useQuery<DataValidatorEvaluationCategoriesQuery, Record<string, never>>(
    EVALUATION_CATEGORIES_QUERY
  );
  const order = data?.validationEvaluationCategories;
  return order && order.length > 0 ? order : undefined;
}
