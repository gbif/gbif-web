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
    crawlId: {
      type: 'numeric',
      field: 'crawlId',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    taxonKey: {
      join: 'occurrence',
      config: {
        options: {
          taxonKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.taxonKey'
          }
        }
      }
    },
    kingdomKey: {
      join: 'occurrence',
      config: {
        options: {
          kingdomKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.kingdomKey'
          }
        }
      }
    },
    phylumKey: {
      join: 'occurrence',
      config: {
        options: {
          phylumKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.phylumKey'
          }
        }
      }
    },
    classKey: {
      join: 'occurrence',
      config: {
        options: {
          classKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.classKey'
          }
        }
      }
    },
    orderKey: {
      join: 'occurrence',
      config: {
        options: {
          orderKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.orderKey'
          }
        }
      }
    },
    familyKey: {
      join: 'occurrence',
      config: {
        options: {
          familyKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.familyKey'
          }
        }
      }
    },
    genusKey: {
      join: 'occurrence',
      config: {
        options: {
          genusKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.genusKey'
          }
        }
      }
    },
    speciesKey: {
      join: 'occurrence',
      config: {
        options: {
          speciesKey: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.speciesKey'
          }
        }
      }
    },
    kingdom: {
      join: 'occurrence',
      config: {
        options: {
          kingdom: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.kingdom'
          }
        }
      }
    },
    phylum: {
      join: 'occurrence',
      config: {
        options: {
          phylum: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.phylum'
          }
        }
      }
    },
    class: {
      join: 'occurrence',
      config: {
        options: {
          class: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.class'
          }
        }
      }
    },
    order: {
      join: 'occurrence',
      config: {
        options: {
          order: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.order'
          }
        }
      }
    },
    family: {
      join: 'occurrence',
      config: {
        options: {
          family: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.family'
          }
        }
      }
    },
    genus: {
      join: 'occurrence',
      config: {
        options: {
          genus: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.genus'
          }
        }
      }
    },
    species: {
      join: 'occurrence',
      config: {
        options: {
          species: {
            type: 'keyword',
            field: 'occurrence.gbifClassification.species'
          }
        }
      }
    },
    occurrenceSamplingProtocol: {
      join: 'occurrence',
      config: {
        options: {
          occurrenceSamplingProtocol: {
            type: 'keyword',
            field: 'occurrence.samplingProtocol.keyword'
          }
        }
      }
    },
    recordedBy: {
      join: 'occurrence',
      config: {
        options: {
          recordedBy: {
            type: 'keyword',
            field: 'occurrence.recordedBy.verbatim'
          }
        }
      }
    },
    catalogNumber: {
      join: 'occurrence',
      config: {
        options: {
          catalogNumber: {
            type: 'keyword',
            field: 'occurrence.catalogNumber.keyword'
          }
        }
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
        defaultLowerBound: 'lte'
      }
    },
    scientificNames: {
      type: 'keyword',
      field: 'scientificNames'
    },
    id: {
      type: 'keyword',
      field: 'id'
    },
    internalId: {
      type: 'keyword',
      field: 'internalId'
    },
    joinRecord: {
      field: 'joinRecord',
      discarded: true
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
    uniqueKey: {
      type: 'keyword',
      field: 'uniqueKey'
    },
    continent: {
      type: 'keyword',
      field: 'event.continent'
    },
    coordinatePrecision: {
      type: 'numeric',
      field: 'event.coordinatePrecision',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    coordinateUncertaintyInMeters: {
      type: 'numeric',
      field: 'event.coordinateUncertaintyInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    coordinates: {
      field: 'event.coordinates',
      discarded: true
    },
    countryCode: {
      type: 'keyword',
      field: 'event.countryCode'
    },
    datasetID: {
      type: 'keyword',
      field: 'event.datasetID'
    },
    datasetName: {
      type: 'keyword',
      field: 'event.datasetName.keyword',
      suggestField: 'datasetName.suggest'
    },
    day: {
      type: 'numeric',
      field: 'event.day',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    decimalLatitude: {
      type: 'numeric',
      field: 'event.decimalLatitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    decimalLongitude: {
      type: 'numeric',
      field: 'event.decimalLongitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    endDayOfYear: {
      type: 'numeric',
      field: 'event.endDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    eventDate: {
      field: 'event.eventDate',
      discarded: true
    },
    eventDateSingle: {
      type: 'date',
      field: 'event.eventDateSingle',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    eventID: {
      type: 'keyword',
      field: 'event.eventID.keyword',
      suggestField: 'eventID.suggest'
    },
    surveyID: {
      type: 'keyword',
      field: 'event.surveyID.keyword'
    },
    eventType: {
      type: 'keyword',
      field: 'event.eventType.concept'
    },
    eventTypeHierarchyJoined: {
      type: 'keyword',
      field: 'event.eventTypeHierarchyJoined.keyword'
    },
    measurementOrFactTypes: {
      type: 'keyword',
      field: 'event.measurementOrFactTypes.keyword'
    },
    extensions: {
      type: 'keyword',
      field: 'event.extensions'
    },
    footprintWKT: {
      type: 'text',
      field: 'event.footprintWKT',
      get: {
        type: 'fuzzy'
      }
    },
    hasCoordinate: {
      type: 'boolean',
      field: 'event.hasCoordinate'
    },
    hasGeospatialIssue: {
      type: 'boolean',
      field: 'event.hasGeospatialIssue'
    },
    id: {
      type: 'keyword',
      field: 'event.id.keyword',
    },
    institutionCode: {
      type: 'keyword',
      field: 'event.institutionCode.keyword',
      suggestField: 'institutionCode.suggest'
    },
    issues: {
      type: 'keyword',
      field: 'event.issues'
    },
    locality: {
      type: 'keyword',
      field: 'event.locality.keyword',
      suggestField: 'locality.suggest'
    },
    locationID: {
      type: 'keyword',
      field: 'event.locationID.keyword',
      suggestField: 'locationID.suggest',
      displayField: 'event.locationID.verbatim'
    },
    maximumDepthInMeters: {
      type: 'numeric',
      field: 'event.maximumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    maximumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'event.maximumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    maximumElevationInMeters: {
      type: 'numeric',
      field: 'event.maximumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    measurementOrFactCount: {
      type: 'numeric',
      field: 'event.measurementOrFactCount'
    },
    measurementOrFactTypes: {
      type: 'keyword',
      field: 'event.measurementOrFactTypes.keyword'
    },
    mediaLicenses: {
      type: 'keyword',
      field: 'event.mediaLicenses'
    },
    mediaTypes: {
      type: 'keyword',
      field: 'event.mediaTypes'
    },
    minimumDepthInMeters: {
      type: 'numeric',
      field: 'event.minimumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    minimumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'event.minimumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    minimumElevationInMeters: {
      type: 'numeric',
      field: 'event.minimumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    modified: {
      type: 'date',
      field: 'event.modified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    month: {
      type: 'numeric',
      field: 'event.month',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    multimediaItems: {
      field: 'event.multimediaItems',
      discarded: true
    },
    notIssues: {
      type: 'keyword',
      field: 'event.notIssues'
    },
    parentEventID: {
      type: 'keyword',
      field: 'event.parentEventID.keyword',
      suggestField: 'parentEventID.suggest'
    },
    eventHierarchy: {
      type: 'keyword',
      field: 'event.eventHierarchy.keyword',
      suggestField: 'eventHierarchy.suggest'
    },
    eventHierarchyJoined: {
      type: 'keyword',
      field: 'event.eventHierarchyJoined.keyword',
      suggestField: 'eventHierarchyJoined.suggest'
    },
    eventTypeHierarchy: {
      type: 'keyword',
      field: 'event.eventTypeHierarchy.keyword',
      suggestField: 'event.eventTypeHierarchy.suggest',
      displayField: 'event.eventTypeHierarchy.verbatim'
    },
    eventTypeHierarchyJoined: {
      type: 'keyword',
      field: 'event.eventTypeHierarchyJoined.keyword',
      suggestField: 'eventTypeHierarchyJoined.suggest'
    },
    publishingCountry: {
      type: 'keyword',
      field: 'event.publishingCountry.keyword',
    },
    references: {
      type: 'text',
      field: 'event.references',
      get: {
        type: 'fuzzy'
      }
    },
    repatriated: {
      type: 'boolean',
      field: 'event.repatriated'
    },
    sampleSizeUnit: {
      type: 'keyword',
      field: 'event.sampleSizeUnit'
    },
    sampleSizeValue: {
      type: 'numeric',
      field: 'event.sampleSizeValue',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    samplingProtocol: {
      type: 'keyword',
      field: 'event.samplingProtocol.keyword',
      suggestField: 'samplingProtocol.suggest',
      displayField: 'event.samplingProtocol.verbatim'
    },
    scoordinates: {
      type: 'geo_shape',
      field: 'event.scoordinates',
      get: {
        type: 'within'
      }
    },
    startDayOfYear: {
      type: 'numeric',
      field: 'event.startDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    stateProvince: {
      type: 'keyword',
      field: 'event.stateProvince.keyword',
      suggestField: 'stateProvince.suggest',
      displayField: 'event.stateProvince.verbatim'
    },
    verbatimDepth: {
      type: 'keyword',
      field: 'event.verbatimDepth'
    },
    verbatimElevation: {
      type: 'keyword',
      field: 'event.verbatimElevation'
    },
    waterBody: {
      type: 'keyword',
      field: 'event.waterBody.keyword',
      suggestField: 'waterBody.suggest'
    },
    year: {
      type: 'numeric',
      field: 'event.year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    gadm_gids: {
      type: 'keyword',
      field: 'event.gadm.gids'
    },
    gadm_level0Gid: {
      type: 'keyword',
      field: 'event.gadm.level0Gid'
    },
    gadm_level0Name: {
      type: 'keyword',
      field: 'event.gadm.level0Name'
    },
    gadm_level1Gid: {
      type: 'keyword',
      field: 'event.gadm.level1Gid'
    },
    gadm_level1Name: {
      type: 'keyword',
      field: 'event.gadm.level1Name'
    },
    gadm_level2Gid: {
      type: 'keyword',
      field: 'event.gadm.level2Gid'
    },
    gadm_level2Name: {
      type: 'keyword',
      field: 'event.gadm.level2Name'
    },
    gadm_level3Gid: {
      type: 'keyword',
      field: 'event.gadm.level3Gid'
    },
    gadm_level3Name: {
      type: 'keyword',
      field: 'event.gadm.level3Name'
    },
    datasetKey: {
      type: 'keyword',
      field: 'metadata.datasetKey'
    },
    metadata_datasetPublishingCountry: {
      type: 'keyword',
      field: 'metadata.datasetPublishingCountry'
    },
    datasetTitle: {
      type: 'keyword',
      field: 'metadata.datasetTitle'
    },
    metadata_endorsingNodeKey: {
      type: 'keyword',
      field: 'metadata.endorsingNodeKey'
    },
    metadata_hostingOrganizationKey: {
      type: 'keyword',
      field: 'metadata.hostingOrganizationKey'
    },
    metadata_installationKey: {
      type: 'keyword',
      field: 'metadata.installationKey'
    },
    metadata_license: {
      type: 'keyword',
      field: 'metadata.license'
    },
    metadata_networkKeys: {
      type: 'keyword',
      field: 'metadata.networkKeys'
    },
    metadata_programmeAcronym: {
      type: 'keyword',
      field: 'metadata.programmeAcronym'
    },
    metadata_projectId: {
      type: 'keyword',
      field: 'metadata.projectId'
    },
    metadata_protocol: {
      type: 'keyword',
      field: 'metadata.protocol'
    },
    metadata_publisherTitle: {
      type: 'keyword',
      field: 'metadata.publisherTitle'
    },
    metadata_publishingCountry: {
      type: 'keyword',
      field: 'metadata.publishingCountry'
    },
    metadata_publishingOrganizationKey: {
      type: 'keyword',
      field: 'metadata.publishingOrganizationKey'
    },
    occurrence: {
      type: 'join',
      config: {
        prefix: 'occurrence',
        options: {
          basisOfRecord: {
            type: 'keyword',
            field: 'basisOfRecord'
          },
          class: {
            type: 'keyword',
            field: 'gbifClassification.classKey'
          },
          eventID: {
            type: 'keyword',
            field: 'eventID'
          },
          family: {
            type: 'keyword',
            field: 'gbifClassification.familyKey'
          },
          genus: {
            type: 'keyword',
            field: 'gbifClassification.genusKey'
          },
          identificationReferences: {
            type: 'keyword',
            field: 'core.identificationReferences'
          },
          identificationRemarks: {
            type: 'keyword',
            field: 'core.identificationRemarks'
          },
          kingdom: {
            type: 'keyword',
            field: 'gbifClassification.kingdomKey'
          },
          occurrenceID: {
            type: 'keyword',
            field: 'core.occurrenceID'
          },
          order: {
            type: 'keyword',
            field: 'gbifClassification.orderKey'
          },
          organismQuantity: {
            type: 'keyword',
            field: 'core.organismQuantity'
          },
          organismQuantityType: {
            type: 'keyword',
            field: 'core.organismQuantityType'
          },
          phylum: {
            type: 'keyword',
            field: 'gbifClassification.phylumKey'
          },
          scientificName: {
            type: 'keyword',
            field: 'gbifClassification.acceptedUsage.name.keyword'
          },
          taxonRank: {
            type: 'keyword',
            field: 'gbifClassification.acceptedUsage.rank'
          },
          taxonKey: {
            type: 'keyword',
            field: 'core.taxonomy.taxonKey'
          }
        }
      }
    },
    kingdoms: {
      type: 'keyword',
      field: 'event.kingdoms.keyword'
    },
    phyla: {
      type: 'keyword',
      field: 'event.phyla.keyword'
    },
    orders: {
      type: 'keyword',
      field: 'event.orders.keyword'
    },
    classes: {
      type: 'keyword',
      field: 'event.classes.keyword'
    },
    families: {
      type: 'keyword',
      field: 'event.families.keyword'
    },
    genera: {
      type: 'keyword',
      field: 'event.genera.keyword'
    },
    basisOfRecord: {
      type: 'keyword',
      field: 'occurrence.core.basisOfRecord'
    },
    class: {
      type: 'keyword',
      field: 'occurrence.core.class'
    },
    // eventID: {
    //   type: 'keyword',
    //   field: 'occurrence.core.eventID'
    // },
    family: {
      type: 'keyword',
      field: 'occurrence.core.family'
    },
    genus: {
      type: 'keyword',
      field: 'occurrence.core.genus'
    },
    identificationReferences: {
      type: 'keyword',
      field: 'occurrence.core.identificationReferences'
    },
    identificationRemarks: {
      type: 'keyword',
      field: 'occurrence.occurrence.core.identificationRemarks'
    },
    occurrenceID: {
      type: 'keyword',
      field: 'occurrence.core.occurrenceID'
    },
    order: {
      type: 'keyword',
      field: 'occurrence.core.order'
    },
    organismQuantity: {
      type: 'keyword',
      field: 'occurrence.core.organismQuantity'
    },
    organismQuantityType: {
      type: 'keyword',
      field: 'occurrence.core.organismQuantityType'
    },
    phylum: {
      type: 'keyword',
      field: 'occurrence.core.phylum'
    },
    scientificName: {
      type: 'keyword',
      field: 'occurrence.core.scientificName'
    },
    taxonRank: {
      type: 'keyword',
      field: 'occurrence.core.taxonRank'
    }
  }
};

module.exports = {
  config
}