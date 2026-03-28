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

const hasHighlightsInTaxonomy = (taxon) => {
  if (!taxon) return false;
  let hl = false;
  return ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species'].some((rank) => {
    if (taxon?.[rank] && taxon?.[rank].includes('<em class="gbifHl">')) {
      hl = true;
    }
    return hl;
  });
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
          const vernacular = taxon.vernacularName?.vernacularName;
          const hasHlInTaxonomy = hasHighlightsInTaxonomy(taxon);
          return (
            <div className="g-inline-flex g-items-center g-w-full">
              {typeof showPreview === 'function' && (
                <button
                  className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
                  onClick={(e) => {
                    // Prevent the parent link from being triggered
                    if (taxon.taxon?.taxonID != null)
                      showPreview(taxon?.taxon?.taxonID?.toString());
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
                    __html: taxon.taxon?.label as string,
                  }}
                />
                {vernacular && (
                  <div className="g-ml-1 g-text-slate-400 g-flex g-items-center">
                    <span className="g-me-1">{vernacular}</span>
                    <MdInfoOutline />
                  </div>
                )}
              </div>
            </div>
          );
        },
        Actions: ({ hideFirstColumnLock, setFirstColumnIsLocked, firstColumnIsLocked }) => {
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
        cell: ({ taxon }) => {
          if (!taxon) return null;
          const { taxonomicStatus, acceptedNameUsage, acceptedNameUsageID } = taxon;
          return (
            <div>
              <SetAsFilter field="status" value={taxonomicStatus}>
                {taxonomicStatus && (
                  <FormattedMessage id={`enums.taxonomicStatus.${taxonomicStatus}`} />
                )}
              </SetAsFilter>
              {acceptedNameUsageID && (
                <div className="g-text-slate-400">
                  <FormattedMessage id="occurrenceFieldNames.acceptedName" />:{' '}
                  <DynamicLink
                    className="g-underline g-pointer-events-auto"
                    // TODO: This link is using two methods of navigation (pageid + variables method and to method). One should be removed
                    to={`/species/${acceptedNameUsageID}`}
                    pageId="speciesKey"
                    variables={{ key: acceptedNameUsageID }}
                  >
                    {acceptedNameUsage}
                  </DynamicLink>
                </div>
              )}
            </div>
          );
        },
        minWidth: 150,
      },
      {
        id: 'rank',
        header: 'filters.taxonRank.name',
        cell: ({ taxon }) => {
          if (!taxon || !taxon.taxonRank) return null;
          const { taxonRank } = taxon;
          return (
            <SetAsFilter field="rank" value={taxonRank}>
              <FormattedMessage id={`enums.taxonRank.${taxonRank}`} />
            </SetAsFilter>
          );
        },
      },
      {
        id: 'taxonomy',
        header: 'tableHeaders.parents',
        cell: (taxon) => {
          const classification = taxon?.classification?.map((x) => ({
            rank: x.taxonRank,
            name: x.scientificName,
          }));
          return <TaxonClassification classification={classification} majorOnly={true} />;
        },
      },
    ];

    return columns;
  }, [showPreview]);
}
