import React from 'react';
import { IconFeatures } from '../../../components';

export const tableConfig = {
  defaultColumns: ['features', 'country', 'coordinates', 'year', 'basisOfRecord', 'dataset', 'publisher'],
  columns: [
    {
      name: 'scientificName',
      trKey: 'filters.taxonKey.name',
      filterKey: 'taxonKey', // optional
      value: {
        key: 'gbifClassification.usage.formattedName',
        formatter: (value, occurrence) => <span dangerouslySetInnerHTML={{ __html: value }}></span>
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
        labelHandle: 'countryCode'
      }
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
        key: 'year'
      }
    },
    {
      name: 'basisOfRecord',
      trKey: 'filters.basisOfRecord.name',
      filterKey: 'basisOfRecord', //optional
      value: {
        key: 'basisOfRecord',
        labelHandle: 'basisOfRecord'
      }
    },
    {
      name: 'dataset',
      trKey: 'filters.datasetKey.name',
      filterKey: 'datasetKey', //optional
      value: {
        key: 'datasetTitle',
      },
      width: 'wide'
    },
    {
      name: 'publisher',
      trKey: 'filters.publisherKey.name',
      filterKey: 'publisherKey', //optional
      value: {
        key: 'publisherTitle',
      },
      width: 'wide'
    },
    {
      name: 'catalogNumber',
      trKey: 'filters.catalogNumber.name',
      filterKey: 'catalogNumber', //optional
      value: {
        key: 'catalogNumber',
      },
      width: 'wide'
    },
    {
      name: 'recordedBy',
      trKey: 'filters.recordedBy.name',
      filterKey: 'recordedBy', //optional
      value: {
        key: 'recordedBy',
      },
      width: 'wide'
    },
    {
      name: 'identifiedBy',
      trKey: 'filters.identifiedBy.name',
      filterKey: 'identifiedBy', //optional
      value: {
        key: 'identifiedBy',
      },
      width: 'wide'
    },
    {
      name: 'recordNumber',
      trKey: 'filters.recordNumber.name',
      filterKey: 'recordNumber', //optional
      value: {
        key: 'recordNumber',
      }
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
      trKey: 'occurrenceFieldNames.collectionCode',
      value: {
        key: 'collectionCode'
      }
    },
    {
      name: 'institutionCode',
      trKey: 'occurrenceFieldNames.institutionCode',
      value: {
        key: 'institutionCode'
      }
    },
    {
      name: 'locality',
      trKey: 'occurrenceFieldNames.locality',
      value: {
        key: 'locality'
      }
    },
  ]
};