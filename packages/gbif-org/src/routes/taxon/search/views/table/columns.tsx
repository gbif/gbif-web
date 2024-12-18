import { TaxonClassification } from '@/components/classification';
import { FilterSetting } from '@/components/filters/filterTools';
import { SetAsFilter } from '@/components/searchTable/components/setAsFilter';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { DynamicLink } from '@/reactRouterPlugins';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { GoSidebarExpand } from 'react-icons/go';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { SingleTaxonSearchResult } from './table';

type Args = {
  showPreview?: ((id: string) => void) | false;
  filters: Record<string, FilterSetting>;
};

export function useTaxonColumns({
  showPreview,
  filters,
}: Args): ColumnDef<SingleTaxonSearchResult>[] {
  return useMemo(() => {
    // TODO: That a filter is defined does not mean that it is active (this just prevents us from using filters that are not defined yet)
    const isFilterActive = (filterName: string) => filters[filterName] != null;

    return [
      {
        id: 'scientificName',
        header: 'filters.taxonKey.name',
        enableHiding: false,
        cell: ({ row }) => {
          const taxon = row.original;
          const vernacular = row.original.vernacularNames?.results?.[0];
          return (
            <div className="g-inline-flex g-items-center g-w-full">
              {typeof showPreview === 'function' && (
                <button
                  className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
                  onClick={(e) => {
                    // Prevent the parent link from being triggered
                    if (taxon.key) showPreview(`t_${taxon.key.toString()}`);
                    e.preventDefault();
                  }}
                >
                  <SimpleTooltip i18nKey="filterSupport.viewDetails" side="right">
                    <div className="g-flex g-items-center">
                      <GoSidebarExpand size={16} />
                    </div>
                  </SimpleTooltip>
                </button>
              )}
              <div>
                <span
                  className="g-pointer-events-auto"
                  dangerouslySetInnerHTML={{
                    __html: (row.original.formattedName ?? row.original.scientificName) as string,
                  }}
                />
                {vernacular && (
                  <SimpleTooltip
                    title={`According to ${vernacular.source}`}
                    side="right"
                    delayDuration={500}
                  >
                    <div className="g-text-slate-400 g-flex g-items-center">
                      <span className="g-me-1">{vernacular.vernacularName}</span>
                      <MdInfoOutline />
                    </div>
                  </SimpleTooltip>
                )}
              </div>
            </div>
          );
        },
        minSize: 250,
      },
      {
        id: 'taxonomicStatus',
        header: 'filters.taxonomicStatus.name',
        cell: ({ row }) => (
          <div>
            <SetAsFilter
              filterIsActive={isFilterActive('status')}
              field="status"
              value={row.original.taxonomicStatus}
            >
              {row.original.taxonomicStatus && (
                <FormattedMessage id={`enums.taxonomicStatus.${row.original.taxonomicStatus}`} />
              )}
            </SetAsFilter>
            {row.original.accepted && (
              <div className="g-text-slate-400">
                <FormattedMessage id="occurrenceFieldNames.acceptedName" />:{' '}
                <DynamicLink
                  className="g-underline g-pointer-events-auto"
                  to={`/species/${row.original.acceptedKey}`}
                >
                  {row.original.accepted}
                </DynamicLink>
              </div>
            )}
          </div>
        ),
        minSize: 150,
        meta: {
          filter: filters['status'],
        },
      },
      {
        id: 'rank',
        header: 'filters.taxonRank.name',
        cell: ({ row }) => {
          const rank = row.original.rank;
          if (!rank) return null;
          return (
            <SetAsFilter
              filterIsActive={isFilterActive('rank')}
              field="rank"
              value={row.original.rank}
            >
              <FormattedMessage id={`enums.taxonRank.${row.original.rank}`} />
            </SetAsFilter>
          );
        },
        meta: {
          filter: filters['rank'],
        },
      },
      {
        id: 'taxonomy',
        header: 'tableHeaders.parents',
        cell: ({ row }) => {
          const classification = [];
          if (row.original.kingdom)
            classification.push({ rank: 'KINGDOM', name: row.original.kingdom });
          if (row.original.phylum)
            classification.push({ rank: 'PHYLUM', name: row.original.phylum });
          if (row.original.class) classification.push({ rank: 'CLASS', name: row.original.class });
          if (row.original.order) classification.push({ rank: 'ORDER', name: row.original.order });
          if (row.original.family)
            classification.push({ rank: 'FAMILY', name: row.original.family });
          if (row.original.genus) classification.push({ rank: 'GENUS', name: row.original.genus });
          if (row.original.species)
            classification.push({ rank: 'SPECIES', name: row.original.species });
          return <TaxonClassification classification={classification} majorOnly={true} />;
        },
      },
    ];
  }, [showPreview, filters]);
}
