import React from 'react';

export type QueryTypeEnum = 'V1' | 'PREDICATE'; // | 'DATASET' | 'OCCURRENCE' | 'COLLECTION' | 'INSTITUTION' | 'PUBLISHER';
export type SearchMetadata = {
  excludedFilters?: string[];
  highlightedFilters?: string[];
  scope?: unknown;
  queryType?: QueryTypeEnum;
  availableTableColumns?: string[]; // Default all columns are available
  defaultEnabledTableColumns?: string[]; // TODO: What should the default value be?
  tabs?: string[];
  defaultTab?: string;
};

export type OccurrenceSearchMetadata = SearchMetadata & {
  mapSettings?: {
    lat: number;
    lng: number;
    zoom: number;
  };
};

const SearchMetadataContext = React.createContext<SearchMetadata | null>(null);

type Props = {
  children?: React.ReactNode;
  searchContext?: SearchMetadata;
};

export function SearchContextProvider({ searchContext, children }: Props) {
  return (
    <SearchMetadataContext.Provider value={searchContext ?? {}}>
      {children}
    </SearchMetadataContext.Provider>
  );
}

export function useSearchContext() {
  const searchContext = React.useContext(SearchMetadataContext);

  if (!searchContext) {
    throw new Error('useSearchContext must be used within a SearchContextProvider');
  }

  return searchContext;
}
