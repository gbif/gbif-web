import { jsx } from '@emotion/react';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import equal from 'fast-deep-equal/react';
import startCase from 'lodash/startCase';
import { ButtonGroup, Button, Image, ResourceLink, Accordion, Properties, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
// import { AgentSummary } from './AgentSummary'
import { SequenceVisual } from './SequenceVisual';
import * as css from "../styles";
import { Group } from './Groups';

const { Term: T, Value: V } = Properties;

export function Location({ updateToc, specimen = {}, setActiveImage }) {
  const { collectionOccurrence } = specimen;
  // const hasContent = [
  //   'locationID',
  //   'higherGeographyID',
  //   'higherGeography',
  //   'continent',
  //   'waterBody',
  //   'islandGroup',
  //   'island',
  //   'countryCode',
  //   'stateProvince',
  //   'county',
  //   'municipality',
  //   'locality',
  //   'verbatimLocality',
  //   'verbatimElevation',
  //   'verbatimDepth',
  //   'minimumDistanceAboveSurfaceInMeters',
  //   'maximumDistanceAboveSurfaceInMeters',
  //   'locationAccordingTo',
  //   'locationRemarks',
  //   'decimalLatitude',
  //   'decimalLongitude',
  //   'coordinateUncertaintyInMeters',
  //   'coordinatePrecision',
  //   'pointRadiusSpatialFit',
  //   'verbatimCoordinateSystem',
  //   'verbatimSRS',
  //   'footprintWKT',
  //   'footprintSRS',
  //   'footprintSpatialFit',
  //   'georeferencedBy',
  //   'georeferencedDate',
  //   'georeferenceProtocol',
  //   'georeferenceSources',
  //   'georeferenceVerificationStatus',
  //   'georeferenceRemarks',
  //   'country',
  //   'minimumElevationInMeters',
  //   'maximumElevationInMeters',
  //   'elevation',
  //   'elevationAccuracy',
  //   'minimumDepthInMeters',
  //   'maximumDepthInMeters',
  //   'minimumDepthInMeters',
  //   'maximumDepthInMeters',
  //   'depth',
  //   'depthAccuracy',
  //   'geodeticDatum',
  //   'verbatimCoordinates',
  //   'verbatimLatitude',
  //   'verbatimLongitude'].find(x => collectionOccurrence[x]);
  // if (!hasContent) return null;

  const { decimalLongitude, decimalLatitude } = collectionOccurrence?.location?.georeference;
  
  return <Group label="occurrenceDetails.groups.location" id="location">
    <img style={{ width: '100%' }} src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${decimalLongitude},${decimalLatitude})/${decimalLongitude},${decimalLatitude},5,0/800x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField label='locationID' value={collectionOccurrence.locationId} />
      <PlainTextField label='higherGeography' value={collectionOccurrence.location.higherGeography} />
      <PlainTextField label='continent' value={collectionOccurrence.location.continent} />
      <PlainTextField label='waterBody' value={collectionOccurrence.location.waterBody} />
      <PlainTextField label='islandGroup' value={collectionOccurrence.location.islandGroup} />
      <PlainTextField label='countryCode' value={collectionOccurrence.location.countryCode} />
      {/* <PlainTextField term={termMap.higherGeographyID} />
      <PlainTextField term={termMap.higherGeography} />

      <EnumField term={termMap.continent} getEnum={value => `enums.continent.${value}`} />
      <EnumField term={termMap.countryCode} label="occurrenceFieldNames.country" getEnum={value => `enums.countryCode.${value}`} />
      <PlainTextField term={termMap.waterBody} />
      <PlainTextField term={termMap.islandGroup} />
      <PlainTextField term={termMap.island} />
      <PlainTextField term={termMap.stateProvince} />
      <PlainTextField term={termMap.county} />
      <PlainTextField term={termMap.municipality} />

      <PlainTextField term={termMap.locality} />
      <PlainTextField term={termMap.verbatimLocality} />

      <PlainTextField term={termMap.minimumDistanceAboveSurfaceInMeters} />
      <PlainTextField term={termMap.maximumDistanceAboveSurfaceInMeters} />
      <PlainTextField term={termMap.locationAccordingTo} />
      <PlainTextField term={termMap.locationRemarks} />

      <PlainTextField term={termMap.decimalLatitude} />
      <PlainTextField term={termMap.decimalLongitude} />
      <PlainTextField term={termMap.coordinateUncertaintyInMeters} />
      <PlainTextField term={termMap.coordinatePrecision} />
      <PlainTextField term={termMap.pointRadiusSpatialFit} />
      <PlainTextField term={termMap.footprintWKT} />
      <PlainTextField term={termMap.footprintSRS} />
      <PlainTextField term={termMap.footprintSpatialFit} />
      <PlainTextField term={termMap.verbatimCoordinateSystem} />
      <PlainTextField term={termMap.verbatimSRS} />

      <PlainTextField term={termMap.georeferencedBy} />
      <PlainTextField term={termMap.georeferencedDate} />
      <HtmlField term={termMap.georeferenceProtocol} />
      <HtmlField term={termMap.georeferenceSources} />
      <PlainTextField term={termMap.georeferenceVerificationStatus} />
      <HtmlField term={termMap.georeferenceRemarks} />

      <PlainTextField term={termMap.elevation} />
      <PlainTextField term={termMap.elevationAccuracy} />
      <PlainTextField term={termMap.minimumElevationInMeters} />
      <PlainTextField term={termMap.maximumElevationInMeters} />
      <PlainTextField term={termMap.verbatimElevation} />

      <PlainTextField term={termMap.depth} />
      <PlainTextField term={termMap.depthAccuracy} />
      <PlainTextField term={termMap.minimumDepthInMeters} />
      <PlainTextField term={termMap.maximumDepthInMeters} />
      <PlainTextField term={termMap.verbatimDepth} />

      <PlainTextField term={termMap.geodeticDatum} />
      <PlainTextField term={termMap.verbatimCoordinates} />
      <PlainTextField term={termMap.verbatimLatitude} />
      <PlainTextField term={termMap.verbatimLongitude} />

      {occurrence?.gadm?.level0 && <BasicField label="occurrenceFieldNames.gadmClassification">
        <GadmClassification gadm={occurrence.gadm} />
      </BasicField>} */}
    </Properties>
  </Group>
}

function GeologicalContext({ updateToc, occurrence, setActiveImage }) {
  const hasContent = [
    'geologicalContextID',
    'earliestEonOrLowestEonothem',
    'latestEonOrHighestEonothem',
    'earliestEraOrLowestErathem',
    'latestEraOrHighestErathem',
    'earliestPeriodOrLowestSystem',
    'latestPeriodOrHighestSystem',
    'earliestEpochOrLowestSeries',
    'latestEpochOrHighestSeries',
    'earliestAgeOrLowestStage',
    'latestAgeOrHighestStage',
    'lowestBiostratigraphicZone',
    'highestBiostratigraphicZone',
    'lithostratigraphicTerms',
    'group',
    'formation',
    'member',
    'bed'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.geologicalContext" id="geological-context">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.geologicalContextID} showDetails={showAll} />
      <PlainTextField term={termMap.earliestEonOrLowestEonothem} showDetails={showAll} />
      <PlainTextField term={termMap.latestEonOrHighestEonothem} showDetails={showAll} />
      <PlainTextField term={termMap.earliestEraOrLowestErathem} showDetails={showAll} />
      <PlainTextField term={termMap.latestEraOrHighestErathem} showDetails={showAll} />
      <PlainTextField term={termMap.earliestPeriodOrLowestSystem} showDetails={showAll} />
      <PlainTextField term={termMap.latestPeriodOrHighestSystem} showDetails={showAll} />
      <PlainTextField term={termMap.earliestEpochOrLowestSeries} showDetails={showAll} />
      <PlainTextField term={termMap.latestEpochOrHighestSeries} showDetails={showAll} />
      <PlainTextField term={termMap.earliestAgeOrLowestStage} showDetails={showAll} />
      <PlainTextField term={termMap.latestAgeOrHighestStage} showDetails={showAll} />
      <PlainTextField term={termMap.lowestBiostratigraphicZone} showDetails={showAll} />
      <PlainTextField term={termMap.highestBiostratigraphicZone} showDetails={showAll} />
      <PlainTextField term={termMap.lithostratigraphicTerms} showDetails={showAll} />
      <PlainTextField term={termMap.group} showDetails={showAll} />
      <PlainTextField term={termMap.formation} showDetails={showAll} />
      <PlainTextField term={termMap.member} showDetails={showAll} />
      <PlainTextField term={termMap.bed} showDetails={showAll} />
    </Properties>
  </Group>
}
