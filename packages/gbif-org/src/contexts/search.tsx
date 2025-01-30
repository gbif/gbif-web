import React from 'react';

export type QueryTypeEnum = 'V1' | 'PREDICATE'; // | 'DATASET' | 'OCCURRENCE' | 'COLLECTION' | 'INSTITUTION' | 'PUBLISHER';
export type SearchMetadata = {
  excludedFilters?: string[];
  highlightedFilters?: string[];
  scope?: unknown;
  queryType?: QueryTypeEnum;
  availableTableColumns?: string[]; // Default all columns are available
  defaultEnabledTableColumns?: string[]; // Default is defined by the individual tabels
  tabs?: string[];
  defaultTab?: string;
};

export type OccurrenceSearchMetadata = SearchMetadata & {
  mapSettings?: {
    userLocationEnabled?: boolean;
    lat?: number;
    lng?: number;
    zoom?: number;
  };
};

export type PublisherSearchMetadata = SearchMetadata & {
  enableUserCountryInfo?: boolean;
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
