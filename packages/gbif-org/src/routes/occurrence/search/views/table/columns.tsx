import { SetAsFilter } from '@/components/searchTable/components/setAsFilter';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { DynamicLink } from '@/reactRouterPlugins';
import { ColumnDef } from '@tanstack/react-table';
import { useContext, useMemo } from 'react';
import { GoSidebarExpand } from 'react-icons/go';
import { FilterSetting } from '@/components/filters/filterTools';
import { FormattedMessage } from 'react-intl';
import { FilterContext } from '@/contexts/filter';
import { FormattedDateRange } from '@/components/message';
import { SingleOccurrenceSearchResult } from '.';
import { LinkOption } from '@/components/searchTable/components/linkOption';

type Args = {
  showPreview?: ((id: string) => void) | false;
  filters: Record<string, FilterSetting>;
};

export function useOccurrenceColumns({
  showPreview,
  filters,
}: Args): ColumnDef<SingleOccurrenceSearchResult>[] {
  const { add } = useContext(FilterContext);

  return useMemo(() => {
    // TODO: That a filter is defined does not mean that it is active (this just prevents us from using filters that are not defined yet)
    const isFilterActive = (filterName: string) => filters[filterName] != null;

    return [
      {
        id: 'scientificName',
        header: 'Scientific name',
        enableHiding: false,
        cell: ({ row }) => {
          const occurrence = row.original;

          return (
            <DynamicLink
              to={`/occurrence/${occurrence.key}`}
              className="g-inline-flex g-items-center g-w-full g-h-full g-p-2"
            >
              {typeof showPreview === 'function' && (
                <button
                  className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center"
                  onClick={(e) => {
                    // Prevent the parent link from being triggered
                    if (occurrence.key) showPreview(`0_${occurrence.key.toString()}`);
                    e.preventDefault();
                  }}
                >
                  <SimpleTooltip title="View details" side="right">
                    <div className="g-flex g-items-center">
                      <GoSidebarExpand size={16} />
                    </div>
                  </SimpleTooltip>
                </button>
              )}
              <div>
                <SetAsFilter
                  filterIsActive={isFilterActive('taxonKey')}
                  applyFilter={() => add('taxonKey', row.original.taxonKey)}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: row.original.gbifClassification?.usage?.formattedName as string,
                    }}
                  />
                </SetAsFilter>
                {occurrence.hasTaxonIssues && (
                  <SimpleTooltip
                    side="right"
                    title={
                      <span>
                        <FormattedMessage id="filterSupport.nameWithTaxonMatchIssue" />
                      </span>
                    }
                  >
                    <div style={{ color: '#fea600' }} className="g-cursor-default" data-loader>
                      {occurrence.gbifClassification?.verbatimScientificName}
                    </div>
                  </SimpleTooltip>
                )}
              </div>
            </DynamicLink>
          );
        },
        minSize: 250,
        meta: {
          noCellPadding: true,
          filter: filters['taxonKey'],
        },
      },
      // TODO
      // {
      //   id: 'features',
      //   header: 'Features',
      // },
      {
        id: 'country',
        header: 'Country or area',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('country')}
            applyFilter={() => add('country', row.original.countryCode)}
          >
            {row.original.countryCode && (
              <FormattedMessage id={`enums.countryCode.${row.original.countryCode}`} />
            )}
          </SetAsFilter>
        ),
        minSize: 150,
        meta: {
          filter: filters['country'],
        },
      },
      {
        id: 'coordinates',
        header: 'Coordinates',
        accessorKey: 'formattedCoordinates',
        cell: ({ row }) => {
          const formattedCoordinates = row.original.formattedCoordinates;
          if (!formattedCoordinates) return null;
          return <span className="g-text-nowrap">{formattedCoordinates}</span>;
        },
        meta: {
          filter: filters['coordinates'],
        },
      },
      {
        id: 'year',
        header: 'Year',
        cell: ({ row }) => {
          return (
            <SetAsFilter
              filterIsActive={isFilterActive('year')}
              // TODO How do we add a date range to the filter?
              applyFilter={() =>
                add('year', new Date(row.original.eventDate!)?.getFullYear().toString())
              }
            >
              <FormattedDateRange
                date={row.original.eventDate ?? undefined}
                format={{ year: 'numeric' }}
              />
            </SetAsFilter>
          );
        },
        meta: {
          filter: filters['year'],
        },
      },
      {
        id: 'eventDate',
        header: 'Event date',
        accessorKey: 'eventDate',
        cell: ({ row }) => {
          const eventDate = row.original.eventDate;
          if (!eventDate) return null;
          return (
            <span className="g-text-nowrap">
              <FormattedDateRange date={eventDate} />
            </span>
          );
        },
        meta: {
          filter: filters['eventDate'],
        },
      },
      {
        id: 'basisOfRecord',
        header: 'Basis of record',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('basisOfRecord')}
            applyFilter={() => add('basisOfRecord', row.original.basisOfRecord)}
          >
            <FormattedMessage id={`enums.basisOfRecord.${row.original.basisOfRecord}`} />
          </SetAsFilter>
        ),
        meta: {
          filter: filters['basisOfRecord'],
        },
      },
      {
        id: 'dataset',
        header: 'Dataset',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('year')}
            applyFilter={() => add('dataset', row.original.datasetKey)}
          >
            {row.original.datasetTitle}
          </SetAsFilter>
        ),
        minSize: 200,
        meta: {
          filter: filters['dataset'],
        },
      },
      {
        id: 'publisher',
        header: 'Publisher',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('publisherKey')}
            applyFilter={() => add('publisherKey', row.original.publishingOrgKey)}
          >
            {row.original.publisherTitle}
          </SetAsFilter>
        ),
        minSize: 150,
        meta: {
          filter: filters['publisher'],
        },
      },
      {
        id: 'catalogNumber',
        header: 'Catalog number',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('catalogNumber')}
            applyFilter={() => add('catalogNumber', row.original.catalogNumber)}
          >
            {row.original.catalogNumber}
          </SetAsFilter>
        ),
        meta: {
          filter: filters['catalogNumber'],
        },
      },
      {
        id: 'recordedBy',
        header: 'Recorded by',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('recordedBy')}
            applyFilter={() => add('recordedBy', row.original.recordedBy)}
          >
            {row.original.recordedBy}
          </SetAsFilter>
        ),
        meta: {
          filter: filters['recordedBy'],
        },
      },
      {
        id: 'identifiedBy',
        header: 'Identified by',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('identifiedBy')}
            applyFilter={() => add('identifiedBy', row.original.identifiedBy)}
          >
            {row.original.identifiedBy}
          </SetAsFilter>
        ),
        meta: {
          filter: filters['identifiedBy'],
        },
      },
      {
        id: 'recordNumber',
        header: 'Record number',
        accessorKey: 'recordNumber',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('recordNumber')}
            applyFilter={() => add('recordNumber', row.original.recordNumber)}
          >
            {row.original.recordNumber}
          </SetAsFilter>
        ),
        meta: {
          filter: filters['recordNumber'],
        },
      },
      {
        id: 'typeStatus',
        header: 'Type status',
        accessorKey: 'typeStatus',
        meta: {
          filter: filters['typeStatus'],
        },
      },
      {
        id: 'preparations',
        header: 'Preparations',
        accessorKey: 'preparations',
        meta: {
          filter: filters['preparations'],
        },
      },
      {
        id: 'collectionCode',
        header: 'Collection code',
        cell: ({ row }) => {
          const collection = row.original.collection;
          if (!collection) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('collectionCode')}
              applyFilter={() => add('collectionCode', collection.code)}
            >
              {collection.code}
            </SetAsFilter>
          );
        },
        meta: {
          filter: filters['collectionCode'],
        },
      },
      {
        id: 'institutionCode',
        header: 'Institution code',
        cell: ({ row }) => {
          const institution = row.original.institution;
          if (!institution) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('institutionCode')}
              applyFilter={() => add('institutionCode', institution?.code)}
            >
              {institution?.code}
            </SetAsFilter>
          );
        },
        meta: {
          filter: filters['institutionCode'],
        },
      },
      {
        id: 'institutionKey',
        header: 'Institution Key',
        cell: ({ row }) => {
          const institution = row.original.institution;
          if (!institution) return null;

          return (
            <LinkOption to={`/institution/${institution.key}`}>
              <SetAsFilter
                filterIsActive={isFilterActive('institutionKey')}
                applyFilter={() => add('institutionKey', institution.key)}
              >
                <span>
                  {institution.name} <span>{institution.code}</span>
                </span>
              </SetAsFilter>
            </LinkOption>
          );
        },
        meta: {
          filter: filters['institutionKey'],
        },
      },
      {
        id: 'collectionKey',
        header: 'Collection Key',
        cell: ({ row }) => {
          const collection = row.original.collection;
          if (!collection) return null;

          return (
            <LinkOption to={`/collection/${collection.key}`}>
              <SetAsFilter
                filterIsActive={isFilterActive('collectionCode')}
                applyFilter={() => add('collectionCode', collection.code)}
              >
                <span>
                  {collection.name} <span>({collection.code})</span>
                </span>
              </SetAsFilter>
            </LinkOption>
          );
        },
        meta: {
          filter: filters['collectionKey'],
        },
      },
      {
        id: 'locality',
        header: 'Locality',
        accessorKey: 'locality',
        meta: {
          filter: filters['locality'],
        },
      },
      {
        id: 'higherGeography',
        header: 'Higher Geography',
        accessorKey: 'higherGeography',
        meta: {
          filter: filters['higherGeography'],
        },
      },
      {
        id: 'stateProvince',
        header: 'State/Province',
        cell: ({ row }) => {
          const stateProvince = row.original.stateProvince;
          if (!stateProvince) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('stateProvince')}
              applyFilter={() => add('stateProvince', stateProvince)}
            >
              {stateProvince}
            </SetAsFilter>
          );
        },
        accessorKey: 'stateProvince',
        meta: {
          filter: filters['stateProvince'],
        },
      },
      {
        id: 'establishmentMeans',
        header: 'Establishment Means',
        cell: ({ row }) => {
          const establishmentMeans = row.original.establishmentMeans;
          if (!establishmentMeans) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('establishmentMeans')}
              applyFilter={() => add('establishmentMeans', establishmentMeans)}
            >
              <FormattedMessage id={`enums.establishmentMeans.${establishmentMeans}`} />
            </SetAsFilter>
          );
        },
        meta: {
          filter: filters['establishmentMeans'],
        },
      },
      {
        id: 'iucnRedListCategory',
        header: 'IUCN Red List Category',
        cell: ({ row }) => {
          const iucnRedListCategory = row.original.iucnRedListCategory;
          if (!iucnRedListCategory) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('iucnRedListCategory')}
              applyFilter={() => add('iucnRedListCategory', iucnRedListCategory)}
            >
              <FormattedMessage id={`enums.iucnRedListCategory.${iucnRedListCategory}`} />
            </SetAsFilter>
          );
        },
        accessorKey: 'iucnRedListCategory',
        meta: {
          filter: filters['iucnRedListCategory'],
        },
      },
      {
        id: 'datasetName',
        header: 'Dataset Name',
        accessorKey: 'datasetName',
        meta: {
          filter: filters['datasetName'],
        },
      },
    ];
  }, [showPreview, filters, add]);
}
