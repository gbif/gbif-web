import {
  DatasetHasValidationReportQuery,
  DatasetHasValidationReportQueryVariables,
} from '@/gql/graphql';
import { useEffect } from 'react';
import useQuery from './useQuery';

const HAS_VALIDATION_REPORT_QUERY = /* GraphQL */ `
  query DatasetHasValidationReport($datasetKey: ID!) {
    dwdpValidationReport(datasetKey: $datasetKey) {
      datasetKey
    }
  }
`;

// Not every dataset is a Darwin Core data package, and not every data package has been
// validated yet — the dataset's type alone doesn't tell us. Ask the backend directly whether a
// report exists (it 404s, mapped to null, when there isn't one) before offering a link to it.
export function useHasValidationReport(datasetKey?: string): {
  hasReport: boolean;
  isLoading: boolean;
} {
  const { data, loading, load } = useQuery<
    DatasetHasValidationReportQuery,
    DatasetHasValidationReportQueryVariables
  >(HAS_VALIDATION_REPORT_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
    notifyOnErrors: false,
  });

  useEffect(() => {
    if (datasetKey) load({ variables: { datasetKey } });
  }, [load, datasetKey]);

  return { hasReport: !!data?.dwdpValidationReport, isLoading: loading };
}
