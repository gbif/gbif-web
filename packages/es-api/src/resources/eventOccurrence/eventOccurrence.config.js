const config = {
  options: {
    q: {
      type: 'text',
      field: 'occurrence.all',
      get: {
        type: 'fuzzy',
      },
    },
    amplificationItems: {
      field: 'occurrence.amplificationItems',
      discarded: true,
    },
    australiaSpatialLayers: {
      field: 'occurrence.australiaSpatialLayers',
      discarded: true,
    },
    basisOfRecord: {
      type: 'keyword',
      field: 'occurrence.basisOfRecord',
    },
    catalogNumber: {
      type: 'keyword',
      field: 'occurrence.catalogNumber.keyword',
      suggestField: 'catalogNumber.suggest',
    },
    isInCluster: {
      type: 'boolean',
      field: 'occurrence.isClustered',
    },
    collectionCode: {
      type: 'keyword',
      field: 'occurrence.collectionCode.keyword',
      suggestField: 'collectionCode.suggest',
    },
    collectionKey: {
      type: 'keyword',
      field: 'occurrence.collectionKey',
    },
    continent: {
      type: 'keyword',
      field: 'occurrence.continent',
    },
    coordinatePrecision: {
      type: 'numeric',
      field: 'occurrence.coordinatePrecision',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    coordinateUncertaintyInMeters: {
      type: 'numeric',
      field: 'occurrence.coordinateUncertaintyInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    coordinates: {
      field: 'occurrence.coordinates',
      discarded: true,
    },
    // "country": {
    //   "type": "text",
    //   "field": "occurrence.country",
    //   "get": {
    //     "type": "fuzzy"
    //   }
    // },
    country: {
      type: 'keyword',
      field: 'occurrence.countryCode',
    },
    countryCode: {
      type: 'keyword',
      field: 'occurrence.countryCode',
    },
    crawlId: {
      type: 'numeric',
      field: 'occurrence.crawlId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    created: {
      type: 'date',
      field: 'occurrence.created',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    datasetID: {
      type: 'keyword',
      field: 'occurrence.datasetID',
    },
    datasetKey: {
      type: 'keyword',
      field: 'metadata.datasetKey',
    },
    datasetName: {
      type: 'keyword',
      field: 'occurrence.datasetName.keyword',
      suggestField: 'datasetName.suggest',
    },
    datasetPublishingCountry: {
      type: 'keyword',
      field: 'occurrence.datasetPublishingCountry',
    },
    datasetTitle: {
      type: 'keyword',
      field: 'occurrence.datasetTitle',
    },
    dateIdentified: {
      type: 'date',
      field: 'occurrence.dateIdentified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    day: {
      type: 'numeric',
      field: 'occurrence.day',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    decimalLatitude: {
      type: 'numeric',
      field: 'occurrence.decimalLatitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    decimalLongitude: {
      type: 'numeric',
      field: 'occurrence.decimalLongitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    depth: {
      type: 'numeric',
      field: 'occurrence.depth',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    depthAccuracy: {
      type: 'numeric',
      field: 'occurrence.depthAccuracy',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    dwcaExtension: {
      type: 'keyword',
      field: 'occurrence.extensions',
    },
    elevation: {
      type: 'numeric',
      field: 'occurrence.elevation',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    elevationAccuracy: {
      type: 'numeric',
      field: 'occurrence.elevationAccuracy',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    endDayOfYear: {
      type: 'numeric',
      field: 'occurrence.endDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    endorsingNodeKey: {
      type: 'keyword',
      field: 'occurrence.endorsingNodeKey',
    },
    establishmentMeans: {
      type: 'keyword',
      field: 'occurrence.establishmentMeans.concept',
    },
    // "eventDate": {
    //   "field": "occurrence.eventDate",
    //   "discarded": true
    // },
    eventDate: {
      type: 'date',
      field: 'occurrence.eventDateSingle',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    eventID: {
      type: 'keyword',
      field: 'occurrence.eventId',
    },
    eventId: {
      type: 'keyword',
      field: 'occurrence.eventId',
    },
    eventHierarchy: {
      type: 'keyword',
      field: 'occurrence.eventHierarchy',
    },
    eventHierarchyJoined: {
      type: 'keyword',
      field: 'occurrence.eventHierarchyJoined',
    },
    eventTypeHierarchy: {
      type: 'keyword',
      field: 'occurrence.eventTypeHierarchy',
    },
    eventTypeHierarchyJoined: {
      type: 'keyword',
      field: 'occurrence.eventTypeHierarchyJoined',
    },
    gadmGid: {
      type: 'keyword',
      field: 'occurrence.gadm.gids',
    },
    key: {
      type: 'numeric',
      field: 'occurrence.gbifId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    hasCoordinate: {
      type: 'boolean',
      field: 'occurrence.hasCoordinate',
    },
    locationID: {
      type: 'keyword',
      field: 'occurrence.locationID.keyword',
    },
    hasGeospatialIssue: {
      type: 'boolean',
      field: 'occurrence.hasGeospatialIssue',
    },
    id: {
      type: 'keyword',
      field: 'occurrence.id',
    },
    identifiedBy: {
      type: 'keyword',
      field: 'occurrence.identifiedBy.verbatim',
      suggestField: 'identifiedBy.suggest',
    },
    individualCount: {
      type: 'numeric',
      field: 'occurrence.individualCount',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    installationKey: {
      type: 'keyword',
      field: 'occurrence.installationKey',
    },
    institutionCode: {
      type: 'keyword',
      field: 'occurrence.institutionCode.keyword',
      suggestField: 'institutionCode.suggest',
      suggestField: 'institutionCode.suggest',
    },
    institutionKey: {
      type: 'keyword',
      field: 'occurrence.institutionKey',
    },
    issue: {
      type: 'keyword',
      field: 'occurrence.issues',
    },
    lastCrawled: {
      type: 'date',
      field: 'occurrence.lastCrawled',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    license: {
      type: 'keyword',
      field: 'occurrence.license',
    },
    lifeStage: {
      type: 'keyword',
      field: 'occurrence.lifeStage',
    },
    locality: {
      type: 'keyword',
      field: 'occurrence.locality.keyword',
      suggestField: 'locality.suggest',
    },
    maximumDepthInMeters: {
      type: 'numeric',
      field: 'occurrence.maximumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    maximumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'occurrence.maximumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    maximumElevationInMeters: {
      type: 'numeric',
      field: 'occurrence.maximumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    measurementOrFactItems: {
      field: 'occurrence.measurementOrFactItems',
      discarded: true,
    },
    mediaLicenses: {
      type: 'keyword',
      field: 'occurrence.mediaLicenses',
    },
    mediaType: {
      type: 'keyword',
      field: 'occurrence.mediaTypes',
    },
    minimumDepthInMeters: {
      type: 'numeric',
      field: 'occurrence.minimumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    minimumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'occurrence.minimumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    minimumElevationInMeters: {
      type: 'numeric',
      field: 'occurrence.minimumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    modified: {
      type: 'date',
      field: 'occurrence.modified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    month: {
      type: 'numeric',
      field: 'occurrence.month',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    multimediaItems: {
      field: 'occurrence.multimediaItems',
      discarded: true,
    },
    networkKey: {
      type: 'keyword',
      field: 'occurrence.networkKeys',
    },
    notIssues: {
      type: 'keyword',
      field: 'occurrence.notIssues',
    },
    occurrenceId: {
      type: 'keyword',
      field: 'occurrence.occurrenceId.keyword',
      suggestField: 'occurrenceId.suggest',
    },
    occurrenceStatus: {
      type: 'keyword',
      field: 'occurrence.occurrenceStatus',
    },
    organismId: {
      type: 'keyword',
      field: 'occurrence.organismId.keyword',
      suggestField: 'organismId.suggest',
    },
    organismQuantity: {
      type: 'numeric',
      field: 'occurrence.organismQuantity',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    organismQuantityType: {
      type: 'keyword',
      field: 'occurrence.organismQuantityType',
    },
    parentEventID: {
      type: 'keyword',
      field: 'occurrence.parentEventID.keyword',
      suggestField: 'parentEventID.suggest',
    },
    parentEventId: {
      type: 'keyword',
      field: 'occurrence.parentEventID.keyword',
      suggestField: 'parentEventID.suggest',
    },
    preparations: {
      type: 'keyword',
      field: 'occurrence.preparations',
    },
    programmeAcronym: {
      type: 'keyword',
      field: 'occurrence.programmeAcronym',
    },
    projectId: {
      type: 'keyword',
      field: 'occurrence.projectId',
    },
    protocol: {
      type: 'keyword',
      field: 'occurrence.protocol',
    },
    publisherTitle: {
      type: 'keyword',
      field: 'occurrence.publisherTitle',
    },
    publishingCountry: {
      type: 'keyword',
      field: 'occurrence.publishingCountry',
    },
    publishingOrg: {
      type: 'keyword',
      field: 'occurrence.publishingOrganizationKey',
    },
    hostingOrganizationKey: {
      type: 'keyword',
      field: 'occurrence.hostingOrganizationKey',
    },
    recordNumber: {
      type: 'keyword',
      field: 'occurrence.recordNumber.keyword',
      suggestField: 'recordNumber.suggest',
    },
    recordedBy: {
      type: 'keyword',
      field: 'occurrence.recordedBy.verbatim',
      suggestField: 'recordedBy.suggest',
    },
    references: {
      type: 'text',
      field: 'occurrence.references',
      get: {
        type: 'fuzzy',
      },
    },
    relativeOrganismQuantity: {
      type: 'numeric',
      field: 'occurrence.relativeOrganismQuantity',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    repatriated: {
      type: 'boolean',
      field: 'occurrence.repatriated',
    },
    sampleSizeUnit: {
      type: 'keyword',
      field: 'occurrence.sampleSizeUnit',
    },
    sampleSizeValue: {
      type: 'numeric',
      field: 'occurrence.sampleSizeValue',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    samplingProtocol: {
      type: 'keyword',
      field: 'occurrence.samplingProtocol.keyword',
      suggestField: 'samplingProtocol.suggest',
    },
    geometry: {
      type: 'geo_shape',
      field: 'occurrence.scoordinates',
      get: {
        type: 'within',
      },
    },
    sex: {
      type: 'keyword',
      field: 'occurrence.sex',
    },
    startDayOfYear: {
      type: 'numeric',
      field: 'occurrence.startDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    stateProvince: {
      type: 'keyword',
      field: 'occurrence.stateProvince.keyword',
      suggestField: 'stateProvince.suggest',
    },
    typeStatus: {
      type: 'keyword',
      field: 'occurrence.typeStatus',
    },
    typifiedName: {
      type: 'keyword',
      field: 'occurrence.typifiedName',
    },
    verbatim: {
      field: 'occurrence.verbatim',
      discarded: true,
    },
    waterBody: {
      type: 'keyword',
      field: 'occurrence.waterBody.keyword',
      suggestField: 'waterBody.suggest',
    },
    year: {
      type: 'numeric',
      field: 'occurrence.year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    agentIds_type: {
      type: 'keyword',
      field: 'occurrence.agentIds.type',
    },
    agentIds_value: {
      type: 'keyword',
      field: 'occurrence.agentIds.value',
    },
    class: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.class',
      get: {
        type: 'fuzzy',
      },
    },
    classKey: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.classKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_classificationPath: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.classificationPath',
    },
    family: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.family',
      get: {
        type: 'fuzzy',
      },
    },
    familyKey: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.familyKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    genus: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.genus',
      get: {
        type: 'fuzzy',
      },
    },
    genusKey: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.genusKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    kingdom: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.kingdom',
      get: {
        type: 'fuzzy',
      },
    },
    kingdomKey: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.kingdomKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    order: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.order',
      get: {
        type: 'fuzzy',
      },
    },
    orderKey: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.orderKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    phylum: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.phylum',
      get: {
        type: 'fuzzy',
      },
    },
    phylumKey: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.phylumKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    species: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.species',
      get: {
        type: 'fuzzy',
      },
    },
    speciesKey: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.speciesKey',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    scientificNames: {
      type: 'keyword',
      field: 'scientificNames.keyword',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_synonym: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.synonym',
    },
    gbifClassification_taxonID: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.taxonID',
    },
    taxonKey: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.taxonKey',
    },
    verbatimScientificName: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.verbatimScientificName',
    },
    gbifClassification_acceptedUsage_key: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.acceptedUsage.guid',
    },
    gbifClassification_acceptedUsage_name: {
      type: 'text',
      field: 'occurrence.gbifClassification.acceptedUsage.name',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_acceptedUsage_rank: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.acceptedUsage.rank',
    },
    gbifClassification_classification_key: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.classification.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_classification_name: {
      type: 'text',
      field: 'occurrence.gbifClassification.classification.name',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_classification_rank: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.classification.rank',
    },
    gbifClassification_classification_synonym: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.classification.synonym',
    },
    gbifClassification_diagnostics_matchType: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.diagnostics.matchType',
    },
    gbifClassification_diagnostics_note: {
      type: 'text',
      field: 'occurrence.gbifClassification.diagnostics.note',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_diagnostics_status: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.diagnostics.status',
    },
    gbifClassification_usage_key: {
      type: 'numeric',
      field: 'occurrence.gbifClassification.usage.key',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gbifClassification_usage_name: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usage.name',
    },
    gbifClassification_usage_rank: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usage.rank',
    },
    gbifClassification_usageParsedName_abbreviated: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.abbreviated',
    },
    gbifClassification_usageParsedName_autonym: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.autonym',
    },
    gbifClassification_usageParsedName_binomial: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.binomial',
    },
    gbifClassification_usageParsedName_candidatus: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.candidatus',
    },
    gbifClassification_usageParsedName_code: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.code',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_doubtful: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.doubtful',
    },
    gbifClassification_usageParsedName_genericName: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.genericName',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_genus: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.genus',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_incomplete: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.incomplete',
    },
    gbifClassification_usageParsedName_indetermined: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.indetermined',
    },
    gbifClassification_usageParsedName_infraspecificEpithet: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.infraspecificEpithet',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_notho: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usageParsedName.notho',
    },
    gbifClassification_usageParsedName_rank: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usageParsedName.rank',
    },
    gbifClassification_usageParsedName_specificEpithet: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.specificEpithet',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_state: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usageParsedName.state',
    },
    gbifClassification_usageParsedName_terminalEpithet: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.terminalEpithet',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_trinomial: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.trinomial',
    },
    gbifClassification_usageParsedName_type: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usageParsedName.type',
    },
    gbifClassification_usageParsedName_uninomial: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.uninomial',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_basionymAuthorship_authors: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.basionymAuthorship.authors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_basionymAuthorship_empty: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.basionymAuthorship.empty',
    },
    gbifClassification_usageParsedName_basionymAuthorship_exAuthors: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.basionymAuthorship.exAuthors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_basionymAuthorship_year: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usageParsedName.basionymAuthorship.year',
    },
    gbifClassification_usageParsedName_combinationAuthorship_authors: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.combinationAuthorship.authors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_combinationAuthorship_empty: {
      type: 'boolean',
      field: 'occurrence.gbifClassification.usageParsedName.combinationAuthorship.empty',
    },
    gbifClassification_usageParsedName_combinationAuthorship_exAuthors: {
      type: 'text',
      field: 'occurrence.gbifClassification.usageParsedName.combinationAuthorship.exAuthors',
      get: {
        type: 'fuzzy',
      },
    },
    gbifClassification_usageParsedName_combinationAuthorship_year: {
      type: 'keyword',
      field: 'occurrence.gbifClassification.usageParsedName.combinationAuthorship.year',
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
