import { TaxonClassification } from '@/components/classification';
import { ColumnDef, SetAsFilter } from '@/components/searchTable';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { DynamicLink } from '@/reactRouterPlugins';
import { useMemo } from 'react';
import { GoSidebarExpand } from 'react-icons/go';
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
          const vernacular = taxon.vernacularName?.vernacularName;
          return (
            <div className="g-inline-flex g-items-center g-w-full">
              {typeof showPreview === 'function' &&
                taxon?.datasetKey === import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY && (
                  <button
                    className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
                    onClick={(e) => {
                      // Prevent the parent link from being triggered
                      if (taxon?.taxonID != null) showPreview(taxon?.taxonID?.toString());
                      e.preventDefault();
                    }}
                  >
                    <SimpleTooltip i18nKey="filterSupport.viewDetails" side="right" asChild>
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
                    __html: taxon.label as string,
                  }}
                />
                {vernacular && (
                  <div className="g-ml-1 g-text-slate-400 g-flex g-items-center">
                    <span className="g-me-1">{vernacular}</span>
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: 'taxonomicStatus',
        header: 'filters.taxonomicStatus.name',
        filterKey: 'status', // default is same as id
        cell: (taxon) => {
          if (!taxon) return null;
          const { classification } = taxon;
          // taxonapi hack: the API is awkward here. We need to extract the accepted name from the classification which doesn't live under the taxon.
          const { taxonomicStatus, acceptedNameUsageID } = taxon;
          const lastClassification = classification?.[classification.length - 1];
          return (
            <div>
              <SetAsFilter field="taxonomicStatus" value={taxonomicStatus}>
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
                    pageId="taxonKey"
                    variables={{ key: acceptedNameUsageID, datasetKey: taxon.datasetKey ?? '' }}
                  >
                    {lastClassification?.scientificName}
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
        cell: (taxon) => {
          if (!taxon || !taxon.taxonRank) return null;
          const { taxonRank } = taxon;
          return (
            <SetAsFilter field="taxonRank" value={taxonRank}>
              <FormattedMessage id={`enums.taxonRank.${taxonRank}`} />
            </SetAsFilter>
          );
        },
      },
      {
        id: 'taxonomy',
        header: 'tableHeaders.parents',
        minWidth: 350,
        cell: (taxon) => {
          const classification = taxon?.classification?.map((x) => ({
            rank: x.taxonRank,
            name: x.scientificName,
          }));
          return classification ? (
            <TaxonClassification classification={classification} majorOnly={true} />
          ) : null;
        },
      },
    ];

    return columns;
  }, [showPreview]);
}
