import useFetchGet from '@/hooks/useFetchGet';
import React from 'react';
import { useIntl } from 'react-intl';
import { SearchSuggest } from './searchSuggest';

export type OrganizationOption = {
  key: string;
  title: string;
};

type Props = {
  selected?: OrganizationOption | null;
  setSelected(value: OrganizationOption | null | undefined): void;
  noSelectionPlaceholder?: React.ReactNode;
  className?: string;
};

export function OrganizationSearchSugget({
  selected,
  setSelected,
  noSelectionPlaceholder,
  className,
}: Props) {
  const intl = useIntl();
  const { load, data } = useFetchGet<Array<OrganizationOption>>({
    lazyLoad: true,
  });

  const searchOrganizations = React.useCallback(
    (searchTerm: string) => {
      load({
        endpoint: `https://api.gbif.org/v1/organization/suggest?limit=10&q=${searchTerm}`,
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
      search={searchOrganizations}
      results={data ?? []}
      labelSelector={(value) => value.title}
      keySelector={(value) => value.key}
      noSearchResultsPlaceholder={intl.formatMessage({
        id: 'search.noResults',
        defaultMessage: 'No results found',
      })}
      noSelectionPlaceholder={noSelectionPlaceholder ?? <span>Select an organization</span>}
      searchInputPlaceholder={noSelectionPlaceholder ?? 'Search organizations...'}
    />
  );
}
