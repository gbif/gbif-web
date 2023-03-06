import { useState, useEffect, useContext } from 'react';
import { ApiContext, ApiClient } from '../../../dataManagement/api';
import { useQuery, } from '../../../dataManagement/api';
import get from 'lodash/get';
import _ from 'lodash';

// requires a graphql endpoint running on the model
const customClient = new ApiClient({
  gql: {
    endpoint: 'http://labs.gbif.org:7002/graphql'
  }
});

function useEventData({ eventId }) {
  const client = useContext(ApiContext);
  const [content, setContent] = useState();
  const { data, error, loading, load } = useQuery(EVENTS, { client: customClient, lazyLoad: true });

  useEffect(() => {
    if (typeof eventId !== 'undefined') {
      const query = {
        variables: {
          key: eventId
        }
      };
      load(query);
    }
  }, [eventId]);

  useEffect(() => {
    if (data && !loading && !error) {
      // flatten events
      const events = flattenEvents(data.eventByEventId);
      console.log('events', events)
      setContent(events);
    }
  }, [data, loading, error]);

  return [content, error, loading];
}

export default useEventData;

const OCCURRENCE_FIELDS = `
  occurrenceId
  organismId
  organismQuantity
  organismQuantityType
  sex
  lifeStage
  reproductiveCondition
  behavior
  establishmentMeans
  occurrenceStatus
  pathway
  degreeOfEstablishment
  georeferenceVerificationStatus
  occurrenceRemarks
  informationWithheld
  dataGeneralizations
  recordedBy
  recordedById
  associatedMedia
  associatedOccurrences
  associatedTaxa
`;

const GEOREFERENCE_QUERY_PART = `
  georeferenceId
  decimalLatitude
  decimalLongitude
  geodeticDatum
  coordinateUncertaintyInMeters
  coordinatePrecision
  pointRadiusSpatialFit
  footprintWkt
  footprintSrs
  footprintSpatialFit
  georeferencedBy
  georeferencedDate
  georeferenceProtocol
  georeferenceSources
  georeferenceRemarks
  preferredSpatialRepresentation
`;

const EVENT_QUERY_PART = `
  eventId
  eventType
  eventName
  fieldNumber
  eventDate
  verbatimEventDate
  verbatimLocality
  verbatimElevation
  verbatimDepth
  verbatimCoordinates
  verbatimLatitude
  verbatimLongitude
  verbatimCoordinateSystem
  verbatimSrs
  habitat
  protocolDescription
  sampleSizeUnit
  sampleSizeValue
  eventEffort
  fieldNotes
  eventRemarks
  locationId # notice that this is different from the provided value. And that the dwc term can have meaning: https://dwc.tdwg.org/terms/#dwc:locationID
  occurrence: occurrenceByOccurrenceId {
    ${OCCURRENCE_FIELDS}
  }
  location: locationByLocationId {
    higherGeography
    continent
    waterBody
    islandGroup
    island
    countryCode
    stateProvince
    county
    municipality
    locality
    minimumElevationInMeters
    maximumElevationInMeters
    minimumDistanceAboveSurfaceInMeters
    maximumDistanceAboveSurfaceInMeters
    minimumDepthInMeters
    maximumDepthInMeters
    verticalDatum
    locationAccordingTo
    locationRemarks
    
    georeference: georeferenceByAcceptedGeoreferenceId {
      ${GEOREFERENCE_QUERY_PART}
    }
    # georeferencing history if any
    georeferences: georeferencesByLocationId(first: 10) {
      totalCount
      nodes {
        ${GEOREFERENCE_QUERY_PART}
      }
    }
  }
`;

const EVENTS = `
query($key: String!) {
  eventByEventId(eventId: $key) {
    ${EVENT_QUERY_PART}
    eventByParentEventId {
      ${EVENT_QUERY_PART}
      eventByParentEventId {
        ${EVENT_QUERY_PART}
        eventByParentEventId {
          ${EVENT_QUERY_PART}
        }
      }
    }
  }
}
`;

function flattenEvents(event) {
  const flattened = [];
  let current = event;
  while (current) {
    flattened.push(current);
    current = current.eventByParentEventId;
  }
  
  // add a flag to each entry to indicate if it is the first (lowest level) usage of the location
  const locations = [];
  flattened.forEach((e) => {
    if (e.locationId) {
      if (locations.indexOf(e.locationId) === -1) {
        e.isFirstLocation = true;
        locations.push(e.locationId);
      }
    }
  });

  //reverse events so that the parent event is first
  flattened.reverse();

  return flattened;
}

