import { SetAsFilter } from '@/components/searchTable/components/setAsFilter';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { GoSidebarExpand } from 'react-icons/go';
import { FilterSetting } from '@/components/filters/filterTools';
import { FormattedMessage } from 'react-intl';
import { FormattedDateRange } from '@/components/message';
import { SingleOccurrenceSearchResult } from '.';
import { LinkOption } from '@/components/searchTable/components/linkOption';
import { IconFeatures } from './iconFeatures';

type Args = {
  showPreview?: ((id: string) => void) | false;
  filters: Record<string, FilterSetting>;
};

export function useOccurrenceColumns({
  showPreview,
  filters,
}: Args): ColumnDef<SingleOccurrenceSearchResult>[] {
  return useMemo(() => {
    // TODO: That a filter is defined does not mean that it is active (this just prevents us from using filters that are not defined yet)
    const isFilterActive = (filterName: string) => filters[filterName] != null;

    return [
      {
        id: 'scientificName',
        header: 'filters.taxonKey.name',
        enableHiding: false,
        cell: ({ row }) => {
          const occurrence = row.original;

          return (
            <div className="g-inline-flex g-items-center g-w-full g-h-full">
              {typeof showPreview === 'function' && (
                <button
                  className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center"
                  onClick={(e) => {
                    // Prevent the parent link from being triggered
                    if (occurrence.key) showPreview(`0_${occurrence.key.toString()}`);
                    e.preventDefault();
                  }}
                >
                  <SimpleTooltip
                    title={<FormattedMessage id="filterSupport.viewDetails" />}
                    side="right"
                  >
                    <div className="g-flex g-items-center">
                      <GoSidebarExpand size={16} />
                    </div>
                  </SimpleTooltip>
                </button>
              )}
              <div>
                <SetAsFilter
                  filterIsActive={isFilterActive('taxonKey')}
                  field="taxonKey"
                  value={row.original.taxonKey}
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
            </div>
          );
        },
        minSize: 250,
        meta: {
          noCellPadding: true,
          filter: filters['taxonKey'],
        },
      },
      {
        id: 'features',
        header: 'tableHeaders.features',
        cell: ({ row }) => {
          const occurrence = row.original;
          return (
            <IconFeatures
              iconsOnly
              stillImageCount={occurrence.stillImageCount}
              movingImageCount={occurrence.movingImageCount}
              soundCount={occurrence.soundCount}
              typeStatus={occurrence.typeStatus}
              isSequenced={occurrence.volatile?.features?.isSequenced}
              isTreament={occurrence.volatile?.features?.isTreament}
              isClustered={occurrence.volatile?.features?.isClustered}
              isSamplingEvent={occurrence.volatile?.features?.isSamplingEvent}
              issueCount={occurrence?.issues?.length}
            />
          );
        },
      },
      {
        id: 'country',
        header: 'filters.occurrenceCountry.name',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('country')}
            field="country"
            value={row.original.countryCode}
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
        header: 'filters.coordinates.name',
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
        header: 'filters.year.name',
        cell: ({ row }) => {
          return (
            <SetAsFilter
              filterIsActive={isFilterActive('year')}
              // TODO How do we add a date range to the filter?
              field="year"
              value={new Date(row.original.eventDate!)?.getFullYear().toString()}
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
        header: 'filters.eventDate.name',
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
        header: 'filters.basisOfRecord.name',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('basisOfRecord')}
            field="basisOfRecord"
            value={row.original.basisOfRecord}
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
        header: 'filters.datasetKey.name',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('dataset')}
            field="dataset"
            value={new Date(row.original.eventDate!)?.getFullYear().toString()}
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
        header: 'filters.publisherKey.name',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('publisherKey')}
            field="publisherKey"
            value={row.original.publishingOrgKey}
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
        header: 'filters.catalogNumber.name',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('catalogNumber')}
            field="catalogNumber"
            value={row.original.catalogNumber}
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
        header: 'filters.recordedBy.name',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('recordedBy')}
            field="recordedBy"
            value={row.original.recordedBy}
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
        header: 'filters.identifiedBy.name',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('identifiedBy')}
            field="identifiedBy"
            value={row.original.identifiedBy}
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
        header: 'filters.recordNumber.name',
        accessorKey: 'recordNumber',
        cell: ({ row }) => (
          <SetAsFilter
            filterIsActive={isFilterActive('recordNumber')}
            field="recordNumber"
            value={row.original.recordNumber}
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
        header: 'filters.typeStatus.name',
        accessorKey: 'typeStatus',
        meta: {
          filter: filters['typeStatus'],
        },
      },
      {
        id: 'preparations',
        header: 'occurrenceFieldNames.preparations',
        accessorKey: 'preparations',
        meta: {
          filter: filters['preparations'],
        },
      },
      {
        id: 'collectionCode',
        header: 'occurrenceFieldNames.collectionCode',
        cell: ({ row }) => {
          const collection = row.original.collection;
          if (!collection) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('collectionCode')}
              field="collectionCode"
              value={collection.code}
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
        header: 'occurrenceFieldNames.institutionCode',
        cell: ({ row }) => {
          const institution = row.original.institution;
          if (!institution) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('institutionCode')}
              field="institutionCode"
              value={institution.code}
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
        header: 'tableHeaders.institution',
        cell: ({ row }) => {
          const institution = row.original.institution;
          if (!institution) return null;

          return (
            <LinkOption to={`/institution/${institution.key}`}>
              <SetAsFilter
                filterIsActive={isFilterActive('institutionKey')}
                field="institutionKey"
                value={institution.key}
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
        header: 'tableHeaders.collection',
        cell: ({ row }) => {
          const collection = row.original.collection;
          if (!collection) return null;

          return (
            <LinkOption to={`/collection/${collection.key}`}>
              <SetAsFilter
                filterIsActive={isFilterActive('collectionCode')}
                field="collectionCode"
                value={collection.code}
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
        header: 'occurrenceFieldNames.locality',
        accessorKey: 'locality',
        meta: {
          filter: filters['locality'],
        },
      },
      {
        id: 'higherGeography',
        header: 'occurrenceFieldNames.higherGeography',
        accessorKey: 'higherGeography',
        meta: {
          filter: filters['higherGeography'],
        },
      },
      {
        id: 'stateProvince',
        header: 'occurrenceFieldNames.stateProvince',
        cell: ({ row }) => {
          const stateProvince = row.original.stateProvince;
          if (!stateProvince) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('stateProvince')}
              field="stateProvince"
              value={stateProvince}
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
        header: 'occurrenceFieldNames.establishmentMeans',
        cell: ({ row }) => {
          const establishmentMeans = row.original.establishmentMeans;
          if (!establishmentMeans) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('establishmentMeans')}
              field="establishmentMeans"
              value={establishmentMeans}
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
        header: 'occurrenceFieldNames.iucnRedListCategory',
        cell: ({ row }) => {
          const iucnRedListCategory = row.original.iucnRedListCategory;
          if (!iucnRedListCategory) return null;

          return (
            <SetAsFilter
              filterIsActive={isFilterActive('iucnRedListCategory')}
              field="iucnRedListCategory"
              value={iucnRedListCategory}
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
        header: 'occurrenceFieldNames.datasetName',
        accessorKey: 'datasetName',
        meta: {
          filter: filters['datasetName'],
        },
      },
    ];
  }, [showPreview, filters]);
}
