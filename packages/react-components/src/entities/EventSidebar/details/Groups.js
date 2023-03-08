import React, {useCallback} from 'react';
import { FormattedMessage } from 'react-intl';
import {Accordion, Button, Properties} from "../../../components";
import {PlainTextField, EnumField, HtmlField, LinkedField, DateRangeField, VocabField, Field} from './properties';
import * as css from "../styles";

const { Term: T, Value: V } = Properties;

export function Groups({
     event,
     setActiveEvent,
     addToSearch,
     showAll }) {

  let termMap = {}
  Object.entries(event).forEach(item => {
    termMap[item[0]] = { "simpleName": item[0], "value": item[1] }
  })

  return <>
    <Event                {...{ showAll, termMap, event, setActiveEvent, addToSearch }} />
    <Location             {...{ showAll, termMap, event }} />
  </>
}

export function Group({ label, ...props }) {
  return <Accordion
    summary={<FormattedMessage id={label} />}
    defaultOpen={true}
    css={css.group()}
    {...props}
  />
}

export function Structure({ event, setActiveEvent }) {

  const eventHierarchy = event.eventHierarchy;
  const eventTypeHierarchy = event.eventTypeHierarchy;
  let combinedHierarchy = [];

  for (let i = 0; i < eventHierarchy.length; i++) {
    combinedHierarchy.push({
      key: eventHierarchy[i],
      name: eventTypeHierarchy[i],
      isSelected: eventTypeHierarchy[i] == event.eventType.concept,
      count: 1
    });
  }
  return <>
    <span>
      {combinedHierarchy.map((node, idx) =>
        <StructureNode
            key={node.key}
            eventType={node.name}
            eventID={node.key}
            datasetKey={event.datasetKey}
            idx={idx}
            isLast={(combinedHierarchy.length -1) == idx}
            setActiveEvent={setActiveEvent}
        />)
      }
    </span>
  </>;
}

export function StructureNode({ eventID, datasetKey, eventType, idx, isLast, setActiveEvent }) {
  const viewNode = useCallback(() => {
    setActiveEvent(eventID,  datasetKey);
  }, []);
  const first = (idx == 0);
  return <>
    {!first && <span> &#8250; </span>}
    {isLast &&
        <span>{eventType}</span>
    }
    {!isLast &&
        <a href="#" onClick={viewNode}>{eventType}</a>
    }
  </>;
}

function Event({ showAll, termMap, event, setActiveEvent, addToSearch }) {
  const hasContent = [
    'eventID',
    'parentEventID',
    'eventTypeHierarchyJoined',
    'eventName',
    'fieldNumber',
    'eventDate',
    'eventTime',
    'startDayOfYear',
    'endDayOfYear',
    'year',
    'month',
    'day',
    'verbatimEventDate',
    'habitat',
    'samplingProtocol',
    'samplingEffort',
    'sampleSizeValue',
    'sampleSizeUnit',
    'fieldNotes',
    'eventRemarks'
  ].find(x => termMap[x]);
  if (!hasContent) return null;

  const viewParent = useCallback(() => {
    setActiveEvent(event.parentEventID, event.datasetKey);
  }, []);

  const addToSearchCallback = useCallback(() => {
    addToSearch(termMap.eventID.value);
  }, []);

  function viewRelative(id){
    alert(id);
  }

  const isRootNode = !termMap?.eventTypeHierarchy?.value || termMap?.eventTypeHierarchy?.value.length < 2;

  return <Group label="eventDetails.groups.event">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.eventID} showDetails={showAll} />
      <PlainTextField term={termMap.eventName} showDetails={showAll} />
      <LinkedField fieldCallback={viewParent} term={termMap.parentEventID} showDetails={showAll} />
      <VocabField term={termMap.eventType} showDetails={showAll} />
      {!isRootNode &&
          // <PlainTextField term={termMap.eventTypeHierarchyJoined} showDetails={showAll} />
          <Field term={termMap.eventTypeHierarchyJoined} showDetails={showAll}>
            <Structure event={event} setActiveEvent={setActiveEvent} />
          </Field>
      }
      <DateRangeField term={termMap.temporalCoverage} showDetails={showAll} />
      <PlainTextField term={termMap.eventDate} showDetails={showAll} />
      <PlainTextField term={termMap.eventTime} showDetails={showAll} />
      {showAll && <PlainTextField term={termMap.startDayOfYear} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.endDayOfYear} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.year} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.month} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.day} showDetails={showAll} />}
      <PlainTextField term={termMap.verbatimEventDate} showDetails={showAll} />
      <PlainTextField term={termMap.samplingEffort} showDetails={showAll} />
      <PlainTextField term={termMap.sampleSizeValue} showDetails={showAll} />
      <PlainTextField term={termMap.sampleSizeUnit} showDetails={showAll} />
      <PlainTextField term={termMap.eventRemarks} showDetails={showAll} />
    </Properties>

    <Button
        look="primaryOutline" style={{ marginTop: '20px', fontSize: '11px' }}
        onClick={addToSearchCallback}>View events related to this {termMap.eventType?.value?.concept}
    </Button>
  </Group>
}




function Location({ showAll, termMap, event }) {
  const hasContent = [
    'locationID',
    'higherGeographyID',
    'higherGeography',
    'continent',
    'waterBody',
    'islandGroup',
    'island',
    'countryCode',
    'stateProvince',
    'county',
    'municipality',
    'locality',
    'verbatimLocality',
    'verbatimElevation',
    'verbatimDepth',
    'minimumDistanceAboveSurfaceInMeters',
    'maximumDistanceAboveSurfaceInMeters',
    'locationAccordingTo',
    'locationRemarks',
    'decimalLatitude',
    'decimalLongitude',
    'coordinateUncertaintyInMeters',
    'coordinatePrecision',
    'pointRadiusSpatialFit',
    'verbatimCoordinateSystem',
    'verbatimSRS',
    'verticalDatum',
    'footprintWKT',
    'footprintSRS',
    'footprintSpatialFit',
    'georeferencedBy',
    'georeferencedDate',
    'georeferenceProtocol',
    'georeferenceSources',
    'georeferenceVerificationStatus',
    'georeferenceRemarks',
    'country',
    'minimumElevationInMeters',
    'maximumElevationInMeters',
    'elevation',
    'elevationAccuracy',
    'minimumDepthInMeters',
    'maximumDepthInMeters',
    'minimumDepthInMeters',
    'maximumDepthInMeters',
    'depth',
    'depthAccuracy',
    'geodeticDatum',
    'verbatimCoordinates',
    'verbatimLatitude',
    'verbatimLongitude'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="eventDetails.groups.location">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.locationID} showDetails={showAll} />
      <PlainTextField term={termMap.higherGeographyID} showDetails={showAll} />
      <PlainTextField term={termMap.higherGeography} showDetails={showAll} />

      <EnumField term={termMap.continent} showDetails={showAll} getEnum={value => `enums.continent.${value}`} />
      <EnumField term={termMap.countryCode} label="occurrenceFieldNames.country" showDetails={showAll} getEnum={value => `enums.countryCode.${value}`} />

      <PlainTextField term={termMap.waterBody} showDetails={showAll} />
      <PlainTextField term={termMap.islandGroup} showDetails={showAll} />
      <PlainTextField term={termMap.island} showDetails={showAll} />
      <PlainTextField term={termMap.stateProvince} showDetails={showAll} />
      <PlainTextField term={termMap.county} showDetails={showAll} />
      <PlainTextField term={termMap.municipality} showDetails={showAll} />

      <PlainTextField term={termMap.locality} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimLocality} showDetails={showAll} />

      <PlainTextField term={termMap.minimumDistanceAboveSurfaceInMeters} showDetails={showAll} />
      <PlainTextField term={termMap.maximumDistanceAboveSurfaceInMeters} showDetails={showAll} />
      <PlainTextField term={termMap.locationAccordingTo} showDetails={showAll} />
      <PlainTextField term={termMap.locationRemarks} showDetails={showAll} />

      <PlainTextField term={termMap.decimalLatitude} showDetails={showAll} />
      <PlainTextField term={termMap.decimalLongitude} showDetails={showAll} />
      <PlainTextField term={termMap.coordinateUncertaintyInMeters} showDetails={showAll} />
      <PlainTextField term={termMap.coordinatePrecision} showDetails={showAll} />
      <PlainTextField term={termMap.pointRadiusSpatialFit} showDetails={showAll} />
      <PlainTextField term={termMap.footprintWKT} showDetails={showAll} />
      <PlainTextField term={termMap.footprintSRS} showDetails={showAll} />
      <PlainTextField term={termMap.verticalDatum} showDetails={showAll} />
      <PlainTextField term={termMap.footprintSpatialFit} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimCoordinateSystem} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimSRS} showDetails={showAll} />

      <PlainTextField term={termMap.georeferencedBy} showDetails={showAll} />
      <PlainTextField term={termMap.georeferencedDate} showDetails={showAll} />
      <HtmlField term={termMap.georeferenceProtocol} showDetails={showAll} />
      <HtmlField term={termMap.georeferenceSources} showDetails={showAll} />
      <PlainTextField term={termMap.georeferenceVerificationStatus} showDetails={showAll} />
      <HtmlField term={termMap.georeferenceRemarks} showDetails={showAll} />

      <PlainTextField term={termMap.elevation} showDetails={showAll} />
      <PlainTextField term={termMap.elevationAccuracy} showDetails={showAll} />
      <PlainTextField term={termMap.minimumElevationInMeters} showDetails={showAll} />
      <PlainTextField term={termMap.maximumElevationInMeters} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimElevation} showDetails={showAll} />

      <PlainTextField term={termMap.depth} showDetails={showAll} />
      <PlainTextField term={termMap.depthAccuracy} showDetails={showAll} />
      <PlainTextField term={termMap.minimumDepthInMeters} showDetails={showAll} />
      <PlainTextField term={termMap.maximumDepthInMeters} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimDepth} showDetails={showAll} />

      <PlainTextField term={termMap.geodeticDatum} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimCoordinates} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimLatitude} showDetails={showAll} />
      <PlainTextField term={termMap.verbatimLongitude} showDetails={showAll} />
    </Properties>
  </Group>
}
