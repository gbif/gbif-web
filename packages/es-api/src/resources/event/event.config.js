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
    firstLoaded: {
      type: 'date',
      field: 'firstLoaded',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
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
    type: {
      type: 'keyword',
      field: 'type'
    },
    uniqueKey: {
      type: 'keyword',
      field: 'uniqueKey'
    },
    verbatim: {
      field: 'verbatim',
      discarded: true
    },
    event_continent: {
      type: 'keyword',
      field: 'event.continent'
    },
    event_coordinatePrecision: {
      type: 'numeric',
      field: 'event.coordinatePrecision',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_coordinateUncertaintyInMeters: {
      type: 'numeric',
      field: 'event.coordinateUncertaintyInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_coordinates: {
      field: 'event.coordinates',
      discarded: true
    },
    event_country: {
      type: 'text',
      field: 'event.country',
      get: {
        type: 'fuzzy'
      }
    },
    event_countryCode: {
      type: 'keyword',
      field: 'event.countryCode'
    },
    event_datasetID: {
      type: 'keyword',
      field: 'event.datasetID'
    },
    event_datasetName: {
      type: 'text',
      field: 'event.datasetName',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'datasetName.suggest'
    },
    event_day: {
      type: 'numeric',
      field: 'event.day',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_decimalLatitude: {
      type: 'numeric',
      field: 'event.decimalLatitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_decimalLongitude: {
      type: 'numeric',
      field: 'event.decimalLongitude',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_endDayOfYear: {
      type: 'numeric',
      field: 'event.endDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_eventDate: {
      field: 'event.eventDate',
      discarded: true
    },
    event_eventDateSingle: {
      type: 'date',
      field: 'event.eventDateSingle',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_eventId: {
      type: 'text',
      field: 'event.eventId',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'eventId.suggest'
    },
    event_extensions: {
      type: 'keyword',
      field: 'event.extensions'
    },
    event_footprintWKT: {
      type: 'text',
      field: 'event.footprintWKT',
      get: {
        type: 'fuzzy'
      }
    },
    event_hasCoordinate: {
      type: 'boolean',
      field: 'event.hasCoordinate'
    },
    event_hasGeospatialIssue: {
      type: 'boolean',
      field: 'event.hasGeospatialIssue'
    },
    event_id: {
      type: 'text',
      field: 'event.id',
      get: {
        type: 'fuzzy'
      }
    },
    event_institutionCode: {
      type: 'text',
      field: 'event.institutionCode',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'institutionCode.suggest'
    },
    event_issues: {
      type: 'keyword',
      field: 'event.issues'
    },
    event_locality: {
      type: 'text',
      field: 'event.locality',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'locality.suggest'
    },
    event_maximumDepthInMeters: {
      type: 'numeric',
      field: 'event.maximumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_maximumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'event.maximumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_maximumElevationInMeters: {
      type: 'numeric',
      field: 'event.maximumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_mediaLicenses: {
      type: 'keyword',
      field: 'event.mediaLicenses'
    },
    event_mediaTypes: {
      type: 'keyword',
      field: 'event.mediaTypes'
    },
    event_minimumDepthInMeters: {
      type: 'numeric',
      field: 'event.minimumDepthInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_minimumDistanceAboveSurfaceInMeters: {
      type: 'numeric',
      field: 'event.minimumDistanceAboveSurfaceInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_minimumElevationInMeters: {
      type: 'numeric',
      field: 'event.minimumElevationInMeters',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_modified: {
      type: 'date',
      field: 'event.modified',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_month: {
      type: 'numeric',
      field: 'event.month',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_multimediaItems: {
      field: 'event.multimediaItems',
      discarded: true
    },
    event_notIssues: {
      type: 'keyword',
      field: 'event.notIssues'
    },
    event_parentEventId: {
      type: 'text',
      field: 'event.parentEventId',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'parentEventId.suggest'
    },
    event_publishingCountry: {
      type: 'text',
      field: 'event.publishingCountry',
      get: {
        type: 'fuzzy'
      }
    },
    event_references: {
      type: 'text',
      field: 'event.references',
      get: {
        type: 'fuzzy'
      }
    },
    event_repatriated: {
      type: 'boolean',
      field: 'event.repatriated'
    },
    event_sampleSizeUnit: {
      type: 'keyword',
      field: 'event.sampleSizeUnit'
    },
    event_sampleSizeValue: {
      type: 'numeric',
      field: 'event.sampleSizeValue',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_samplingProtocol: {
      type: 'text',
      field: 'event.samplingProtocol',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'samplingProtocol.suggest'
    },
    event_samplingProtocolJoined: {
      type: 'keyword',
      field: 'event.samplingProtocolJoined'
    },
    event_scoordinates: {
      type: 'geo_shape',
      field: 'event.scoordinates',
      get: {
        type: 'within'
      }
    },
    event_startDayOfYear: {
      type: 'numeric',
      field: 'event.startDayOfYear',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_stateProvince: {
      type: 'text',
      field: 'event.stateProvince',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'stateProvince.suggest'
    },
    event_verbatimDepth: {
      type: 'keyword',
      field: 'event.verbatimDepth'
    },
    event_verbatimElevation: {
      type: 'keyword',
      field: 'event.verbatimElevation'
    },
    event_waterBody: {
      type: 'text',
      field: 'event.waterBody',
      get: {
        type: 'fuzzy'
      },
      suggestField: 'waterBody.suggest'
    },
    event_year: {
      type: 'numeric',
      field: 'event.year',
      get: {
        type: 'range_or_term',
        defaultUpperBound: 'gte',
        defaultLowerBound: 'lte'
      }
    },
    event_gadm_gids: {
      type: 'keyword',
      field: 'event.gadm.gids'
    },
    event_gadm_level0Gid: {
      type: 'keyword',
      field: 'event.gadm.level0Gid'
    },
    event_gadm_level0Name: {
      type: 'keyword',
      field: 'event.gadm.level0Name'
    },
    event_gadm_level1Gid: {
      type: 'keyword',
      field: 'event.gadm.level1Gid'
    },
    event_gadm_level1Name: {
      type: 'keyword',
      field: 'event.gadm.level1Name'
    },
    event_gadm_level2Gid: {
      type: 'keyword',
      field: 'event.gadm.level2Gid'
    },
    event_gadm_level2Name: {
      type: 'keyword',
      field: 'event.gadm.level2Name'
    },
    event_gadm_level3Gid: {
      type: 'keyword',
      field: 'event.gadm.level3Gid'
    },
    event_gadm_level3Name: {
      type: 'keyword',
      field: 'event.gadm.level3Name'
    },
    metadata_datasetKey: {
      type: 'keyword',
      field: 'metadata.datasetKey'
    },
    metadata_datasetPublishingCountry: {
      type: 'keyword',
      field: 'metadata.datasetPublishingCountry'
    },
    metadata_datasetTitle: {
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
    occurrence_core_basisOfRecord: {
      type: 'keyword',
      field: 'occurrence.core.basisOfRecord'
    },
    occurrence_core_class: {
      type: 'keyword',
      field: 'occurrence.core.class'
    },
    occurrence_core_eventID: {
      type: 'keyword',
      field: 'occurrence.core.eventID'
    },
    occurrence_core_family: {
      type: 'keyword',
      field: 'occurrence.core.family'
    },
    occurrence_core_genus: {
      type: 'keyword',
      field: 'occurrence.core.genus'
    },
    occurrence_core_identificationReferences: {
      type: 'keyword',
      field: 'occurrence.core.identificationReferences'
    },
    occurrence_core_identificationRemarks: {
      type: 'keyword',
      field: 'occurrence.core.identificationRemarks'
    },
    occurrence_core_kingdom: {
      type: 'keyword',
      field: 'occurrence.core.kingdom'
    },
    occurrence_core_occurrenceID: {
      type: 'keyword',
      field: 'occurrence.core.occurrenceID'
    },
    occurrence_core_order: {
      type: 'keyword',
      field: 'occurrence.core.order'
    },
    occurrence_core_organismQuantity: {
      type: 'keyword',
      field: 'occurrence.core.organismQuantity'
    },
    occurrence_core_organismQuantityType: {
      type: 'keyword',
      field: 'occurrence.core.organismQuantityType'
    },
    occurrence_core_phylum: {
      type: 'keyword',
      field: 'occurrence.core.phylum'
    },
    occurrence_core_scientificName: {
      type: 'keyword',
      field: 'occurrence.core.scientificName'
    },
    occurrence_core_taxonRank: {
      type: 'keyword',
      field: 'occurrence.core.taxonRank'
    }
  }
};

module.exports = {
  config
}