import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';

const DATASET_CITATION_QUERY = /* GraphQL */ `
  query DatasetCitation($key: ID!) {
    dataset(key: $key) {
      title
      citation {
        text
      }
      publishingOrganizationTitle
    }
  }
`;

type DatasetCitationResult = {
  dataset?: {
    title?: string | null;
    citation?: { text: string } | null;
    publishingOrganizationTitle?: string | null;
  } | null;
};

type DatasetCitationVariables = {
  key: string;
};

export function useDatasetCitation(key: string) {
  const { data, loading, error, load } = useQuery<DatasetCitationResult, DatasetCitationVariables>(
    DATASET_CITATION_QUERY
  );

  useEffect(() => {
    if (key) {
      load({ variables: { key } });
    }
  }, [key, load]);

  return {
    title: data?.dataset?.title,
    citation: data?.dataset?.citation?.text,
    publishingOrganizationTitle: data?.dataset?.publishingOrganizationTitle,
    loading,
    error,
  };
}
