const config = 
{
  options: {
    q: {
      type: 'text',
      field: 'all',
      get: {
        type: 'fuzzy'
      }
    },
    amplificationItems: {
      field: 'amplificationItems',
      discarded: true
    },
    australiaSpatialLayers: {
      field: 'australiaSpatialLayers',
      discarded: true
    },
    basisOfRecord: {
      type: 'keyword',
      field: 'basisOfRecord'
    },
    catalogNumber: {
      type: 'keyword',
      field: 'catalogNumber',
      suggestField: 'catalogNumber.suggest'
    },
    collectionCode: {
      type: 'keyword',
      field: 'collectionCode',
      suggestField: 'collectionCode.suggest'
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
    coordinates: {
      field: 'coordinates',
      discarded: true
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
    eventDate: {
      field: 'eventDate',
      discarded: true
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
      field: 'institutionCode',
      suggestField: 'institutionCode.suggest'
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
      field: 'locality',
      suggestField: 'locality.suggest'
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
    measurementOrFactItems: {
      field: 'measurementOrFactItems',
      discarded: true
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
    multimediaItems: {
      field: 'multimediaItems',
      discarded: true
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
      field: 'occurrenceId',
      suggestField: 'occurrenceId.suggest'
    },
    organismId: {
      type: 'keyword',
      field: 'organismId',
      suggestField: 'organismId.suggest'
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
      field: 'recordNumber',
      suggestField: 'recordNumber.suggest'
    },
    recordedBy: {
      type: 'keyword',
      field: 'recordedBy',
      suggestField: 'recordedBy.suggest'
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
      field: 'stateProvince',
      suggestField: 'stateProvince.suggest'
    },
    typeStatus: {
      type: 'keyword',
      field: 'typeStatus'
    },
    typifiedName: {
      type: 'keyword',
      field: 'typifiedName'
    },
    verbatim: {
      field: 'verbatim',
      discarded: true
    },
    waterBody: {
      type: 'keyword',
      field: 'waterBody',
      suggestField: 'waterBody.suggest'
    },
    year: {
      type: 'numeric',
      field: 'year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'agentIds.type': {
      type: 'keyword',
      field: 'agentIds.type'
    },
    'agentIds.value': {
      type: 'keyword',
      field: 'agentIds.value'
    },
    'gbifClassification.class': {
      type: 'text',
      field: 'gbifClassification.class',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.classKey': {
      type: 'numeric',
      field: 'gbifClassification.classKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.classificationPath': {
      type: 'keyword',
      field: 'gbifClassification.classificationPath'
    },
    'gbifClassification.family': {
      type: 'text',
      field: 'gbifClassification.family',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.familyKey': {
      type: 'numeric',
      field: 'gbifClassification.familyKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.genus': {
      type: 'text',
      field: 'gbifClassification.genus',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.genusKey': {
      type: 'numeric',
      field: 'gbifClassification.genusKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.kingdom': {
      type: 'text',
      field: 'gbifClassification.kingdom',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.kingdomKey': {
      type: 'numeric',
      field: 'gbifClassification.kingdomKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.order': {
      type: 'text',
      field: 'gbifClassification.order',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.orderKey': {
      type: 'numeric',
      field: 'gbifClassification.orderKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.phylum': {
      type: 'text',
      field: 'gbifClassification.phylum',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.phylumKey': {
      type: 'numeric',
      field: 'gbifClassification.phylumKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.species': {
      type: 'text',
      field: 'gbifClassification.species',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.speciesKey': {
      type: 'numeric',
      field: 'gbifClassification.speciesKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.synonym': {
      type: 'boolean',
      field: 'gbifClassification.synonym'
    },
    'gbifClassification.taxonID': {
      type: 'keyword',
      field: 'gbifClassification.taxonID'
    },
    'taxonKey': {
      type: 'keyword',
      field: 'gbifClassification.taxonKey',
    },
    'gbifClassification.verbatimScientificName': {
      type: 'keyword',
      field: 'gbifClassification.verbatimScientificName'
    },
    'gbifClassification.acceptedUsage.key': {
      type: 'numeric',
      field: 'gbifClassification.acceptedUsage.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.acceptedUsage.name': {
      type: 'text',
      field: 'gbifClassification.acceptedUsage.name',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.acceptedUsage.rank': {
      type: 'keyword',
      field: 'gbifClassification.acceptedUsage.rank'
    },
    'gbifClassification.classification.key': {
      type: 'numeric',
      field: 'gbifClassification.classification.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.classification.name': {
      type: 'text',
      field: 'gbifClassification.classification.name',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.classification.rank': {
      type: 'keyword',
      field: 'gbifClassification.classification.rank'
    },
    'gbifClassification.classification.synonym': {
      type: 'boolean',
      field: 'gbifClassification.classification.synonym'
    },
    'gbifClassification.diagnostics.matchType': {
      type: 'keyword',
      field: 'gbifClassification.diagnostics.matchType'
    },
    'gbifClassification.diagnostics.note': {
      type: 'text',
      field: 'gbifClassification.diagnostics.note',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.diagnostics.status': {
      type: 'keyword',
      field: 'gbifClassification.diagnostics.status'
    },
    'gbifClassification.usage.key': {
      type: 'numeric',
      field: 'gbifClassification.usage.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    'gbifClassification.usage.name': {
      type: 'keyword',
      field: 'gbifClassification.usage.name'
    },
    'gbifClassification.usage.rank': {
      type: 'keyword',
      field: 'gbifClassification.usage.rank'
    },
    'gbifClassification.usageParsedName.abbreviated': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.abbreviated'
    },
    'gbifClassification.usageParsedName.autonym': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.autonym'
    },
    'gbifClassification.usageParsedName.binomial': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.binomial'
    },
    'gbifClassification.usageParsedName.candidatus': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.candidatus'
    },
    'gbifClassification.usageParsedName.code': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.code',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.doubtful': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.doubtful'
    },
    'gbifClassification.usageParsedName.genericName': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.genericName',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.genus': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.genus',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.incomplete': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.incomplete'
    },
    'gbifClassification.usageParsedName.indetermined': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.indetermined'
    },
    'gbifClassification.usageParsedName.infraspecificEpithet': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.infraspecificEpithet',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.notho': {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.notho'
    },
    'gbifClassification.usageParsedName.rank': {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.rank'
    },
    'gbifClassification.usageParsedName.specificEpithet': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.specificEpithet',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.state': {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.state'
    },
    'gbifClassification.usageParsedName.terminalEpithet': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.terminalEpithet',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.trinomial': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.trinomial'
    },
    'gbifClassification.usageParsedName.type': {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.type'
    },
    'gbifClassification.usageParsedName.uninomial': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.uninomial',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.basionymAuthorship.authors': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.authors',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.basionymAuthorship.empty': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.empty'
    },
    'gbifClassification.usageParsedName.basionymAuthorship.exAuthors': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.exAuthors',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.basionymAuthorship.year': {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.year'
    },
    'gbifClassification.usageParsedName.combinationAuthorship.authors': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.authors',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.combinationAuthorship.empty': {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.empty'
    },
    'gbifClassification.usageParsedName.combinationAuthorship.exAuthors': {
      type: 'text',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.exAuthors',
      get: {
        type: 'fuzzy'
      }
    },
    'gbifClassification.usageParsedName.combinationAuthorship.year': {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.year'
    }
  }
};

module.exports = {
  config
}