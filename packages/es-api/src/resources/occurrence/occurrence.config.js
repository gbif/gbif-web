const config = {
  options: {
    q: {
      type: 'text',
      field: 'all',
      get: {
        type: 'fuzzy',
      },
    },
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
    catalogNumber: {
      type: 'keyword',
      field: 'catalogNumber.keyword',
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
    datasetName: {
      type: 'keyword',
      field: 'datasetName.keyword',
      suggestField: 'datasetName.suggest',
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
    eventId: {
      type: 'keyword',
      field: 'eventId.keyword',
      suggestField: 'eventId.suggest',
    },
    gadmGid: {
      type: 'keyword',
      field: 'gadm.gids',
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
      field: 'identifiedBy.keyword',
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
      suggestField: 'institutionCode.suggest',
    },
    institutionKey: {
      type: 'keyword',
      field: 'institutionKey',
    },
    issue: {
      type: 'keyword',
      field: 'issues',
    },
    iucnRedListCategory: {
      type: 'keyword',
      field: 'gbifClassification.iucnRedListCategoryCode',
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
      field: 'locality.keyword',
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
      field: 'occurrenceId.keyword',
      suggestField: 'occurrenceId.suggest',
    },
    occurrenceStatus: {
      type: 'keyword',
      field: 'occurrenceStatus',
    },
    organismId: {
      type: 'keyword',
      field: 'organismId.keyword',
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
    parentEventId: {
      type: 'keyword',
      field: 'parentEventId.keyword',
      suggestField: 'parentEventId.suggest',
    },
    preparations: {
      type: 'keyword',
      field: 'preparations.keyword',
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
      field: 'recordedBy.keyword',
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
      field: 'samplingProtocol.keyword',
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
      field: 'stateProvince.keyword',
      suggestField: 'stateProvince.suggest',
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
      field: 'waterBody.keyword',
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
    class: {
      type: 'text',
      field: 'gbifClassification.class',
      get: {
        type: 'fuzzy',
      },
    },
    classKey: {
      type: 'numeric',
      field: 'gbifClassification.classKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_classificationPath: {
      type: 'keyword',
      field: 'gbifClassification.classificationPath',
    },
    family: {
      type: 'text',
      field: 'gbifClassification.family',
      get: {
        type: 'fuzzy',
      },
    },
    familyKey: {
      type: 'numeric',
      field: 'gbifClassification.familyKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    genus: {
      type: 'text',
      field: 'gbifClassification.genus',
      get: {
        type: 'fuzzy',
      },
    },
    genusKey: {
      type: 'numeric',
      field: 'gbifClassification.genusKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    kingdom: {
      type: 'text',
      field: 'gbifClassification.kingdom',
      get: {
        type: 'fuzzy',
      },
    },
    kingdomKey: {
      type: 'numeric',
      field: 'gbifClassification.kingdomKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    order: {
      type: 'text',
      field: 'gbifClassification.order',
      get: {
        type: 'fuzzy',
      },
    },
    orderKey: {
      type: 'numeric',
      field: 'gbifClassification.orderKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    phylum: {
      type: 'text',
      field: 'gbifClassification.phylum',
      get: {
        type: 'fuzzy',
      },
    },
    phylumKey: {
      type: 'numeric',
      field: 'gbifClassification.phylumKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    species: {
      type: 'text',
      field: 'gbifClassification.species',
      get: {
        type: 'fuzzy',
      },
    },
    speciesKey: {
      type: 'numeric',
      field: 'gbifClassification.speciesKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_synonym: {
      type: 'boolean',
      field: 'gbifClassification.synonym',
    },
    gbifClassification_taxonID: {
      type: 'keyword',
      field: 'gbifClassification.taxonID',
    },
    taxonKey: {
      type: 'keyword',
      field: 'gbifClassification.taxonKey',
    },
    verbatimScientificName: {
      type: 'keyword',
      field: 'gbifClassification.verbatimScientificName',
    },
    gbifClassification_acceptedUsage_key: {
      type: 'numeric',
      field: 'gbifClassification.acceptedUsage.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_acceptedUsage_name: {
      type: 'text',
      field: 'gbifClassification.acceptedUsage.name',
      get: {
        type: 'fuzzy',
      },
    },
    // "gbifClassification_acceptedUsage_rank": {
    //   "type": "keyword",
    //   "field": "gbifClassification.acceptedUsage.rank"
    // },
    gbifClassification_classification_key: {
      type: 'numeric',
      field: 'gbifClassification.classification.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_classification_name: {
      type: 'text',
      field: 'gbifClassification.classification.name',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_classification_rank: {
      type: 'keyword',
      field: 'gbifClassification.classification.rank',
    },
    gbifClassification_classification_synonym: {
      type: 'boolean',
      field: 'gbifClassification.classification.synonym',
    },
    gbifClassification_diagnostics_matchType: {
      type: 'keyword',
      field: 'gbifClassification.diagnostics.matchType',
    },
    gbifClassification_diagnostics_note: {
      type: 'text',
      field: 'gbifClassification.diagnostics.note',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_diagnostics_status: {
      type: 'keyword',
      field: 'gbifClassification.diagnostics.status',
    },
    gbifClassification_usage_key: {
      type: 'numeric',
      field: 'gbifClassification.usage.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_usage_name: {
      type: 'keyword',
      field: 'gbifClassification.usage.name',
    },
    gbifClassification_usage_rank: {
      type: 'keyword',
      field: 'gbifClassification.usage.rank',
    },
    gbifClassification_usageParsedName_abbreviated: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.abbreviated',
    },
    gbifClassification_usageParsedName_autonym: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.autonym',
    },
    gbifClassification_usageParsedName_binomial: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.binomial',
    },
    gbifClassification_usageParsedName_candidatus: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.candidatus',
    },
    gbifClassification_usageParsedName_code: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.code',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_doubtful: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.doubtful',
    },
    gbifClassification_usageParsedName_genericName: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.genericName',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_genus: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.genus',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_incomplete: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.incomplete',
    },
    gbifClassification_usageParsedName_indetermined: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.indetermined',
    },
    gbifClassification_usageParsedName_infraspecificEpithet: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.infraspecificEpithet',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_notho: {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.notho',
    },
    gbifClassification_usageParsedName_rank: {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.rank',
    },
    gbifClassification_usageParsedName_specificEpithet: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.specificEpithet',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_state: {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.state',
    },
    gbifClassification_usageParsedName_terminalEpithet: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.terminalEpithet',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_trinomial: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.trinomial',
    },
    gbifClassification_usageParsedName_type: {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.type',
    },
    gbifClassification_usageParsedName_uninomial: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.uninomial',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_basionymAuthorship_authors: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.authors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_basionymAuthorship_empty: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.empty',
    },
    gbifClassification_usageParsedName_basionymAuthorship_exAuthors: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.exAuthors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_basionymAuthorship_year: {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.basionymAuthorship.year',
    },
    gbifClassification_usageParsedName_combinationAuthorship_authors: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.authors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_combinationAuthorship_empty: {
      type: 'boolean',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.empty',
    },
    gbifClassification_usageParsedName_combinationAuthorship_exAuthors: {
      type: 'text',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.exAuthors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_combinationAuthorship_year: {
      type: 'keyword',
      field: 'gbifClassification.usageParsedName.combinationAuthorship.year',
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
