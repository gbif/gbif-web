import { ConceptValue } from '@/components/conceptValue';
import { InlineLineClamp } from '@/components/inlineLineClamp';
import { FormattedDateRange } from '@/components/message';
import { ColumnDef, LinkOption, SetAsFilter, SetAsFilterList } from '@/components/searchTable';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdownMenu';
import { VocabularyValue } from '@/components/vocabularyValue';
import { AddFilterEvent } from '@/contexts/filter';
import { truncate } from '@/utils/truncate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { useMemo } from 'react';
import { MdInfoOutline, MdSettings } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import useLocalStorage from 'use-local-storage';
import { IconFeatures } from './iconFeatures';
import { SingleOccurrenceSearchResult } from './occurrenceTable';
import ScientificNameColumn from './ScientificNameColumn';

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
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'taxonKey' },
        header: 'filters.taxonKey.name',
        filterKey: 'taxonKey', // default is same as id
        disableHiding: true,
        minWidth: 250,
        cell: (occurrence) => {
          return <ScientificNameColumn occurrence={occurrence} showPreview={showPreview} />;
        },
        Actions: ({ firstColumnIsLocked, hideFirstColumnLock, setFirstColumnIsLocked }) => {
          const [includeAuthorship, setIncludeAuthorship] = useLocalStorage(
            'includeAuthorship',
            false
          );
          return (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MdSettings />
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <div className="gbif">
                  <DropdownMenuContent
                    className="g-bg-white g-shadow-blocker g-rounded g-border g-border-solid g-border-slate-200"
                    style={{ zIndex: 100 }}
                  >
                    <DropdownMenuCheckboxItem
                      className="DropdownMenuCheckboxItem"
                      checked={includeAuthorship}
                      onCheckedChange={() => setIncludeAuthorship(!includeAuthorship)}
                    >
                      <FormattedMessage id="tableHeaders.options.includeAuthorship" />
                    </DropdownMenuCheckboxItem>
                    {!hideFirstColumnLock && (
                      <DropdownMenuCheckboxItem
                        className="DropdownMenuCheckboxItem"
                        checked={firstColumnIsLocked}
                        onCheckedChange={() => setFirstColumnIsLocked(!firstColumnIsLocked)}
                      >
                        <FormattedMessage id="Lock first column in place" />
                      </DropdownMenuCheckboxItem>
                    )}
                  </DropdownMenuContent>
                </div>
              </DropdownMenuPortal>
            </DropdownMenu>
          );
        },
      },
      {
        id: 'commonName',
        header: 'tableHeaders.commonName',
        minWidth: 200,
        cell: (occurrence) => {
          if (!occurrence?.volatile?.vernacularNames?.results[0]?.vernacularName) return null;

          return (
            <InlineLineClamp>
              <span>
                <SimpleTooltip
                  side="bottom"
                  title={
                    <FormattedMessage
                      id="phrases.commonNameAccordingTo"
                      values={{ source: occurrence?.volatile?.vernacularNames?.results[0]?.source }}
                    />
                  }
                >
                  <MdInfoOutline className="-g-mt-0.5 g-text-slate-400" />
                </SimpleTooltip>
                <span className="g-ms-1.5">
                  {occurrence?.volatile?.vernacularNames?.results[0]?.vernacularName}
                </span>
              </span>
            </InlineLineClamp>
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
            // issueCount={occurrence?.issues?.length}
          />
        ),
      },
      {
        id: 'media',
        header: 'tableHeaders.images',
        minWidth: 80,
        cell: (occurrence) => {
          if (!occurrence?.primaryImage?.thumbor) return null;

          return (
            <div className="g-relative g-text-center">
              {occurrence.stillImageCount && occurrence.stillImageCount > 1 && (
                <div className="g-inline-block g-rounded-full g-absolute -g-top-0.5 -g-end-0.5 g-bg-slate-900 g-text-white g-text-xs g-px-1 g-text-center">
                  {occurrence.stillImageCount}
                </div>
              )}
              <img
                className="g-rounded g-border g-border-solid g-border-slate-200"
                src={occurrence?.primaryImage?.thumbor}
              />
            </div>
          );
        },
      },
      {
        id: 'country',
        sort: {
          localStorageKey: 'occurrenceSort',
          sortBy: 'countryCode',
          // message: <FormattedMessage id="Sorted by country code" />,
        },
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
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'year' },
        header: 'filters.year.name',
        cell: ({ year }) => (
          <SetAsFilter field="year" value={year}>
            {year}
          </SetAsFilter>
        ),
      },
      {
        id: 'eventDate',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'eventDate' },
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
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'basisOfRecord' },
        header: 'filters.basisOfRecord.name',
        cell: ({ basisOfRecord }) => (
          <SetAsFilter field="basisOfRecord" value={basisOfRecord}>
            <FormattedMessage id={`enums.basisOfRecord.${basisOfRecord}`} />
          </SetAsFilter>
        ),
      },
      {
        id: 'dataset',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'datasetKey' },
        header: 'filters.datasetKey.name',
        minWidth: 350,
        cell: ({ datasetKey, datasetTitle }) => (
          <InlineLineClamp className="-g-ml-0.5">
            <LinkOption to={`/dataset/${datasetKey}`}>
              <SetAsFilter field="datasetKey" value={datasetKey}>
                {datasetTitle}
              </SetAsFilter>
            </LinkOption>
          </InlineLineClamp>
        ),
      },
      {
        id: 'publisher',
        header: 'filters.publisherKey.name',
        minWidth: 250,
        cell: ({ publishingOrgKey, publisherTitle }) => (
          <LinkOption to={`/publisher/${publishingOrgKey}`}>
            <SetAsFilter field="publishingOrg" value={publishingOrgKey}>
              {publisherTitle}
            </SetAsFilter>
          </LinkOption>
        ),
      },
      {
        id: 'catalogNumber',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'catalogNumber' },
        header: 'filters.catalogNumber.name',
        cell: ({ catalogNumber }) => (
          <SetAsFilter field="catalogNumber" value={catalogNumber}>
            {catalogNumber}
          </SetAsFilter>
        ),
      },
      {
        id: 'recordedBy',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'recordedBy' },
        header: 'filters.recordedBy.name',
        minWidth: 200,
        cell: ({ recordedBy }) => <SetAsFilterList field="recordedBy" items={recordedBy} />,
      },
      {
        id: 'identifiedBy',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'identifiedBy' },
        header: 'filters.identifiedBy.name',
        minWidth: 200,
        cell: ({ identifiedBy }) => <SetAsFilterList field="identifiedBy" items={identifiedBy} />,
      },
      {
        id: 'recordNumber',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'recordNumber' },
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
            renderValue={(value) => {
              if (!value) return null;
              return <ConceptValue vocabulary="TypeStatus" name={value} hideTooltip />;
            }}
          />
        ),
      },
      {
        id: 'preparations',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'preparations' },
        header: 'occurrenceFieldNames.preparations',
        cell: ({ preparations }) => <SetAsFilterList field="preparations" items={preparations} />,
      },
      {
        id: 'collectionCode',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'collectionCode' },
        header: 'occurrenceFieldNames.collectionCode',
        cell: ({ collectionCode }) => {
          if (!collectionCode) return null;

          return (
            <SetAsFilter field="collectionCode" value={collectionCode}>
              {collectionCode}
            </SetAsFilter>
          );
        },
      },
      {
        id: 'specimenTriplet',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'institutionCode' },
        header: 'tableHeaders.specimenTriplet',
        minWidth: 200,
        cell: ({ institutionCode, collectionCode, catalogNumber }) => {
          if (!institutionCode || !collectionCode || !catalogNumber) return null;
          return (
            <div>
              <button
                onClick={() =>
                  window.dispatchEvent(new AddFilterEvent('institutionCode', institutionCode))
                }
                className="g-me-2 g-pointer-events-auto hover:g-bg-primary-300 hover:g-text-primaryContrast-400 g-box-decoration-clone"
              >
                {truncate(institutionCode, 8)}
              </button>
              <button
                onClick={() =>
                  window.dispatchEvent(new AddFilterEvent('collectionCode', collectionCode))
                }
                className="g-me-2 g-pointer-events-auto hover:g-bg-primary-300 hover:g-text-primaryContrast-400 g-box-decoration-clone"
              >
                {truncate(collectionCode, 10)}
              </button>
              <button
                onClick={() =>
                  window.dispatchEvent(new AddFilterEvent('catalogNumber', catalogNumber))
                }
                className="g-pointer-events-auto hover:g-bg-primary-300 hover:g-text-primaryContrast-400 g-box-decoration-clone"
              >
                {truncate(catalogNumber, 10)}
              </button>
            </div>
          );
        },
      },
      {
        id: 'institutionCode',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'institutionCode' },
        header: 'occurrenceFieldNames.institutionCode',
        minWidth: 200,
        cell: ({ institutionCode }) => {
          if (!institutionCode) return null;

          return (
            <SetAsFilter field="institutionCode" value={institutionCode}>
              {institutionCode}
            </SetAsFilter>
          );
        },
      },
      {
        id: 'institutionKey',
        header: 'tableHeaders.institution',
        minWidth: 300,
        cell: ({ institution, institutionKey }) => {
          if (!institution) {
            if (institutionKey) {
              return (
                <LinkOption to={`/institution/${institutionKey}`}>
                  <SetAsFilter
                    field="institutionKey"
                    value={institutionKey}
                    className="g-text-slate-400"
                  >
                    <FormattedMessage id="phrases.loadError" />
                  </SetAsFilter>
                </LinkOption>
              );
            } else {
              return null;
            }
          }

          return (
            <LinkOption to={`/institution/${institutionKey}`}>
              <SetAsFilter field="institutionKey" value={institutionKey}>
                <span className="g-me-1">{institution.name}</span>
              </SetAsFilter>
              <span className="g-font-mono g-text-xs g-text-slate-400 g-inline-block">
                {institution.code}
              </span>
            </LinkOption>
          );
        },
      },
      {
        id: 'collectionKey',
        header: 'tableHeaders.collection',
        minWidth: 300,
        cell: ({ collection, collectionKey }) => {
          if (!collection) {
            if (collectionKey) {
              return (
                <LinkOption to={`/collection/${collectionKey}`}>
                  <SetAsFilter
                    field="collectionKey"
                    value={collectionKey}
                    className="g-text-slate-400"
                  >
                    <FormattedMessage id="phrases.loadError" />
                  </SetAsFilter>
                </LinkOption>
              );
            } else {
              return null;
            }
          }

          return (
            <LinkOption to={`/collection/${collectionKey}`}>
              <SetAsFilter field="collectionKey" value={collectionKey}>
                <span className="g-me-1">{collection.name}</span>
              </SetAsFilter>
              <span className="g-font-mono g-text-xs g-text-slate-400 g-inline-block">
                {collection.code}
              </span>
            </LinkOption>
          );
        },
      },
      {
        id: 'locality',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'locality' },
        header: 'occurrenceFieldNames.locality',
        minWidth: 200,
        cell: ({ locality }) => (
          <InlineLineClamp className="-g-ml-0.5">
            <SetAsFilter field="locality" value={locality} className="g-ml-0">
              {locality}
            </SetAsFilter>
          </InlineLineClamp>
        ),
      },
      {
        id: 'fieldNumber',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'fieldNumber' },
        header: 'occurrenceFieldNames.fieldNumber',
        minWidth: 200,
        cell: ({ fieldNumber }) => (
          <InlineLineClamp className="-g-ml-0.5">
            <SetAsFilter field="fieldNumber" value={fieldNumber} className="g-ml-0">
              {fieldNumber}
            </SetAsFilter>
          </InlineLineClamp>
        ),
      },
      {
        id: 'individualCount',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'individualCount' },
        header: 'occurrenceFieldNames.individualCount',
        minWidth: 50,
        cell: ({ individualCount }) => (
          <InlineLineClamp className="-g-ml-0.5">{individualCount}</InlineLineClamp>
        ),
      },
      {
        id: 'higherGeography',
        minWidth: 350,
        header: 'occurrenceFieldNames.higherGeography',
        cell: ({ higherGeography }) => (
          <SetAsFilterList field="higherGeography" items={higherGeography} />
        ),
      },
      {
        id: 'stateProvince',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'stateProvince' },
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
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'establishmentMeans' },
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
        id: 'sex',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'sex' },
        header: 'occurrenceFieldNames.sex',
        cell: ({ sex }) => {
          if (!sex) return null;

          return (
            <SetAsFilter field="sex" value={sex}>
              <VocabularyValue vocabulary="Sex" value={sex} />
            </SetAsFilter>
          );
        },
      },
      {
        id: 'lifeStage',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'lifeStage' },
        header: 'occurrenceFieldNames.lifeStage',
        cell: ({ lifeStage }) => {
          if (!lifeStage) return null;

          return (
            <SetAsFilter field="lifeStage" value={lifeStage}>
              <VocabularyValue vocabulary="LifeStage" value={lifeStage} />
            </SetAsFilter>
          );
        },
      },
      {
        id: 'iucnRedListCategory',
        sort: { localStorageKey: 'occurrenceSort', sortBy: 'iucnRedListCategoryCode' },
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
      // I do not believe anyone has ever asked for this column. Lets just remove it for now.
      // {
      //   id: 'datasetName',
      //   header: 'occurrenceFieldNames.datasetName',
      //   minWidth: 200,
      //   cell: ({ datasetName }) => (
      //     <InlineLineClamp>
      //       {datasetName?.map((name) => (
      //         <span>{name}</span>
      //       ))}
      //     </InlineLineClamp>
      //   ),
      // },
    ];

    return columns;
  }, [showPreview]);
}
