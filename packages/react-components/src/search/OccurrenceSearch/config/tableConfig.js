import React from 'react';
import { IconFeatures, TextButton, Tooltip } from '../../../components';
import { InlineFilterChip, LinkOption } from '../../../widgets/Filter/utils/FilterChip';
// import { MdPreview as OpenInSideBar} from 'react-icons/md';
import { RiSideBarFill as OpenInSideBar } from 'react-icons/ri';
import { FormattedMessage } from 'react-intl';

export const tableConfig = {
  defaultColumns: ['features', 'country', 'coordinates', 'year', 'basisOfRecord', 'dataset', 'publisher'],
  columns: [
    {
      name: 'scientificName',
      trKey: 'filters.taxonKey.name',
      filterKey: 'taxonKey', // optional
      value: {
        key: 'gbifClassification.usage.formattedName',
        formatter: (value, occurrence, { openInSideBar }) => <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip placement="top" title={<span><FormattedMessage id="filterSupport.viewDetails" /></span>}>
            <TextButton as="span" look="textHoverLinkColor" style={{ display: 'inline-flex' }}>
              <OpenInSideBar style={{ fontSize: '1.5em', marginRight: '.75em' }} onClick={(e) => {
                openInSideBar();
                e.stopPropagation();
              }} />
            </TextButton>
          </Tooltip>
          <div>
            <InlineFilterChip filterName="taxonKey" values={[occurrence.taxonKey]}>
              <span dangerouslySetInnerHTML={{ __html: value }} data-loader></span>
            </InlineFilterChip>
            {occurrence.hasTaxonIssues && <Tooltip placement="top" title={<span><FormattedMessage id="filterSupport.nameWithTaxonMatchIssue" /></span>}>
              <div style={{ color: '#fea600' }} data-loader>
                {occurrence.gbifClassification.verbatimScientificName}
              </div>
            </Tooltip>}
          </div>
        </div >
      },
      width: 'wide'
    },
    {
      name: 'features',
      trKey: 'tableHeaders.features',
      value: {
        key: 'features',
        formatter: (value, occurrence) => {
          return <IconFeatures iconsOnly
            stillImageCount={occurrence.stillImageCount}
            movingImageCount={occurrence.movingImageCount}
            soundCount={occurrence.soundCount}
            typeStatus={occurrence.typeStatus}
            isSequenced={occurrence.volatile.features.isSequenced}
            isTreament={occurrence.volatile.features.isTreament}
            isClustered={occurrence.volatile.features.isClustered}
            isSamplingEvent={occurrence.volatile.features.isSamplingEvent}
            issueCount={occurrence?.issues?.length}
          />
        }
      }
    },
    {
      name: 'country',
      trKey: 'filters.occurrenceCountry.name',
      filterKey: 'country', //optional
      value: {
        key: 'countryCode',
        labelHandle: 'countryCode',
        hideFalsy: true,
        // formatter: (countryCode, item) => {
        //   return countryCode ? <InlineFilterChip filterName="country" values={[countryCode]}>
        //     <FormattedMessage
        //       id={`enums.countryCode.${countryCode}`}
        //     /></InlineFilterChip> : null;
        // },
      },
      cellFilter: true,
    },
    {
      name: 'coordinates',
      trKey: 'filters.coordinates.name',
      value: {
        key: 'formattedCoordinates',
        // formatter: (value, occurrence) => {
        //   if (!occurrence.coordinates) return null;
        //   return <span>
        //     (<FormattedNumber value={occurrence.coordinates.lat} maximumSignificantDigits={4}/>, <FormattedNumber value={occurrence.coordinates.lon} maximumSignificantDigits={4}/>)
        //   </span>
        // }
      },
      noWrap: true
    },
    {
      name: 'year',
      trKey: 'filters.year.name',
      filterKey: 'year', //optional
      value: {
        key: 'year',
      },
      cellFilter: true
    },
    {
      name: 'basisOfRecord',
      trKey: 'filters.basisOfRecord.name',
      filterKey: 'basisOfRecord', //optional
      value: {
        key: 'basisOfRecord',
        labelHandle: 'basisOfRecord'
      },
      cellFilter: true
    },
    {
      name: 'dataset',
      trKey: 'filters.datasetKey.name',
      filterKey: 'datasetKey', //optional
      value: {
        key: 'datasetTitle',
      },
      cellFilter: 'datasetKey',
      width: 'wide'
    },
    {
      name: 'publisher',
      trKey: 'filters.publisherKey.name',
      filterKey: 'publisherKey', //optional
      value: {
        key: 'publisherTitle',
      },
      cellFilter: 'publishingOrgKey',
      width: 'wide'
    },
    {
      name: 'catalogNumber',
      trKey: 'filters.catalogNumber.name',
      filterKey: 'catalogNumber', //optional
      value: {
        key: 'catalogNumber',
      },
      cellFilter: true
    },
    {
      name: 'recordedBy',
      trKey: 'filters.recordedBy.name',
      filterKey: 'recordedBy', //optional
      value: {
        key: 'recordedBy',
      },
      width: 'wide',
      cellFilter: ({ row }) => row.recordedBy,
    },
    {
      name: 'identifiedBy',
      trKey: 'filters.identifiedBy.name',
      filterKey: 'identifiedBy', //optional
      value: {
        key: 'identifiedBy',
      },
      width: 'wide',
      cellFilter: ({ row }) => row.identifiedBy,
    },
    {
      name: 'recordNumber',
      trKey: 'filters.recordNumber.name',
      filterKey: 'recordNumber', //optional
      value: {
        key: 'recordNumber',
      },
      cellFilter: true
    },
    {
      name: 'typeStatus',
      trKey: 'filters.typeStatus.name',
      filterKey: 'typeStatus', //optional
      value: {
        key: 'typeStatus',
        labelHandle: 'typeStatus'
      }
    },
    {
      name: 'preparations',
      trKey: 'occurrenceFieldNames.preparations',
      value: {
        key: 'preparations'
      }
    },

    {
      name: 'collectionCode',
      filterKey: 'collectionCode',
      trKey: 'occurrenceFieldNames.collectionCode',
      value: {
        key: 'collectionCode'
      },
      cellFilter: true,
    },
    {
      name: 'institutionCode',
      filterKey: 'institutionCode',
      trKey: 'occurrenceFieldNames.institutionCode',
      value: {
        key: 'institutionCode'
      },
      cellFilter: true,
    },
    {
      name: 'institutionKey',
      filterKey: 'institutionKey',
      trKey: 'tableHeaders.institution',
      value: {
        key: 'institution.name',
        formatter: (value, item) => {
          if (!value) return null;
          return <LinkOption discreet type='institutionKey' id={item.institution.key} >
          <InlineFilterChip filterName="institutionKey" values={[item.institution.key]}>
            <span data-loader>{item.institution.name} <span>({item.institution.code})</span></span>
          </InlineFilterChip>
        </LinkOption>
        },
      },
      width: 'wide'
    },
    {
      name: 'collectionKey',
      filterKey: 'collectionKey',
      trKey: 'tableHeaders.collection',
      value: {
        key: 'collection.name',
        formatter: (value, item) => {
          if (!value) return null;
          return <LinkOption discreet type='collectionKey' id={item.collection.key} >
          <InlineFilterChip filterName="collectionKey" values={[item.collection.key]}>
            <span data-loader>{item.collection.name} <span>({item.collection.code})</span></span>
          </InlineFilterChip>
        </LinkOption>
        },
      },
      width: 'wide'
    },
    {
      name: 'locality',
      filterKey: 'locality',
      trKey: 'occurrenceFieldNames.locality',
      value: {
        key: 'locality'
      },
    },
  ]
};