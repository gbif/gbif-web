const config = {
  options: {
    q: {
      type: 'text',
      field: 'all',
      get: {
        type: 'fuzzy',
      },
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
    taxonKey: {
      join: 'occurrence',
      config: {
        options: {
          taxonKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.taxonKey',
          },
        },
      },
    },
    kingdomKey: {
      join: 'occurrence',
      config: {
        options: {
          kingdomKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.kingdomKey',
          },
        },
      },
    },
    phylumKey: {
      join: 'occurrence',
      config: {
        options: {
          phylumKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.phylumKey',
          },
        },
      },
    },
    classKey: {
      join: 'occurrence',
      config: {
        options: {
          classKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.classKey',
          },
        },
      },
    },
    orderKey: {
      join: 'occurrence',
      config: {
        options: {
          orderKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.orderKey',
          },
        },
      },
    },
    familyKey: {
      join: 'occurrence',
      config: {
        options: {
          familyKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.familyKey',
          },
        },
      },
    },
    genusKey: {
      join: 'occurrence',
      config: {
        options: {
          genusKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.genusKey',
          },
        },
      },
    },
    speciesKey: {
      join: 'occurrence',
      config: {
        options: {
          speciesKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.speciesKey',
          },
        },
      },
    },
    kingdom: {
      join: 'occurrence',
      config: {
        options: {
          kingdom: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.kingdom',
          },
        },
      },
    },
    phylum: {
      join: 'occurrence',
      config: {
        options: {
          phylum: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.phylum',
          },
        },
      },
    },
    class: {
      join: 'occurrence',
      config: {
        options: {
          class: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.class',
          },
        },
      },
    },
    order: {
      join: 'occurrence',
      config: {
        options: {
          order: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.order',
          },
        },
      },
    },
    family: {
      join: 'occurrence',
      config: {
        options: {
          family: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.family',
          },
        },
      },
    },
    genus: {
      join: 'occurrence',
      config: {
        options: {
          genus: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.genus',
          },
        },
      },
    },
    species: {
      join: 'occurrence',
      config: {
        options: {
          species: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.species',
          },
        },
      },
    },
    occurrenceSamplingProtocol: {
      join: 'occurrence',
      config: {
        options: {
          occurrenceSamplingProtocol: {
            type: 'keyword',
            field: 'occurrence.samplingProtocol.keyword',
          },
        },
      },
    },
    recordedBy: {
      join: 'occurrence',
      config: {
        options: {
          recordedBy: {
            type: 'keyword',
            field: 'occurrence.recordedBy.verbatim',
          },
        },
      },
    },
    catalogNumber: {
      join: 'occurrence',
      config: {
        options: {
          catalogNumber: {
            type: 'keyword',
            field: 'occurrence.catalogNumber.keyword',
          },
        },
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
    occurrenceCount: {
      type: 'numeric',
      field: 'event.occurrenceCount',
    },
    firstLoaded: {
      type: 'date',
      field: 'firstLoaded',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    scientificNames: {
      type: 'keyword',
      field: 'scientificNames',
    },
    country: {
      type: 'keyword',
      field: 'event.countryCode',
    },
    id: {
      type: 'keyword',
      field: 'id',
    },
    internalId: {
      type: 'keyword',
      field: 'internalId',
    },
    joinRecord: {
      field: 'joinRecord',
      discarded: true,
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
    uniqueKey: {
      type: 'keyword',
      field: 'uniqueKey',
    },
    continent: {
      type: 'keyword',
      field: 'event.continent',
    },
    coordinatePrecision: {
      type: 'numeric',
      field: 'event.coordinatePrecision',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    coordinateUncertaintyInMeters: {
      type: 'numeric',
      field: 'event.coordinateUncertaintyInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    coordinates: {
      field: 'event.coordinates',
      discarded: true,
    },
    countryCode: {
      type: 'keyword',
      field: 'event.countryCode',
    },
    datasetId: {
      type: 'keyword',
      field: 'event.datasetID',
    },
    datasetName: {
      type: 'keyword',
      field: 'event.datasetName.keyword',
      suggestField: 'datasetName.suggest',
    },
    day: {
      type: 'numeric',
      field: 'event.day',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    decimalLatitude: {
      type: 'numeric',
      field: 'event.decimalLatitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    decimalLongitude: {
      type: 'numeric',
      field: 'event.decimalLongitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    endDayOfYear: {
      type: 'numeric',
      field: 'event.endDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    // eventDate: {
    //   field: 'event.eventDate',
    //   discarded: true,
    // },
    eventDate: {
      type: 'date',
      field: 'event.eventDateSingle',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    eventId: {
      type: 'keyword',
      field: 'event.eventHierarchy.keyword',
    },
    surveyId: {
      type: 'keyword',
      field: 'event.surveyID.keyword',
    },
    eventType: {
      type: 'keyword',
      field: 'event.eventTypeHierarchy.keyword',
    },
    eventTypeHierarchyJoined: {
      type: 'keyword',
      field: 'event.eventTypeHierarchyJoined.keyword',
    },
    verbatimEventType: {
      type: 'keyword',
      field: 'event.verbatimEventTypeHierarchy.keyword',
    },
    eventTypeHierarchyJoined: {
      type: 'keyword',
      field: 'event.verbatimEventTypeHierarchyJoined.keyword',
    },
    measurementOrFactTypes: {
      type: 'keyword',
      field: 'event.measurementOrFactTypes.keyword',
    },
    measurementOrFactMethods: {
      type: 'keyword',
      field: 'event.measurementOrFactMethods.keyword',
    },
    extensions: {
      type: 'keyword',
      field: 'event.extensions',
    },
    footprintWKT: {
      type: 'text',
      field: 'event.footprintWKT',
      get: {
        type: 'fuzzy',
      },
    },
    hasCoordinate: {
      type: 'boolean',
      field: 'event.hasCoordinate',
    },
    geometry: {
      type: 'geo_shape',
      field: 'event.scoordinates',
      get: {
        type: 'within',
      },
    },
    hasGeospatialIssue: {
      type: 'boolean',
      field: 'event.hasGeospatialIssue',
    },
    id: {
      type: 'keyword',
      field: 'event.id.keyword',
    },
    fieldNumber: {
      type: 'keyword',
      field: 'event.fieldNumber',
    },
    humboldt: {
      type: 'nested',
      field: 'event.humboldt',
      properties: {
        /*         absentTaxa: {
          properties: {
            '7ddf754f-d193-4cc9-b351-99906754a03b': {
              properties: {
                classification: {
                  properties: {
                    KINGDOM: {
                      type: 'keyword',
                    },
                  },
                },
                classificationKeys: {
                  properties: {
                    KINGDOM: {
                      type: 'keyword',
                    },
                  },
                },
                issues: {
                  type: 'keyword',
                },
                taxonKeys: {
                  type: 'keyword',
                },
                usageKey: {
                  type: 'keyword',
                },
                usageName: {
                  type: 'keyword',
                },
                usageRank: {
                  type: 'keyword',
                },
              },
            },
            'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c': {
              properties: {
                classification: {
                  properties: {
                    KINGDOM: {
                      type: 'keyword',
                    },
                  },
                },
                classificationKeys: {
                  properties: {
                    KINGDOM: {
                      type: 'keyword',
                    },
                  },
                },
                issues: {
                  type: 'keyword',
                },
                taxonKeys: {
                  type: 'keyword',
                },
                usageKey: {
                  type: 'keyword',
                },
                usageName: {
                  type: 'keyword',
                },
                usageRank: {
                  type: 'keyword',
                },
              },
            },
          },
        }, */
        abundanceCap: {
          type: 'integer',
          field: 'event.humboldt.abundanceCap',
        },
        areNonTargetTaxaFullyReported: {
          type: 'boolean',
          field: 'event.humboldt.areNonTargetTaxaFullyReported',
        },
        compilationSourceTypes: {
          type: 'keyword',
          field: 'event.humboldt.compilationSourceTypes',
        },
        compilationTypes: {
          type: 'keyword',
          field: 'event.humboldt.compilationTypes',
        },
        eventDurationUnit: {
          type: 'keyword',
          field: 'event.humboldt.eventDurationUnit',
        },
        eventDurationValue: {
          type: 'double',
          field: 'event.humboldt.eventDurationValue',
        },
        eventDurationValueInMinutes: {
          type: 'double',
          field: 'event.humboldt.eventDurationValueInMinutes',
        },
        excludedDegreeOfEstablishmentScope: {
          properties: {
            concept: {
              type: 'keyword',
              field: 'event.humboldt.excludedDegreeOfEstablishmentScope.concept',
            },
            lineage: {
              type: 'keyword',
              field: 'event.humboldt.excludedDegreeOfEstablishmentScope.lineage',
            },
          },
        },
        excludedGrowthFormScope: {
          type: 'keyword',
          field: 'event.humboldt.excludedGrowthFormScope',
        },
        excludedHabitatScope: {
          type: 'keyword',
          field: 'event.humboldt.excludedHabitatScope',
        },
        excludedLifeStageScope: {
          properties: {
            concept: {
              type: 'keyword',
              field: 'event.humboldt.excludedLifeStageScope.concept',
            },
            lineage: {
              type: 'keyword',
              field: 'event.humboldt.excludedLifeStageScope.lineage',
            },
          },
        },
        geospatialScopeAreaUnit: {
          type: 'keyword',
          field: 'event.humboldt.geospatialScopeAreaUnit',
        },
        geospatialScopeAreaValue: {
          type: 'double',
          field: 'event.humboldt.geospatialScopeAreaValue',
        },
        hasMaterialSamples: {
          type: 'boolean',
          field: 'event.humboldt.hasMaterialSamples',
        },
        hasNonTargetOrganisms: {
          type: 'boolean',
          field: 'event.humboldt.hasNonTargetOrganisms',
        },
        hasNonTargetTaxa: {
          type: 'boolean',
          field: 'event.humboldt.hasNonTargetTaxa',
        },
        hasVouchers: {
          type: 'boolean',
          field: 'event.humboldt.hasVouchers',
        },
        inventoryTypes: {
          type: 'keyword',
          field: 'event.humboldt.inventoryTypes',
        },
        isAbsenceReported: {
          type: 'boolean',
          field: 'event.humboldt.isAbsenceReported',
        },
        isAbundanceCapReported: {
          type: 'boolean',
          field: 'event.humboldt.isAbundanceCapReported',
        },
        isAbundanceReported: {
          type: 'boolean',
          field: 'event.humboldt.isAbundanceReported',
        },
        isDegreeOfEstablishmentScopeFullyReported: {
          type: 'boolean',
          field: 'event.humboldt.isDegreeOfEstablishmentScopeFullyReported',
        },
        isGrowthFormScopeFullyReported: {
          type: 'boolean',
          field: 'event.humboldt.isGrowthFormScopeFullyReported',
        },
        isLeastSpecificTargetCategoryQuantityInclusive: {
          type: 'boolean',
          field: 'event.humboldt.isLeastSpecificTargetCategoryQuantityInclusive',
        },
        isLifeStageScopeFullyReported: {
          type: 'boolean',
          field: 'event.humboldt.isLifeStageScopeFullyReported',
        },
        isSamplingEffortReported: {
          type: 'boolean',
          field: 'event.humboldt.isSamplingEffortReported',
        },
        isTaxonomicScopeFullyReported: {
          type: 'boolean',
          field: 'event.humboldt.isTaxonomicScopeFullyReported',
        },
        isVegetationCoverReported: {
          type: 'boolean',
          field: 'event.humboldt.isVegetationCoverReported',
        },
        materialSampleTypes: {
          type: 'keyword',
          field: 'event.humboldt.materialSampleTypes',
        },
        protocolDescriptions: {
          type: 'text',
          field: 'event.humboldt.protocolDescriptions',
          index: false,
        },
        protocolNames: {
          type: 'keyword',
          field: 'event.humboldt.protocolNames',
        },
        protocolReferences: {
          type: 'text',
          field: 'event.humboldt.protocolReferences',
          index: false,
        },
        samplingEffortUnit: {
          type: 'keyword',
          field: 'event.humboldt.samplingEffortUnit',
        },
        samplingEffortValue: {
          type: 'double',
          field: 'event.humboldt.samplingEffortValue',
        },
        samplingPerformedBy: {
          type: 'keyword',
          field: 'event.humboldt.samplingPerformedBy',
        },
        siteCount: {
          type: 'integer',
          field: 'event.humboldt.siteCount',
        },
        targetDegreeOfEstablishmentScope: {
          properties: {
            concept: {
              type: 'keyword',
              field: 'event.humboldt.targetDegreeOfEstablishmentScope.concept',
            },
            lineage: {
              type: 'keyword',
              field: 'event.humboldt.targetDegreeOfEstablishmentScope.lineage',
            },
          },
        },
        targetGrowthFormScope: {
          type: 'keyword',
          field: 'event.humboldt.targetGrowthFormScope',
        },
        targetHabitatScope: {
          type: 'keyword',
          field: 'event.humboldt.targetHabitatScope',
        },
        targetLifeStageScope: {
          properties: {
            concept: {
              type: 'keyword',
              field: 'event.humboldt.targetLifeStageScope.concept',
            },
            lineage: {
              type: 'keyword',
              field: 'event.humboldt.targetLifeStageScope.lineage',
            },
          },
        },
        /*   targetTaxonomicScope: {
          properties: {
            '7ddf754f-d193-4cc9-b351-99906754a03b': {
              properties: {
                classification: {
                  properties: {
                    CLASS: {
                      type: 'keyword',
                    },
                    KINGDOM: {
                      type: 'keyword',
                    },
                    PHYLUM: {
                      type: 'keyword',
                    },
                  },
                },
                classificationKeys: {
                  properties: {
                    CLASS: {
                      type: 'keyword',
                    },
                    KINGDOM: {
                      type: 'keyword',
                    },
                    PHYLUM: {
                      type: 'keyword',
                    },
                  },
                },
                issues: {
                  type: 'keyword',
                },
                taxonKeys: {
                  type: 'keyword',
                },
                usageKey: {
                  type: 'keyword',
                },
                usageName: {
                  type: 'keyword',
                },
                usageRank: {
                  type: 'keyword',
                },
              },
            },
            'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c': {
              properties: {
                classification: {
                  properties: {
                    CLASS: {
                      type: 'keyword',
                    },
                    KINGDOM: {
                      type: 'keyword',
                    },
                    PHYLUM: {
                      type: 'keyword',
                    },
                  },
                },
                classificationKeys: {
                  properties: {
                    CLASS: {
                      type: 'keyword',
                    },
                    KINGDOM: {
                      type: 'keyword',
                    },
                    PHYLUM: {
                      type: 'keyword',
                    },
                  },
                },
                issues: {
                  type: 'keyword',
                },
                taxonKeys: {
                  type: 'keyword',
                },
                usageKey: {
                  type: 'keyword',
                },
                usageName: {
                  type: 'keyword',
                },
                usageRank: {
                  type: 'keyword',
                },
              },
            },
          },
        }, */
        taxonCompletenessProtocols: {
          type: 'keyword',
          field: 'event.humboldt.taxonCompletenessProtocols',
        },
        totalAreaSampledUnit: {
          type: 'keyword',
          field: 'event.humboldt.totalAreaSampledUnit',
        },
        totalAreaSampledValue: {
          type: 'double',
          field: 'event.humboldt.totalAreaSampledValue',
        },
        verbatimSiteDescriptions: {
          type: 'text',
          field: 'event.humboldt.verbatimSiteDescriptions',
          index: false,
        },
        verbatimSiteNames: {
          type: 'keyword',
          field: 'event.humboldt.verbatimSiteNames',
        },
        voucherInstitutions: {
          type: 'keyword',
          field: 'event.humboldt.voucherInstitutions',
        },
      },
    },
    institutionCode: {
      type: 'keyword',
      field: 'event.institutionCode.keyword',
      suggestField: 'institutionCode.suggest',
    },
    issues: {
      type: 'keyword',
      field: 'event.issues',
    },
    locality: {
      type: 'keyword',
      field: 'event.locality.keyword',
      suggestField: 'locality.suggest',
    },
    locationId: {
      type: 'keyword',
      field: 'event.locationID.keyword',
      suggestField: 'locationID.suggest',
      displayField: 'event.locationID.verbatim',
    },
    maximumDepthInMeters: {
      type: 'numeric',
      field: 'event.maximumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    maximumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'event.maximumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    maximumElevationInMeters: {
      type: 'numeric',
      field: 'event.maximumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    measurementOrFactCount: {
      type: 'numeric',
      field: 'event.measurementOrFactCount',
    },
    measurementOrFactTypes: {
      type: 'keyword',
      field: 'event.measurementOrFactTypes.keyword',
    },
    mediaLicenses: {
      type: 'keyword',
      field: 'event.mediaLicenses',
    },
    mediaTypes: {
      type: 'keyword',
      field: 'event.mediaTypes',
    },
    minimumDepthInMeters: {
      type: 'numeric',
      field: 'event.minimumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    minimumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'event.minimumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    minimumElevationInMeters: {
      type: 'numeric',
      field: 'event.minimumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    modified: {
      type: 'date',
      field: 'event.modified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    month: {
      type: 'numeric',
      field: 'event.month',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    multimediaItems: {
      field: 'event.multimediaItems',
      discarded: true,
    },
    notIssues: {
      type: 'keyword',
      field: 'event.notIssues',
    },
    parentEventId: {
      type: 'keyword',
      field: 'event.parentEventID.keyword',
      suggestField: 'parentEventID.suggest',
    },
    eventHierarchy: {
      type: 'keyword',
      field: 'event.eventHierarchy.keyword',
      suggestField: 'eventHierarchy.suggest',
    },
    eventHierarchyJoined: {
      type: 'keyword',
      field: 'event.eventHierarchyJoined.keyword',
      suggestField: 'eventHierarchyJoined.suggest',
    },
    eventTypeHierarchy: {
      type: 'keyword',
      field: 'event.eventTypeHierarchy.keyword',
      suggestField: 'event.eventTypeHierarchy.suggest',
      displayField: 'event.eventTypeHierarchy.verbatim',
    },
    eventTypeHierarchyJoined: {
      type: 'keyword',
      field: 'event.eventTypeHierarchyJoined.keyword',
      suggestField: 'eventTypeHierarchyJoined.suggest',
    },
    eventHierarchyLevels: {
      type: 'numeric',
      field: 'event.eventHierarchyLevels',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gadmGid: {
      type: 'keyword',
      field: 'event.gadm.gids',
    },
    publishingCountry: {
      type: 'keyword',
      field: 'event.publishingCountry.keyword',
    },
    references: {
      type: 'text',
      field: 'event.references',
      get: {
        type: 'fuzzy',
      },
    },
    repatriated: {
      type: 'boolean',
      field: 'event.repatriated',
    },
    sampleSizeUnit: {
      type: 'keyword',
      field: 'event.sampleSizeUnit',
    },
    sampleSizeValue: {
      type: 'numeric',
      field: 'event.sampleSizeValue',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    samplingProtocol: {
      type: 'keyword',
      field: 'event.samplingProtocol.keyword',
      suggestField: 'samplingProtocol.suggest',
      displayField: 'event.samplingProtocol.verbatim',
    },
    scoordinates: {
      type: 'geo_shape',
      field: 'event.scoordinates',
      get: {
        type: 'within',
      },
    },
    startDayOfYear: {
      type: 'numeric',
      field: 'event.startDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    stateProvince: {
      type: 'keyword',
      field: 'event.stateProvince.keyword',
      suggestField: 'stateProvince.suggest',
      displayField: 'event.stateProvince.verbatim',
    },
    depth: {
      type: 'numeric',
      field: 'event.depth',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    dwcaExtension: {
      type: 'keyword',
      field: 'event.extensions',
    },
    elevation: {
      type: 'numeric',
      field: 'event.elevation',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    verbatimDepth: {
      type: 'keyword',
      field: 'event.verbatimDepth',
    },
    verbatimElevation: {
      type: 'keyword',
      field: 'event.verbatimElevation',
    },
    waterBody: {
      type: 'keyword',
      field: 'event.waterBody.keyword',
      suggestField: 'waterBody.suggest',
    },
    year: {
      type: 'numeric',
      field: 'event.year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte',
      },
    },
    gadm_gids: {
      type: 'keyword',
      field: 'event.gadm.gids',
    },
    gadm_level0Gid: {
      type: 'keyword',
      field: 'event.gadm.level0Gid',
    },
    gadm_level0Name: {
      type: 'keyword',
      field: 'event.gadm.level0Name',
    },
    gadm_level1Gid: {
      type: 'keyword',
      field: 'event.gadm.level1Gid',
    },
    gadm_level1Name: {
      type: 'keyword',
      field: 'event.gadm.level1Name',
    },
    gadm_level2Gid: {
      type: 'keyword',
      field: 'event.gadm.level2Gid',
    },
    gadm_level2Name: {
      type: 'keyword',
      field: 'event.gadm.level2Name',
    },
    gadm_level3Gid: {
      type: 'keyword',
      field: 'event.gadm.level3Gid',
    },
    gadm_level3Name: {
      type: 'keyword',
      field: 'event.gadm.level3Name',
    },
    datasetKey: {
      type: 'keyword',
      field: 'metadata.datasetKey',
    },
    metadata_datasetPublishingCountry: {
      type: 'keyword',
      field: 'metadata.datasetPublishingCountry',
    },
    datasetTitle: {
      type: 'keyword',
      field: 'metadata.datasetTitle',
    },
    metadata_endorsingNodeKey: {
      type: 'keyword',
      field: 'metadata.endorsingNodeKey',
    },
    metadata_hostingOrganizationKey: {
      type: 'keyword',
      field: 'metadata.hostingOrganizationKey',
    },
    metadata_installationKey: {
      type: 'keyword',
      field: 'metadata.installationKey',
    },
    metadata_license: {
      type: 'keyword',
      field: 'metadata.license',
    },
    metadata_networkKeys: {
      type: 'keyword',
      field: 'metadata.networkKeys',
    },
    metadata_programmeAcronym: {
      type: 'keyword',
      field: 'metadata.programmeAcronym',
    },
    metadata_projectId: {
      type: 'keyword',
      field: 'metadata.projectId',
    },
    metadata_protocol: {
      type: 'keyword',
      field: 'metadata.protocol',
    },
    metadata_publisherTitle: {
      type: 'keyword',
      field: 'metadata.publisherTitle',
    },
    metadata_publishingCountry: {
      type: 'keyword',
      field: 'metadata.publishingCountry',
    },
    publishingOrganizationKey: {
      type: 'keyword',
      field: 'metadata.publishingOrganizationKey',
    },
    occurrence: {
      type: 'join',
      config: {
        prefix: 'occurrence',
        options: {
          basisOfRecord: {
            type: 'keyword',
            field: 'basisOfRecord',
          },
          class: {
            type: 'keyword',
            field: 'gbifClassification.classKey',
          },
          eventId: {
            type: 'keyword',
            field: 'eventID',
          },
          family: {
            type: 'keyword',
            field: 'gbifClassification.familyKey',
          },
          genus: {
            type: 'keyword',
            field: 'gbifClassification.genusKey',
          },
          identificationReferences: {
            type: 'keyword',
            field: 'core.identificationReferences',
          },
          identificationRemarks: {
            type: 'keyword',
            field: 'core.identificationRemarks',
          },
          kingdom: {
            type: 'keyword',
            field: 'gbifClassification.kingdomKey',
          },
          occurrenceId: {
            type: 'keyword',
            field: 'core.occurrenceID',
          },
          order: {
            type: 'keyword',
            field: 'gbifClassification.orderKey',
          },
          organismQuantity: {
            type: 'keyword',
            field: 'core.organismQuantity',
          },
          organismQuantityType: {
            type: 'keyword',
            field: 'core.organismQuantityType',
          },
          phylum: {
            type: 'keyword',
            field: 'gbifClassification.phylumKey',
          },
          scientificName: {
            type: 'keyword',
            field: 'gbifClassification.acceptedUsage.name.keyword',
          },
          taxonRank: {
            type: 'keyword',
            field: 'gbifClassification.acceptedUsage.rank',
          },
          taxonKey: {
            type: 'keyword',
            field: 'core.taxonomy.taxonKey',
          },
        },
      },
    },
    kingdoms: {
      type: 'keyword',
      field: 'event.kingdoms.keyword',
    },
    phyla: {
      type: 'keyword',
      field: 'event.phyla.keyword',
    },
    orders: {
      type: 'keyword',
      field: 'event.orders.keyword',
    },
    classes: {
      type: 'keyword',
      field: 'event.classes.keyword',
    },
    families: {
      type: 'keyword',
      field: 'event.families.keyword',
    },
    genera: {
      type: 'keyword',
      field: 'event.genera.keyword',
    },
    basisOfRecord: {
      type: 'keyword',
      field: 'occurrence.core.basisOfRecord',
    },
    class: {
      type: 'keyword',
      field: 'occurrence.core.class',
    },
    // eventId: {
    //   type: 'keyword',
    //   field: 'occurrence.core.eventID'
    // },
    family: {
      type: 'keyword',
      field: 'occurrence.core.family',
    },
    genus: {
      type: 'keyword',
      field: 'occurrence.core.genus',
    },
    identificationReferences: {
      type: 'keyword',
      field: 'occurrence.core.identificationReferences',
    },
    identificationRemarks: {
      type: 'keyword',
      field: 'occurrence.occurrence.core.identificationRemarks',
    },
    occurrenceId: {
      type: 'keyword',
      field: 'occurrence.core.occurrenceID',
    },
    order: {
      type: 'keyword',
      field: 'occurrence.core.order',
    },
    organismQuantity: {
      type: 'keyword',
      field: 'occurrence.core.organismQuantity',
    },
    organismQuantityType: {
      type: 'keyword',
      field: 'occurrence.core.organismQuantityType',
    },
    phylum: {
      type: 'keyword',
      field: 'occurrence.core.phylum',
    },
    scientificName: {
      type: 'keyword',
      field: 'occurrence.core.scientificName',
    },
    taxonRank: {
      type: 'keyword',
      field: 'occurrence.core.taxonRank',
    },
  },
};

module.exports = {
  config,
};
