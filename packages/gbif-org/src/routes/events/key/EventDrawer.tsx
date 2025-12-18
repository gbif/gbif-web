import useQuery from '@/hooks/useQuery';
import { useCallback, useEffect } from 'react';
//import { Event } from './Event';
import { Event } from '@/routes/dataset/key/event/event';
import {
  DatasetEventQuery,
  DatasetEventQueryVariables,
  EventQuery,
  EventQueryVariables,
  DatasetType,
} from '@/gql/graphql';
import { EVENT_QUERY } from '@/routes/dataset/key/event/eventID';
// GraphQL query interfaces (you'll need to generate these from your schema)

// graphql query for event
export const GRAPHQL_EVENT = /* GraphQL */ `
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

export default function EventDrawer({ entityKey }: { entityKey?: string }) {
  const {
    data: eventData,
    loading,
    error,
    load,
  } = useQuery<EventQuery, EventQueryVariables>(GRAPHQL_EVENT, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  const {
    data: occData,
    loading: occLoading,
    error: occError,
    load: occLoad,
  } = useQuery<DatasetEventQuery, DatasetEventQueryVariables>(EVENT_QUERY, {
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
      currentSearchParams.set('entity', `e_${datasetid}___${eventId}`);
    } else {
      // if entity search does not exist, add it
      currentSearchParams.append('entity', `e_${datasetid}___${eventId}`);
    }
    url.search = currentSearchParams.toString();
    return url.toString();
  }, []);

  useEffect(() => {
    if (entityKey) {
      const datasetKey = entityKey.split('___')[0];
      const eventId = entityKey.split('___')?.[1];

      if (datasetKey && eventId) {
        occLoad({
          variables: {
            key: datasetKey,
            limit: 1,
            offset: 0,
            eventID: eventId,
          },
        });
      }
    }
  }, [entityKey, load]);

  useEffect(() => {
    if (occData?.dataset?.type == DatasetType.SamplingEvent && entityKey) {
      const datasetKey = entityKey.split('___')[0];
      const eventId = entityKey.split('___')?.[1];
      load({
        variables: {
          eventId: eventId,
          datasetKey: datasetKey,
        },
      });
    }
  }, [occData?.dataset?.type, entityKey, load]);

  if (!entityKey) {
    return null;
  }

  if (loading || occLoading) {
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
  /* 
  if (!data?.event) {
    return (
      <div className="g-p-4">
        <div>Event not found</div>
      </div>
    );
  } */

  return (
    <div className="g-p-4 g-bg-slate-100">
      <Event
        data={occData}
        eventData={eventData}
        eventDataLoading={loading}
        /* event={data.event} eventSearch={data.eventSearch} */ getEventLink={getEventLink}
      />
    </div>
  );
}
