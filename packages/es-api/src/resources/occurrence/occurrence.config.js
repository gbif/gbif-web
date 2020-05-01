const config = 
{
  options: {
    all: {
      type: 'text',
      field: 'all',
      get: {
        type: 'fuzzy'
      }
    },
    basisOfRecord: {
      type: 'keyword',
      field: 'basisOfRecord'
    },
    catalogNumber: {
      type: 'keyword',
      field: 'catalogNumber'
    },
    collectionCode: {
      type: 'keyword',
      field: 'collectionCode'
    },
    collectionKey: {
      type: 'keyword',
      field: 'collectionKey'
    },
    continent: {
      type: 'keyword',
      field: 'continent'
    },
    coordinatePrecision: {
      type: 'numeric',
      field: 'coordinatePrecision',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    coordinateUncertaintyInMeters: {
      type: 'numeric',
      field: 'coordinateUncertaintyInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    country: {
      type: 'text',
      field: 'country',
      get: {
        type: 'fuzzy'
      }
    },
    countryCode: {
      type: 'keyword',
      field: 'countryCode'
    },
    crawlId: {
      type: 'numeric',
      field: 'crawlId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    created: {
      type: 'date',
      field: 'created',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    datasetKey: {
      type: 'keyword',
      field: 'datasetKey'
    },
    datasetPublishingCountry: {
      type: 'keyword',
      field: 'datasetPublishingCountry'
    },
    datasetTitle: {
      type: 'keyword',
      field: 'datasetTitle'
    },
    dateIdentified: {
      type: 'date',
      field: 'dateIdentified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    day: {
      type: 'numeric',
      field: 'day',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    decimalLatitude: {
      type: 'numeric',
      field: 'decimalLatitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    decimalLongitude: {
      type: 'numeric',
      field: 'decimalLongitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    depth: {
      type: 'numeric',
      field: 'depth',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    depthAccuracy: {
      type: 'numeric',
      field: 'depthAccuracy',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    elevation: {
      type: 'numeric',
      field: 'elevation',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    elevationAccuracy: {
      type: 'numeric',
      field: 'elevationAccuracy',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    endDayOfYear: {
      type: 'numeric',
      field: 'endDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    endorsingNodeKey: {
      type: 'keyword',
      field: 'endorsingNodeKey'
    },
    establishmentMeans: {
      type: 'keyword',
      field: 'establishmentMeans'
    },
    eventDateSingle: {
      type: 'date',
      field: 'eventDateSingle',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    eventId: {
      type: 'keyword',
      field: 'eventId'
    },
    gbifId: {
      type: 'numeric',
      field: 'gbifId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    hasCoordinate: {
      type: 'boolean',
      field: 'hasCoordinate'
    },
    hasGeospatialIssue: {
      type: 'boolean',
      field: 'hasGeospatialIssue'
    },
    id: {
      type: 'keyword',
      field: 'id'
    },
    individualCount: {
      type: 'numeric',
      field: 'individualCount',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    installationKey: {
      type: 'keyword',
      field: 'installationKey'
    },
    institutionCode: {
      type: 'keyword',
      field: 'institutionCode'
    },
    institutionKey: {
      type: 'keyword',
      field: 'institutionKey'
    },
    issues: {
      type: 'keyword',
      field: 'issues'
    },
    lastCrawled: {
      type: 'date',
      field: 'lastCrawled',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    license: {
      type: 'keyword',
      field: 'license'
    },
    lifeStage: {
      type: 'keyword',
      field: 'lifeStage'
    },
    locality: {
      type: 'keyword',
      field: 'locality'
    },
    maximumDepthInMeters: {
      type: 'numeric',
      field: 'maximumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    maximumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'maximumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    maximumElevationInMeters: {
      type: 'numeric',
      field: 'maximumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    mediaLicenses: {
      type: 'keyword',
      field: 'mediaLicenses'
    },
    mediaTypes: {
      type: 'keyword',
      field: 'mediaTypes'
    },
    minimumDepthInMeters: {
      type: 'numeric',
      field: 'minimumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    minimumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'minimumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    minimumElevationInMeters: {
      type: 'numeric',
      field: 'minimumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    modified: {
      type: 'date',
      field: 'modified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    month: {
      type: 'numeric',
      field: 'month',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    networkKeys: {
      type: 'keyword',
      field: 'networkKeys'
    },
    notIssues: {
      type: 'keyword',
      field: 'notIssues'
    },
    occurrenceId: {
      type: 'keyword',
      field: 'occurrenceId'
    },
    organismId: {
      type: 'keyword',
      field: 'organismId'
    },
    organismQuantity: {
      type: 'numeric',
      field: 'organismQuantity',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    organismQuantityType: {
      type: 'keyword',
      field: 'organismQuantityType'
    },
    parentEventId: {
      type: 'keyword',
      field: 'parentEventId'
    },
    programmeAcronym: {
      type: 'keyword',
      field: 'programmeAcronym'
    },
    projectId: {
      type: 'keyword',
      field: 'projectId'
    },
    protocol: {
      type: 'keyword',
      field: 'protocol'
    },
    publisherTitle: {
      type: 'keyword',
      field: 'publisherTitle'
    },
    publishingCountry: {
      type: 'keyword',
      field: 'publishingCountry'
    },
    publishingOrganizationKey: {
      type: 'keyword',
      field: 'publishingOrganizationKey'
    },
    recordNumber: {
      type: 'keyword',
      field: 'recordNumber'
    },
    recordedBy: {
      type: 'keyword',
      field: 'recordedBy'
    },
    references: {
      type: 'text',
      field: 'references',
      get: {
        type: 'fuzzy'
      }
    },
    relativeOrganismQuantity: {
      type: 'numeric',
      field: 'relativeOrganismQuantity',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    repatriated: {
      type: 'boolean',
      field: 'repatriated'
    },
    sampleSizeUnit: {
      type: 'keyword',
      field: 'sampleSizeUnit'
    },
    sampleSizeValue: {
      type: 'numeric',
      field: 'sampleSizeValue',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    samplingProtocol: {
      type: 'keyword',
      field: 'samplingProtocol'
    },
    scoordinates: {
      type: 'geo_shape',
      field: 'scoordinates',
      get: {
        type: 'within'
      }
    },
    sex: {
      type: 'keyword',
      field: 'sex'
    },
    startDayOfYear: {
      type: 'numeric',
      field: 'startDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    stateProvince: {
      type: 'keyword',
      field: 'stateProvince'
    },
    typeStatus: {
      type: 'keyword',
      field: 'typeStatus'
    },
    typifiedName: {
      type: 'keyword',
      field: 'typifiedName'
    },
    waterBody: {
      type: 'keyword',
      field: 'waterBody'
    },
    year: {
      type: 'numeric',
      field: 'year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    }
  }
};

module.exports = {
  config
}