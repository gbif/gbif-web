import { getAsQuery } from '@/components/filters/filterTools';
import { GbifLogoIcon } from '@/components/icons/icons';
import { Spinner } from '@/components/ui/spinner';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import {
  LiteratureWidgetButtonSearchQuery,
  LiteratureWidgetButtonSearchQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useContext, useEffect } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { searchConfig } from '../literature/search/searchConfig';

export const LITERATURE_WIDGET_BUTTON_SEARCH = /* GraphQL */ `
  query LiteratureWidgetButtonSearch($predicate: Predicate) {
    literatureSearch(predicate: $predicate) {
      documents {
        total
      }
    }
  }
`;

export function LiteratureButtonInner() {
  const searchContext = useSearchContext();
  const filterContext = useContext(FilterContext);
  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const [searchParams] = useSearchParams();
  const config = useConfig();

  const { data, load, loading } = useQuery<
    LiteratureWidgetButtonSearchQuery,
    LiteratureWidgetButtonSearchQueryVariables
  >(LITERATURE_WIDGET_BUTTON_SEARCH, {
    throwAllErrors: true,
    lazyLoad: true,
    keepDataWhileLoading: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });

    load({
      variables: {
        ...query,
      },
    });

    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, filterHash, searchContext]);

  return (
    <SearchContextProvider searchContext={config.literatureSearch}>
      <a
        target="_parent"
        href={`${import.meta.env.PUBLIC_BASE_URL}/literature/search?${
          (searchParams.toString(), '_blank')
        }`}
        className="g-bg-primary-500 g-border g-border-solid g-border-primary-600 g-text-white g-text-sm g-px-2 g-py-1 g-w-full g-h-[100vh] g-items-center g-text-center g-flex g-justify-center"
      >
        <GbifLogoIcon className="g-w-4 g-h-4 g-inline-block g-mr-1" />
        {loading || !data ? (
          <Spinner />
        ) : (
          <FormattedMessage
            id="counts.nCitations"
            defaultMessage="{count} citations"
            values={{ count: <FormattedNumber value={data?.literatureSearch?.documents.total} /> }}
          />
        )}
      </a>
    </SearchContextProvider>
  );
}

export const LiteratureButton = () => {
  const config = useConfig();
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['from'],
  });
  return (
    <SearchContextProvider searchContext={config.literatureSearch}>
      <FilterProvider filter={filter} onChange={setFilter}>
        <LiteratureButtonInner />
      </FilterProvider>
    </SearchContextProvider>
  );
};
