// Event API query used to fetch the rich event record (only available for
// proper sampling event datasets).
export const EVENT_KEY_QUERY = /* GraphQL */ `
  query event($eventId: ID, $datasetKey: ID) {
    event(eventId: $eventId, datasetKey: $datasetKey) {
      eventID
      parentEventID
      eventType
      eventDate {
        from
        to
      }
      eventName
      coordinates
      countryCode
      datasetKey
      datasetTitle
      year
      month
      occurrenceCount
      measurementOrFactTypes
      sampleSizeUnit
      sampleSizeValue
      samplingProtocol
      decimalLatitude
      decimalLongitude
      locality
      stateProvince
      locationID
      extensions {
        audubon
        image
        measurementOrFact
        multimedia
        extendedMeasurementOrFact
        humboldtEcologicalInventory
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
