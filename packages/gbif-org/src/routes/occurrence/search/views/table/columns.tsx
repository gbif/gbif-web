import { InlineLineClamp } from '@/components/inlineLineClamp';
import { FormattedDateRange } from '@/components/message';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { VocabularyValue } from '@/components/vocabularyValue';
import { useMemo } from 'react';
import { GoSidebarExpand } from 'react-icons/go';
import { FormattedMessage } from 'react-intl';
import { SingleOccurrenceSearchResult } from './occurrenceTable';
import { IconFeatures } from './iconFeatures';
import { SetAsFilter, SetAsFilterList, LinkOption, ColumnDef } from '@/components/searchTable';

type Args = {
  showPreview?: ((id: string) => void) | false;
};

export function useOccurrenceColumns({
  showPreview,
}: Args): ColumnDef<SingleOccurrenceSearchResult>[] {
  return useMemo(() => {
    const columns: ColumnDef<SingleOccurrenceSearchResult>[] = [
      {
        id: 'scientificName',
        header: 'filters.taxonKey.name',
        disableHiding: true,
        minWidth: 250,
        cell: (occurrence) => {
          const entityKey = `o_${occurrence?.key?.toString()}`;

          return (
            <div className="g-inline-flex g-items-center g-w-full">
              {typeof showPreview === 'function' && (
                <button
                  // Used to refocus this button after closing the preview dialog
                  data-entity-trigger={entityKey}
                  className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
                  onClick={() => showPreview(entityKey)}
                >
                  <SimpleTooltip i18nKey="filterSupport.viewDetails" side="right" asChild>
                    <div className="g-flex g-items-center">
                      <GoSidebarExpand size={16} />
                    </div>
                  </SimpleTooltip>
                </button>
              )}
              <div>
                <SetAsFilter field="taxonKey" value={occurrence.taxonKey}>
                  <span
                    className="g-pointer-events-auto"
                    dangerouslySetInnerHTML={{
                      __html: occurrence.gbifClassification?.usage?.formattedName as string,
                    }}
                  />
                </SetAsFilter>
                {occurrence.hasTaxonIssues && (
                  <SimpleTooltip side="right" i18nKey="filterSupport.nameWithTaxonMatchIssue">
                    <div style={{ color: '#fea600' }} className="g-cursor-default" data-loader>
                      {occurrence.gbifClassification?.verbatimScientificName}
                    </div>
                  </SimpleTooltip>
                )}
              </div>
            </div>
          );
        },
      },
      {
        id: 'features',
        header: 'tableHeaders.features',
        cell: (occurrence) => (
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
        ),
      },
      {
        id: 'country',
        header: 'filters.occurrenceCountry.name',
        minWidth: 150,
        cell: ({ countryCode }) => (
          <SetAsFilter field="country" value={countryCode}>
            {countryCode && <FormattedMessage id={`enums.countryCode.${countryCode}`} />}
          </SetAsFilter>
        ),
      },
      {
        id: 'coordinates',
        header: 'filters.coordinates.name',
        cell: ({ formattedCoordinates }) => {
          if (!formattedCoordinates) return null;
          return <span className="g-text-nowrap">{formattedCoordinates}</span>;
        },
      },
      {
        id: 'year',
        header: 'filters.year.name',
        cell: ({ eventDate }) => (
          <SetAsFilter
            // TODO How do we add a date range to the filter?
            field="year"
            value={new Date(eventDate!)?.getFullYear().toString()}
          >
            <FormattedDateRange date={eventDate ?? undefined} format={{ year: 'numeric' }} />
          </SetAsFilter>
        ),
      },
      {
        id: 'eventDate',
        header: 'filters.eventDate.name',
        cell: ({ eventDate }) => {
          if (!eventDate) return null;
          return (
            <span className="g-text-nowrap">
              <FormattedDateRange
                date={eventDate}
                format={{ year: 'numeric', month: 'short', day: 'numeric' }}
              />
            </span>
          );
        },
      },
      {
        id: 'basisOfRecord',
        header: 'filters.basisOfRecord.name',
        cell: ({ basisOfRecord }) => (
          <SetAsFilter field="basisOfRecord" value={basisOfRecord}>
            <FormattedMessage id={`enums.basisOfRecord.${basisOfRecord}`} />
          </SetAsFilter>
        ),
      },
      {
        id: 'dataset',
        header: 'filters.datasetKey.name',
        minWidth: 350,
        cell: ({ datasetKey, datasetTitle }) => (
          <InlineLineClamp className="-g-ml-0.5">
            <SetAsFilter field="dataset" value={datasetKey} className="g-ml-0">
              {datasetTitle}
            </SetAsFilter>
          </InlineLineClamp>
        ),
      },
      {
        id: 'publisher',
        header: 'filters.publisherKey.name',
        minWidth: 250,
        cell: ({ publishingOrgKey, publisherTitle }) => (
          <SetAsFilter field="publisherKey" value={publishingOrgKey}>
            {publisherTitle}
          </SetAsFilter>
        ),
      },
      {
        id: 'catalogNumber',
        header: 'filters.catalogNumber.name',
        cell: ({ catalogNumber }) => (
          <SetAsFilter field="catalogNumber" value={catalogNumber}>
            {catalogNumber}
          </SetAsFilter>
        ),
      },
      {
        id: 'recordedBy',
        header: 'filters.recordedBy.name',
        minWidth: 200,
        cell: ({ recordedBy }) => <SetAsFilterList field="recordedBy" items={recordedBy} />,
      },
      {
        id: 'identifiedBy',
        header: 'filters.identifiedBy.name',
        minWidth: 200,
        cell: ({ identifiedBy }) => <SetAsFilterList field="identifiedBy" items={identifiedBy} />,
      },
      {
        id: 'recordNumber',
        header: 'filters.recordNumber.name',
        cell: ({ recordNumber }) => (
          <SetAsFilter field="recordNumber" value={recordNumber}>
            {recordNumber}
          </SetAsFilter>
        ),
      },
      {
        id: 'typeStatus',
        header: 'filters.typeStatus.name',
        cell: ({ typeStatus }) => (
          <SetAsFilterList
            field="typeStatus"
            items={typeStatus}
            renderValue={(value) => <FormattedMessage id={`enums.typeStatus.${value}`} />}
          />
        ),
      },
      {
        id: 'preparations',
        header: 'occurrenceFieldNames.preparations',
        cell: ({ preparations }) => <SetAsFilterList field="preparations" items={preparations} />,
      },
      {
        id: 'collectionCode',
        header: 'occurrenceFieldNames.collectionCode',
        cell: ({ collection }) => {
          if (!collection) return null;

          return (
            <SetAsFilter field="collectionCode" value={collection.code}>
              {collection.code}
            </SetAsFilter>
          );
        },
      },
      {
        id: 'institutionCode',
        header: 'occurrenceFieldNames.institutionCode',
        minWidth: 200,
        cell: ({ institution }) => {
          if (!institution) return null;

          return (
            <SetAsFilter field="institutionCode" value={institution.code}>
              {institution?.code}
            </SetAsFilter>
          );
        },
      },
      {
        id: 'institutionKey',
        header: 'tableHeaders.institution',
        minWidth: 200,
        cell: ({ institution }) => {
          if (!institution) return null;

          return (
            <LinkOption to={`/institution/${institution.key}`}>
              <SetAsFilter field="institutionKey" value={institution.key}>
                <span>
                  {institution.name} <span>{institution.code}</span>
                </span>
              </SetAsFilter>
            </LinkOption>
          );
        },
      },
      {
        id: 'collectionKey',
        header: 'tableHeaders.collection',
        minWidth: 200,
        cell: ({ collection }) => {
          if (!collection) return null;

          return (
            <LinkOption to={`/collection/${collection.key}`}>
              <SetAsFilter field="collectionCode" value={collection.code}>
                <span>
                  {collection.name} <span>({collection.code})</span>
                </span>
              </SetAsFilter>
            </LinkOption>
          );
        },
      },
      {
        id: 'locality',
        header: 'occurrenceFieldNames.locality',
        minWidth: 200,
        cell: ({ locality }) => <InlineLineClamp>{locality}</InlineLineClamp>,
      },
      {
        id: 'higherGeography',
        header: 'occurrenceFieldNames.higherGeography',
        cell: ({ higherGeography }) => (
          <SetAsFilterList field="higherGeography" items={higherGeography} />
        ),
      },
      {
        id: 'stateProvince',
        header: 'occurrenceFieldNames.stateProvince',
        cell: ({ stateProvince }) => {
          if (!stateProvince) return null;

          return (
            <SetAsFilter field="stateProvince" value={stateProvince}>
              {stateProvince}
            </SetAsFilter>
          );
        },
      },
      {
        id: 'establishmentMeans',
        header: 'occurrenceFieldNames.establishmentMeans',
        cell: ({ establishmentMeans }) => {
          if (!establishmentMeans) return null;

          return (
            <SetAsFilter field="establishmentMeans" value={establishmentMeans}>
              <VocabularyValue vocabulary="EstablishmentMeans" value={establishmentMeans} />
            </SetAsFilter>
          );
        },
      },
      {
        id: 'iucnRedListCategory',
        header: 'occurrenceFieldNames.iucnRedListCategory',
        cell: ({ iucnRedListCategory }) => {
          if (!iucnRedListCategory) return null;

          return (
            <SetAsFilter field="iucnRedListCategory" value={iucnRedListCategory}>
              <FormattedMessage id={`enums.iucnRedListCategory.${iucnRedListCategory}`} />
            </SetAsFilter>
          );
        },
      },
      {
        id: 'datasetName',
        header: 'occurrenceFieldNames.datasetName',
        minWidth: 200,
        cell: ({ datasetName }) => <SetAsFilterList field="datasetName" items={datasetName} />,
      },
    ];

    return columns;
  }, [showPreview]);
}
