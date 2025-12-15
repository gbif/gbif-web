import useQuery from '@/hooks/useQuery';
import { useCallback, useEffect } from 'react';
import { Event } from './Event';

// GraphQL query interfaces (you'll need to generate these from your schema)
interface EventQuery {
  event: {
    eventID: string;
    parentEventID?: string;
    eventType?: string;
    eventName?: string;
    coordinates?: {
      lat: number;
      lon: number;
    };
    countryCode?: string;
    datasetKey: string;
    datasetTitle?: string;
    year?: number;
    month?: number;
    occurrenceCount?: number;
    measurementOrFactTypes?: string[];
    sampleSizeUnit?: string;
    sampleSizeValue?: number;
    samplingProtocol?: string;
    eventTypeHierarchyJoined?: string;
    eventHierarchyJoined?: string;
    eventTypeHierarchy?: string[];
    eventHierarchy?: string[];
    decimalLatitude?: number;
    decimalLongitude?: number;
    locality?: string;
    stateProvince?: string;
    temporalCoverage?: {
      gte?: string;
      lte?: string;
    };
  };
  eventSearch: {
    facet: {
      eventTypeHierarchyJoined: Array<{
        key: string;
        count: number;
      }>;
    };
  };
}

interface EventQueryVariables {
  eventId: string;
  datasetKey: string;
}

// graphql query for event
const GRAPHQL_EVENT = `
query event($eventId: ID, $datasetKey: ID){
  event(eventId: $eventId, datasetKey: $datasetKey) {
    eventID
    parentEventID
    eventType
    eventDate {
    from
    to}
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
    eventTypeHierarchyJoined
    eventHierarchyJoined
    eventTypeHierarchy
    eventHierarchy    
    eventTypeHierarchy
    eventHierarchy
    decimalLatitude
    decimalLongitude
    locality
    stateProvince
    locationID
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

export default function EventDrawer({ entityKey }: { entityKey?: string }) {
  const { data, loading, error, load } = useQuery<EventQuery, EventQueryVariables>(GRAPHQL_EVENT, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  const getEventLink = useCallback((datasetid: string, eventId: string) => {
    // generate a link to show the event in a drawer. To do that take the current url and replace or add an entity search param with the format `e_{datasetKey}_{eventId}`
    const url = new URL(window.location.href);
    const currentSearchParams = new URLSearchParams(url.search);
    const entitySearch = currentSearchParams.get('entity');
    if (entitySearch) {
      // if entity search already exists, replace it
      currentSearchParams.set('entity', `e_${datasetid}_${eventId}`);
    } else {
      // if entity search does not exist, add it
      currentSearchParams.append('entity', `e_${datasetid}_${eventId}`);
    }
    url.search = currentSearchParams.toString();
    return url.toString();
  }, []);

  useEffect(() => {
    if (entityKey) {
      const datasetKey = entityKey.split('_')[0];
      const eventId = entityKey.substring(entityKey.indexOf('_') + 1);

      if (datasetKey && eventId) {
        load({
          variables: {
            eventId: eventId,
            datasetKey: datasetKey,
          },
        });
      }
    }
  }, [entityKey, load]);

  if (!entityKey) {
    return null;
  }

  if (loading) {
    return (
      <div className="g-p-4">
        <div>Loading event data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="g-p-4">
        <div>Error loading event: {error.message}</div>
      </div>
    );
  }

  if (!data?.event) {
    return (
      <div className="g-p-4">
        <div>Event not found</div>
      </div>
    );
  }

  return <Event event={data.event} eventSearch={data.eventSearch} getEventLink={getEventLink} />;
}
