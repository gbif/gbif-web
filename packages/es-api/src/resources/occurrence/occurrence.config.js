const siteConfig = require('../../config');

const DEFAULT_CHECKLIST_KEY = siteConfig.defaultChecklist ?? 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c'; // Backbone key for classification

const config = {
  options: {
    // q: {
    //   type: 'text',
    //   field: 'all',
    //   get: {
    //     type: 'fuzzy',
    //   },
    // },
    amplificationItems: {
      field: 'amplificationItems',
      discarded: true,
    },
    australiaSpatialLayers: {
      field: 'australiaSpatialLayers',
      discarded: true,
    },
    basisOfRecord: {
      type: 'keyword',
      field: 'basisOfRecord',
    },
    biostratigraphy: {
      type: 'keyword',
      field: 'geologicalContext.biostratigraphy.keyword',
      suggestField: 'geologicalContext.biostratigraphy.suggest',
    },
    lithostratigraphy: {
      type: 'keyword',
      field: 'geologicalContext.lithostratigraphy.keyword',
      suggestField: 'geologicalContext.lithostratigraphy.suggest',
    },
    geologicalTime: {
      type: 'numeric',
      field: 'geologicalContext.range',
      get: {
        type: 'numeric',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    catalogNumber: {
      type: 'keyword',
      field: 'catalogNumber',
      suggestField: 'catalogNumber.suggest',
    },
    isInCluster: {
      type: 'boolean',
      field: 'isClustered',
    },
    collectionCode: {
      type: 'keyword',
      field: 'collectionCode.verbatim',
      suggestField: 'collectionCode.suggest',
    },
    collectionKey: {
      type: 'keyword',
      field: 'collectionKey',
    },
    continent: {
      type: 'keyword',
      field: 'continent',
    },
    gbifRegion: {
      type: 'keyword',
      field: 'gbifRegion',
    },
    publishedByGbifRegion: {
      type: 'keyword',
      field: 'publishedByGbifRegion',
    },
    coordinatePrecision: {
      type: 'numeric',
      field: 'coordinatePrecision',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    coordinateUncertaintyInMeters: {
      type: 'numeric',
      field: 'coordinateUncertaintyInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    distanceFromCentroidInMeters: {
      type: 'numeric',
      field: 'distanceFromCentroidInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    coordinates: {
      field: 'coordinates',
      discarded: true,
    },
    // "country": {
    //   "type": "text",
    //   "field": "country",
    //   "get": {
    //     "type": "fuzzy"
    //   }
    // },
    country: {
      type: 'keyword',
      field: 'countryCode',
    },
    countryCode: {
      type: 'keyword',
      field: 'countryCode',
    },
    crawlId: {
      type: 'numeric',
      field: 'crawlId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    created: {
      type: 'date',
      field: 'created',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    datasetId: {
      type: 'keyword',
      field: 'datasetID',
    },
    datasetKey: {
      type: 'keyword',
      field: 'datasetKey',
    },
    datasetPublishingCountry: {
      type: 'keyword',
      field: 'datasetPublishingCountry',
    },
    datasetTitle: {
      type: 'keyword',
      field: 'datasetTitle',
    },
    dateIdentified: {
      type: 'date',
      field: 'dateIdentified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    day: {
      type: 'numeric',
      field: 'day',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    decimalLatitude: {
      type: 'numeric',
      field: 'decimalLatitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    decimalLongitude: {
      type: 'numeric',
      field: 'decimalLongitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    depth: {
      type: 'numeric',
      field: 'depth',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    depthAccuracy: {
      type: 'numeric',
      field: 'depthAccuracy',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    dwcaExtension: {
      type: 'keyword',
      field: 'extensions',
    },
    elevation: {
      type: 'numeric',
      field: 'elevation',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    elevationAccuracy: {
      type: 'numeric',
      field: 'elevationAccuracy',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    earliestEraOrLowestErathem: {
      type: 'numeric',
      field: 'geologicalContext.earliestEraOrLowestErathem.concept',
    },
    endDayOfYear: {
      type: 'numeric',
      field: 'endDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    endorsingNodeKey: {
      type: 'keyword',
      field: 'endorsingNodeKey',
    },
    establishmentMeans: {
      type: 'keyword',
      field: 'establishmentMeans.concept',
    },
    pathway: {
      type: 'keyword',
      field: 'pathway.concept',
    },
    degreeOfEstablishment: {
      type: 'keyword',
      field: 'degreeOfEstablishment.concept',
    },
    // "eventDate": {
    //   "field": "eventDate",
    //   "discarded": true
    // },
    eventDate: {
      type: 'date',
      field: 'eventDateSingle',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    lastInterpreted: {
      type: 'date',
      field: 'created',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    eventId: {
      type: 'keyword',
      field: 'eventId',
      suggestField: 'eventId.suggest',
    },
    fieldNumber: {
      type: 'keyword',
      field: 'fieldNumber',
    },
    gadmGid: {
      type: 'keyword',
      field: 'gadm.gids',
    },
    gadmLevel0Gid: {
      type: 'keyword',
      field: 'gadm.level0Gid',
    },
    gadmLevel1Gid: {
      type: 'keyword',
      field: 'gadm.level1Gid',
    },
    gadmLevel2Gid: {
      type: 'keyword',
      field: 'gadm.level2Gid',
    },
    gadmLevel3Gid: {
      type: 'keyword',
      field: 'gadm.level3Gid',
    },
    key: {
      type: 'numeric',
      field: 'gbifId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifId: {
      type: 'numeric',
      field: 'gbifId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    hasCoordinate: {
      type: 'boolean',
      field: 'hasCoordinate',
    },
    isSequenced: {
      type: 'boolean',
      field: 'isSequenced',
    },
    hasGeospatialIssue: {
      type: 'boolean',
      field: 'hasGeospatialIssue',
    },
    id: {
      type: 'keyword',
      field: 'id',
    },
    identifiedBy: {
      type: 'keyword',
      field: 'identifiedBy',
      suggestField: 'identifiedBy.suggest',
    },
    individualCount: {
      type: 'numeric',
      field: 'individualCount',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    installationKey: {
      type: 'keyword',
      field: 'installationKey',
    },
    institutionCode: {
      type: 'keyword',
      field: 'institutionCode.verbatim',
      suggestField: 'institutionCode.suggest',
    },
    institutionKey: {
      type: 'keyword',
      field: 'institutionKey',
    },
    issue: {
      type: 'keyword',
      field: 'nonTaxonomicIssues',
    },
    taxonomicIssue: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.issues',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    iucnRedListCategory: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.iucnRedListCategoryCode',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    lastCrawled: {
      type: 'date',
      field: 'lastCrawled',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    license: {
      type: 'keyword',
      field: 'license',
    },
    lifeStage: {
      type: 'keyword',
      field: 'lifeStage.concept',
    },
    locality: {
      type: 'keyword',
      field: 'locality',
      suggestField: 'locality.suggest',
    },
    maximumDepthInMeters: {
      type: 'numeric',
      field: 'maximumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    maximumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'maximumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    maximumElevationInMeters: {
      type: 'numeric',
      field: 'maximumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    measurementOrFactItems: {
      field: 'measurementOrFactItems',
      discarded: true,
    },
    mediaLicenses: {
      type: 'keyword',
      field: 'mediaLicenses',
    },
    mediaType: {
      type: 'keyword',
      field: 'mediaTypes',
    },
    minimumDepthInMeters: {
      type: 'numeric',
      field: 'minimumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    minimumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'minimumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    minimumElevationInMeters: {
      type: 'numeric',
      field: 'minimumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    modified: {
      type: 'date',
      field: 'modified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    month: {
      type: 'numeric',
      field: 'month',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    multimediaItems: {
      field: 'multimediaItems',
      discarded: true,
    },
    networkKey: {
      type: 'keyword',
      field: 'networkKeys',
    },
    notIssues: {
      type: 'keyword',
      field: 'notIssues',
    },
    occurrenceId: {
      type: 'keyword',
      field: 'occurrenceId',
      suggestField: 'occurrenceId.suggest',
    },
    occurrenceStatus: {
      type: 'keyword',
      field: 'occurrenceStatus',
    },
    organismId: {
      type: 'keyword',
      field: 'organismId',
      suggestField: 'organismId.suggest',
    },
    organismQuantity: {
      type: 'numeric',
      field: 'organismQuantity',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    organismQuantityType: {
      type: 'keyword',
      field: 'organismQuantityType',
    },
    associatedSequences: {
      type: 'keyword',
      field: 'associatedSequences',
    },
    previousIdentifications: {
      type: 'keyword',
      field: 'previousIdentifications',
    },
    parentEventId: {
      type: 'keyword',
      field: 'parentEventId',
      suggestField: 'parentEventId.suggest',
    },
    preparations: {
      type: 'keyword',
      field: 'preparations',
    },
    programme: {
      type: 'keyword',
      field: 'programmeAcronym',
    },
    projectId: {
      type: 'keyword',
      field: 'projectId',
    },
    protocol: {
      type: 'keyword',
      field: 'protocol',
    },
    publisherTitle: {
      type: 'keyword',
      field: 'publisherTitle',
    },
    publishingCountry: {
      type: 'keyword',
      field: 'publishingCountry',
    },
    publishingOrg: {
      type: 'keyword',
      field: 'publishingOrganizationKey',
    },
    hostingOrganizationKey: {
      type: 'keyword',
      field: 'hostingOrganizationKey',
    },
    higherGeography: {
      type: 'keyword',
      field: 'higherGeography',
    },
    recordNumber: {
      type: 'keyword',
      field: 'recordNumber.verbatim',
      suggestField: 'recordNumber.suggest',
    },
    recordedBy: {
      type: 'keyword',
      field: 'recordedBy',
      suggestField: 'recordedBy.suggest',
    },
    references: {
      type: 'text',
      field: 'references',
      get: {
        type: 'fuzzy',
      },
    },
    relativeOrganismQuantity: {
      type: 'numeric',
      field: 'relativeOrganismQuantity',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    repatriated: {
      type: 'boolean',
      field: 'repatriated',
    },
    sampleSizeUnit: {
      type: 'keyword',
      field: 'sampleSizeUnit',
    },
    sampleSizeValue: {
      type: 'numeric',
      field: 'sampleSizeValue',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    samplingProtocol: {
      type: 'keyword',
      field: 'samplingProtocol',
      suggestField: 'samplingProtocol.suggest',
    },
    geometry: {
      type: 'geo_shape',
      field: 'scoordinates',
      get: {
        type: 'within',
      },
    },
    geoDistance: {
      type: 'geo_distance',
      field: 'coordinates',
      get: {
        type: 'geo_distance',
      },
    },
    sex: {
      type: 'keyword',
      field: 'sex.concept',
    },
    startDayOfYear: {
      type: 'numeric',
      field: 'startDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    stateProvince: {
      type: 'keyword',
      field: 'stateProvince',
      suggestField: 'stateProvince.suggest',
    },
    islandGroup: {
      type: 'keyword',
      field: 'islandGroup',
    },
    island: {
      type: 'keyword',
      field: 'island',
    },
    georeferencedBy: {
      type: 'keyword',
      field: 'georeferencedBy',
    },
    datasetName: {
      type: 'keyword',
      field: 'datasetName',
    },
    typeStatus: {
      type: 'keyword',
      field: 'typeStatus.concepts',
    },
    typifiedName: {
      type: 'keyword',
      field: 'typifiedName',
    },
    verbatim: {
      field: 'verbatim',
      discarded: true,
    },
    waterBody: {
      type: 'keyword',
      field: 'waterBody',
      suggestField: 'waterBody.suggest',
    },
    year: {
      type: 'numeric',
      field: 'year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    agentIds_type: {
      type: 'keyword',
      field: 'agentIds.type',
    },
    agentIds_value: {
      type: 'keyword',
      field: 'agentIds.value',
    },
    classKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.classificationKeys.CLASS',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    familyKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.classificationKeys.FAMILY',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    genusKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.classificationKeys.GENUS',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    kingdomKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.classificationKeys.KINGDOM',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    orderKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.classificationKeys.ORDER',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    phylumKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.classificationKeys.PHYLUM',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    speciesKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.classificationKeys.SPECIES',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    taxonKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.taxonKeys',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    verbatimScientificName: {
      type: 'keyword',
      field: 'verbatimScientificName',
    },
    usageKey: {
      type: 'keyword',
      field: 'classifications.{checklistKey}.usage.key',
      defaultTemplateKeys: {
        checklistKey: DEFAULT_CHECKLIST_KEY,
      },
    },
    identifiedByIdType: {
      type: 'keyword',
      field: 'identifiedByIds.type',
    },
    identifiedById: {
      type: 'keyword',
      field: 'identifiedByIds.value',
    },
    recordedByIdType: {
      type: 'keyword',
      field: 'recordedByIds.type',
    },
    recordedById: {
      type: 'keyword',
      field: 'recordedByIds.value',
    },
  },
};

module.exports = {
  config,
};
