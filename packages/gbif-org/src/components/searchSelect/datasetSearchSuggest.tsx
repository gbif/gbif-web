import useFetchGet from '@/hooks/useFetchGet';
import React from 'react';
import { useIntl } from 'react-intl';
import { SearchSuggest } from './searchSuggest';

export type DatasetOption = {
  key: string;
  title: string;
};

type Props = {
  selected?: DatasetOption | null;
  setSelected(value: DatasetOption | null | undefined): void;
  noSelectionPlaceholder?: React.ReactNode;
  className?: string;
};

export function DatasetSearchSuggest({
  selected,
  setSelected,
  noSelectionPlaceholder,
  className,
}: Props) {
  const intl = useIntl();
  const { load, data } = useFetchGet<Array<DatasetOption>>({
    lazyLoad: true,
  });

  const searchDatasets = React.useCallback(
    (searchTerm: string) => {
      load({
        endpoint: `${import.meta.env.PUBLIC_API_V1}/dataset/suggest?limit=20&q=${encodeURIComponent(
          searchTerm
        )}`,
        keepDataWhileLoading: true,
      });
    },
    [load]
  );

  return (
    <SearchSuggest
      className={className}
      setSelected={setSelected}
      selected={selected}
      search={searchDatasets}
      results={data ?? []}
      labelSelector={(value) => value.title}
      keySelector={(value) => value.key}
      noSearchResultsPlaceholder={intl.formatMessage({
        id: 'search.noResults',
        defaultMessage: 'No results found',
      })}
      noSelectionPlaceholder={noSelectionPlaceholder ?? <span>Select a dataset</span>}
      searchInputPlaceholder={intl.formatMessage({
        id: 'tools.validationReport.searchDatasetsPlaceholder',
        defaultMessage: 'Search datasets...',
      })}
    />
  );
}
