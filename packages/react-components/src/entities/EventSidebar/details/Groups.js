import React, {useCallback} from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, Properties } from "../../../components";
import {PlainTextField, EnumField, HtmlField, LinkedField} from './properties';
import * as css from "../styles";

const { Term: T, Value: V } = Properties;

export function Groups({
     event,
     setActiveEventID,
     showAll }) {

  let termMap = {}
  Object.entries(event).forEach(item => {
    termMap[item[0]] = { "simpleName": item[0], "value": item[1] }
  })

  return <>
    <Event                {...{ showAll, termMap, event, setActiveEventID }} />
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

function Event({ showAll, termMap, event, setActiveEventID }) {
  const hasContent = [
    'eventID',
    'parentEventID',
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
    'eventRemarks'].find(x => termMap[x]);
  if (!hasContent) return null;

  const viewParent = useCallback(() => {
      setActiveEventID(termMap.parentEventID.value);
  }, []);

  return <Group label="eventDetails.groups.event">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.eventID} showDetails={showAll} />
      <LinkedField fieldCallback={viewParent} term={termMap.parentEventID} showDetails={showAll} />
      <PlainTextField term={termMap.eventType?.concept} showDetails={showAll} />
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
