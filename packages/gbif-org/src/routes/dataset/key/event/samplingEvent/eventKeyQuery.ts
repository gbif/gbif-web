// Event API query used to fetch the rich event record (only available for
// proper sampling event datasets).
export const EVENT_KEY_QUERY = /* GraphQL */ `
  query event($eventId: ID, $datasetKey: ID, $checklistKey: ID) {
    event(eventId: $eventId, datasetKey: $datasetKey) {
      eventID
      parentEventID
      eventType
      eventDate {
        from
        to
      }
      coordinates
      datasetKey
      dataset {
        title
      }
      year
      month
      day
      subEvents(limit: 0) {
        count
      }
      sampleSizeUnit
      sampleSizeValue
      samplingProtocol
      samplingProtocols
      decimalLatitude
      decimalLongitude
      formattedCoordinates
      stateProvince
      locationID
      country
      continent
      waterBody
      coordinateUncertaintyInMeters
      coordinatePrecision
      distanceFromCentroidInMeters
      geodeticDatum
      depth
      depthAccuracy
      elevation
      elevationAccuracy
      startDayOfYear
      endDayOfYear
      dateIdentified
      protocol
      issues
      organismQuantity
      organismQuantityType
      relativeOrganismQuantity
      preparations
      parentEvent {
        eventID
        eventType
      }
      parentsLineage {
        id
        eventType
      }
      lineage {
        id
        eventID
        parentEventID
      }
      gadm
      identifiers {
        identifier
        type
      }
      media {
        type
        identifier
        title
        format
        references
        creator
        license
        rightsHolder
        description
        created
        thumbor(height: 400)
      }
      facts
      relations
      extensions {
        audubon
        image
        measurementOrFact
        multimedia
        extendedMeasurementOrFact
        reference
        identifier
        dnaDerivedData
        permit
        preparation
        releve
      }
      humboldt {
        abundanceCap
        areNonTargetTaxaFullyReported
        compilationSourceTypes
        compilationTypes
        eventDurationUnit
        eventDurationValue

        excludedDegreeOfEstablishmentScope
        excludedGrowthFormScope
        excludedHabitatScope
        excludedLifeStageScope
        geospatialScopeAreaUnit
        geospatialScopeAreaValue
        hasMaterialSamples
        hasNonTargetOrganisms
        hasNonTargetTaxa
        hasVouchers
        inventoryTypes
        isAbsenceReported
        isAbundanceCapReported
        isAbundanceReported
        isDegreeOfEstablishmentScopeFullyReported
        isGrowthFormScopeFullyReported
        isLeastSpecificTargetCategoryQuantityInclusive
        isLifeStageScopeFullyReported
        isSamplingEffortReported
        isTaxonomicScopeFullyReported
        isVegetationCoverReported
        materialSampleTypes
        protocolDescriptions
        protocolNames
        protocolReferences
        samplingEffortUnit
        samplingEffortValue
        samplingPerformedBy
        siteCount
        targetDegreeOfEstablishmentScope
        targetGrowthFormScope
        targetHabitatScope
        targetLifeStageScope

        targetTaxonomicScope(checklistKey: $checklistKey) {
          usageKey
          usageName
          usageRank
          classification {
            key
            name
            rank
          }
        }
        excludedTaxonomicScope(checklistKey: $checklistKey) {
          usageKey
          usageName
          usageRank
        }
        nonTargetTaxa(checklistKey: $checklistKey) {
          usageKey
          usageName
          usageRank
        }
        absentTaxa(checklistKey: $checklistKey) {
          usageKey
          usageName
          usageRank
        }

        taxonCompletenessProtocols
        totalAreaSampledUnit
        totalAreaSampledValue
        verbatimSiteDescriptions
        verbatimSiteNames
        voucherInstitutions
      }
    }
  }
`;
