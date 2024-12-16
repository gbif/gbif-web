import { FilterSetting } from '@/components/filters/filterTools';
import { ColumnDef } from '@tanstack/react-table';
import { SingleLiteratureSearchResult } from '.';
import { useMemo } from 'react';
import { SetAsFilter } from '@/components/searchTable/components/setAsFilter';
import { MdLink } from 'react-icons/md';
import { notNull } from '@/utils/notNull';
import { SetAsFilterList } from '@/components/searchTable/components/setAsFilterList';
import { FormattedMessage } from 'react-intl';

type Args = {
  filters: Record<string, FilterSetting>;
  disableCellFilters?: boolean;
};

function getLink(item: SingleLiteratureSearchResult) {
  if (item.identifiers?.doi) {
    return `https://doi.org/${item.identifiers.doi}`;
  }
  return item.websites?.[0];
}

export function useLiteratureColumns({
  filters,
  disableCellFilters,
}: Args): ColumnDef<SingleLiteratureSearchResult>[] {
  return useMemo(() => {
    // TODO: That a filter is defined does not mean that it is active (this just prevents us from using filters that are not defined yet)
    const isFilterActive = (filterName: string) =>
      !disableCellFilters && filters[filterName] != null;

    const columns: ColumnDef<SingleLiteratureSearchResult>[] = [
      {
        id: 'titleAndAbstract',
        header: 'tableHeaders.titleAndAbstract',
        enableHiding: false,
        minSize: 250,
        cell: ({ row }) => {
          const item = row.original;
          const maxLength = 200;
          const truncatedAbstract =
            item.abstract != null && item.abstract.length > maxLength
              ? `${item.abstract.substr(0, maxLength)}...`
              : item.abstract;
          const link = getLink(item);

          return (
            <>
              <div>
                {link == null ? (
                  item.title
                ) : (
                  <a href={link} className="g-pointer-events-auto">
                    {item.title} <MdLink />
                  </a>
                )}
              </div>
              <span className="g-text-sm g-text-gray-500">{truncatedAbstract}</span>
            </>
          );
        },
      },
      {
        id: 'literatureType',
        header: 'filters.literatureType.name',
        cell: ({ row }) => {
          const { literatureType } = row.original;
          if (!literatureType) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('literatureType')}
              field="literatureType"
              value={literatureType}
            >
              <FormattedMessage id={`enums.literatureType.${literatureType}`} />
            </SetAsFilter>
          );
        },
        meta: {
          filter: filters['literatureType'],
        },
      },
      {
        id: 'year',
        header: 'filters.year.name',
        cell: ({ row }) => {
          const { year } = row.original;
          if (!year) return null;

          return (
            <SetAsFilter filterIsActive={isFilterActive('year')} field="year" value={year}>
              {year}
            </SetAsFilter>
          );
        },
        meta: {
          filter: filters['year'],
        },
      },
      {
        id: 'relevance',
        header: 'filters.relevance.name',
        cell: ({ row }) => {
          const relevance = row.original.relevance?.filter(notNull);
          if (!relevance) return null;

          return (
            <SetAsFilterList
              filterIsActive={isFilterActive('relevance')}
              field="relevance"
              items={relevance}
              renderValue={(value) => <FormattedMessage id={`enums.relevance.${value}`} />}
            />
          );
        },
        meta: {
          filter: filters['relevance'],
        },
      },
      {
        id: 'topics',
        header: 'filters.topics.name',
        cell: ({ row }) => {
          const topics = row.original.topics?.filter(notNull);
          if (!topics) return null;

          return (
            <SetAsFilterList
              items={topics}
              field="topics"
              filterIsActive={isFilterActive('topics')}
              renderValue={(value) => <FormattedMessage id={`enums.topics.${value}`} />}
            />
          );
        },
        meta: {
          filter: filters['topics'],
        },
      },
    ];

    return columns;
  }, [disableCellFilters, filters]);
}
