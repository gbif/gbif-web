import { TaxonClassification } from '@/components/classification';
import { ColumnDef, SetAsFilter } from '@/components/searchTable';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { DynamicLink } from '@/reactRouterPlugins';
import { useMemo } from 'react';
import { GoSidebarExpand } from 'react-icons/go';
import { MdInfoOutline, MdLock, MdLockOpen } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { SingleTaxonSearchResult } from './table';

type Args = {
  showPreview?: ((id: string) => void) | false;
};

export function useTaxonColumns({ showPreview }: Args): ColumnDef<SingleTaxonSearchResult>[] {
  return useMemo(() => {
    const columns: ColumnDef<SingleTaxonSearchResult>[] = [
      {
        id: 'scientificName',
        header: 'filters.taxonKey.name',
        disableHiding: true,
        minWidth: 250,
        cell: (taxon) => {
          const vernacular = taxon.vernacularNames?.results?.[0];
          return (
            <div className="g-inline-flex g-items-center g-w-full">
              {typeof showPreview === 'function' && (
                <button
                  className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
                  onClick={(e) => {
                    // Prevent the parent link from being triggered
                    if (taxon.key) showPreview(taxon?.key?.toString());
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
                    __html: (taxon.formattedName || taxon.scientificName) as string,
                  }}
                />
                {vernacular && (
                  <SimpleTooltip
                    title={`According to ${vernacular.source}`}
                    side="right"
                    delayDuration={500}
                  >
                    <div className="g-ml-1 g-text-slate-400 g-flex g-items-center">
                      <span className="g-me-1">{vernacular.vernacularName}</span>
                      <MdInfoOutline />
                    </div>
                  </SimpleTooltip>
                )}
              </div>
            </div>
          );
        },
        AdditionalContent: ({
          hideFirstColumnLock,
          setFirstColumnIsLocked,
          firstColumnIsLocked,
        }) => {
          return (
            <>
              {!hideFirstColumnLock && (
                <SimpleTooltip
                  side="bottom"
                  asChild
                  i18nDefaultMessage={firstColumnIsLocked ? 'Unlock column' : 'Lock column'}
                  i18nKey={
                    firstColumnIsLocked ? 'search.table.unlockColumn ' : 'search.table.lockColumn'
                  }
                >
                  <button onClick={() => setFirstColumnIsLocked((v) => !v)}>
                    {firstColumnIsLocked ? <MdLock /> : <MdLockOpen />}
                  </button>
                </SimpleTooltip>
              )}
            </>
          );
        },
      },
      {
        id: 'taxonomicStatus',
        header: 'filters.taxonomicStatus.name',
        filterKey: 'status', // default is same as id
        cell: ({ taxonomicStatus, accepted, acceptedKey }) => (
          <div>
            <SetAsFilter field="status" value={taxonomicStatus}>
              {taxonomicStatus && (
                <FormattedMessage id={`enums.taxonomicStatus.${taxonomicStatus}`} />
              )}
            </SetAsFilter>
            {accepted && (
              <div className="g-text-slate-400">
                <FormattedMessage id="occurrenceFieldNames.acceptedName" />:{' '}
                <DynamicLink
                  className="g-underline g-pointer-events-auto"
                  // TODO: This link is using two methods of navigation (pageid + variables method and to method). One should be removed
                  to={`/species/${acceptedKey}`}
                  pageId="speciesKey"
                  variables={{ key: acceptedKey }}
                >
                  {accepted}
                </DynamicLink>
              </div>
            )}
          </div>
        ),
        minWidth: 150,
      },
      {
        id: 'rank',
        header: 'filters.taxonRank.name',
        cell: ({ rank }) => {
          if (!rank) return null;
          return (
            <SetAsFilter field="rank" value={rank}>
              <FormattedMessage id={`enums.taxonRank.${rank}`} />
            </SetAsFilter>
          );
        },
      },
      {
        id: 'taxonomy',
        header: 'tableHeaders.parents',
        cell: (taxon) => {
          const classification = [];
          if (taxon.kingdom) classification.push({ rank: 'KINGDOM', name: taxon.kingdom });
          if (taxon.phylum) classification.push({ rank: 'PHYLUM', name: taxon.phylum });
          if (taxon.class) classification.push({ rank: 'CLASS', name: taxon.class });
          if (taxon.order) classification.push({ rank: 'ORDER', name: taxon.order });
          if (taxon.family) classification.push({ rank: 'FAMILY', name: taxon.family });
          if (taxon.genus) classification.push({ rank: 'GENUS', name: taxon.genus });
          if (taxon.species) classification.push({ rank: 'SPECIES', name: taxon.species });
          return <TaxonClassification classification={classification} majorOnly={true} />;
        },
      },
    ];

    return columns;
  }, [showPreview]);
}
