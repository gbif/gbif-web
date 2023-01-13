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

const { Term: T, Value: V } = Properties;

export function Groups({ occurrence, updateToc, setActiveImage }) {
  return <>
    {/* <ImageMap             {...{ updateToc, occurrence, setActiveImage }} />
    <SequenceTeaser       {...{ updateToc, occurrence, setActiveImage }} /> */}

    {/* <Summary              {...{ updateToc, occurrence, setActiveImage }} />

    <Record               {...{ updateToc, occurrence, setActiveImage }} />
    <Taxon                {...{ updateToc, occurrence, setActiveImage }} />*/
      <Location             {...{ updateToc, occurrence, setActiveImage }} />
    /*<Occurrence           {...{ updateToc, occurrence, setActiveImage }} />
    <Event                {...{ updateToc, occurrence, setActiveImage }} />
    <Organism             {...{ updateToc, occurrence, setActiveImage }} />
    <MaterialSample       {...{ updateToc, occurrence, setActiveImage }} />
    <GeologicalContext    {...{ updateToc, occurrence, setActiveImage }} />
    <Identification       {...{ updateToc, occurrence, setActiveImage }} />
    <Other                {...{ updateToc, occurrence, setActiveImage }} />

    <Preparation          {...{ updateToc, occurrence, setActiveImage }} />
    <ResourceRelationship {...{ updateToc, occurrence, setActiveImage }} />
    <Amplification        {...{ updateToc, occurrence, setActiveImage }} />
    <Permit               {...{ updateToc, occurrence, setActiveImage }} />
    <Loan                 {...{ updateToc, occurrence, setActiveImage }} />
    <Preservation         {...{ updateToc, occurrence, setActiveImage }} />
    <MaterialSampleExt    {...{ updateToc, occurrence, setActiveImage }} />
    <Audubon              {...{ updateToc, occurrence, setActiveImage }} />
    <DNADerivedData       {...{ updateToc, occurrence, setActiveImage }} />
    <Cloning              {...{ updateToc, occurrence, setActiveImage }} />
    <GelImage             {...{ updateToc, occurrence, setActiveImage }} />

    <Citation             {...{ updateToc, occurrence, setActiveImage }} /> */}
  </>
}

export function Group({ label, children, ...props }) {
  // return <Accordion
  //   summary={<FormattedMessage id={label} />}
  //   defaultOpen={true}
  //   css={css.group()}
  //   {...props}
  // />
  return <section
    css={css.group()}
    {...props}
  >
    {label && <h2><FormattedMessage id={label} defaultMessage={getDefaultMessage(label)} /></h2>}
    <div>
      {children}
    </div>
  </section>
}
function ImageMap({ updateToc, occurrence, setActiveImage }) {
  return <Group>
    <MediaSummary occurrence={occurrence} />
  </Group>
}

function SequenceTeaser({ occurrence }) {
  const dnaDerivedSequence = occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['http://rs.gbif.org/terms/dna_sequence'];
  const amplificationSequence = occurrence?.extensions?.['http://data.ggbn.org/schemas/ggbn/terms/Amplification']?.[0]?.['http://data.ggbn.org/schemas/ggbn/terms/consensusSequence'];
  const seq = dnaDerivedSequence || amplificationSequence;
  return <Group>
    <SequenceVisual sequence={seq} />
    <Properties css={css.properties} breakpoint={800} style={{ marginTop: 12 }}>
      <T>Target gene</T>
      <V>{occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['https://w3id.org/gensc/terms/MIXS:0000044']}</V>

      <T>DNA sequence</T>
      <V>{occurrence?.extensions?.['http://rs.gbif.org/terms/1.0/DNADerivedData']?.[0]?.['http://rs.gbif.org/terms/dna_sequence']}</V>
    </Properties>
  </Group>;
}

function Summary({ updateToc, occurrence, setActiveImage }) {
  return <Group label="occurrenceDetails.groups.summary" id="summary">
    <Properties css={css.properties} breakpoint={800}>

      {/* <Images {...{ occurrence, setActiveImage }} /> */}
      <ScientificName {...{ occurrence }} />
      <AcceptedScientificName {...{ occurrence }} />

      <BasicField label="occurrenceFieldNames.taxonomicClassification">
        {/* <TaxonClassification ranks={occurrence.gbifClassification.classification} /> */}
      </BasicField>
      {occurrence?.gadm?.level0 && <BasicField label="occurrenceFieldNames.gadmClassification">
        <GadmClassification gadm={occurrence.gadm} />
      </BasicField>}

      <BasicField label="occurrenceDetails.dataset">
        <DatasetKeyLink id={occurrence.datasetKey}>{occurrence.datasetTitle}</DatasetKeyLink>
      </BasicField>

      {/* <BasicField label="occurrenceFieldNames.publisher">
        <PublisherKeyLink id={occurrence.publishingOrgKey}>{occurrence.publisherTitle}</PublisherKeyLink>
      </BasicField> */}

      <EnumField term={termMap.basisOfRecord} showDetails={showAll} getEnum={value => `enums.basisOfRecord.${value}`} />
      {/* <PlainTextField term={termMap.recordedBy} showDetails={showAll} /> */}
      <AgentIds {...{ occurrence }} />
    </Properties>
  </Group>
}

function Record({ updateToc, occurrence, setActiveImage }) {
  return <Group label="occurrenceDetails.groups.record" id="record">
    <Properties css={css.properties} breakpoint={800}>
      <Institution      {...{ occurrence }} />
      <Collection       {...{ occurrence }} />

      <HtmlField term={termMap.datasetID} showDetails={showAll} />
      <PlainTextField term={termMap.datasetName} showDetails={showAll} />
      <EnumField term={termMap.basisOfRecord} showDetails={showAll} getEnum={value => `enums.basisOfRecord.${value}`} />
      <PlainTextField term={termMap.informationWithheld} showDetails={showAll} />
      <PlainTextField term={termMap.dataGeneralizations} showDetails={showAll} />
      <DynamicProperties termMap={termMap} />
    </Properties>
  </Group>
}

function Occurrence({ updateToc, occurrence, setActiveImage }) {
  const hasContent = [
    'occurrenceID',
    'catalogNumber',
    'recordNumber',
    'recordedBy',
    'individualCount',
    'organismQuantity',
    'organismQuantityType',
    'sex',
    'lifeStage',
    'reproductiveCondition',
    'behavior',
    'establishmentMeans',
    'occurrenceStatus',
    'preparations',
    'disposition',
    'associatedReferences',
    'associatedSequences',
    'associatedTaxa',
    'otherCatalogNumbers',
    'occurrenceRemarks',
    'associatedMedia'].find(x => termMap[x]);
  if (!hasContent) {
    return null;
  };
  updateToc('occurrence');

  return <Group label="occurrenceDetails.groups.occurrence" id="occurrence">
    <Properties css={css.properties} breakpoint={800}>
      <HtmlField term={termMap.occurrenceID} showDetails={showAll} />
      <PlainTextField term={termMap.catalogNumber} showDetails={showAll} />
      <PlainTextField term={termMap.recordNumber} showDetails={showAll} />
      <PlainTextField term={termMap.recordedBy} showDetails={showAll} />
      <PlainTextField term={termMap.individualCount} showDetails={showAll} />
      <PlainTextField term={termMap.organismQuantity} showDetails={showAll} />
      <PlainTextField term={termMap.organismQuantityType} showDetails={showAll} />
      <PlainTextField term={termMap.sex} showDetails={showAll} />
      <PlainTextField term={termMap.lifeStage} showDetails={showAll} />
      <PlainTextField term={termMap.reproductiveCondition} showDetails={showAll} />
      <PlainTextField term={termMap.behavior} showDetails={showAll} />
      <PlainTextField term={termMap.establishmentMeans} showDetails={showAll} />
      <EnumField term={termMap.occurrenceStatus} showDetails={showAll} getEnum={value => `enums.occurrenceStatus.${value}`} />
      <PlainTextField term={termMap.preparations} showDetails={showAll} />
      <PlainTextField term={termMap.disposition} showDetails={showAll} />
      <HtmlField term={termMap.associatedReferences} showDetails={showAll} />
      <HtmlField term={termMap.associatedSequences} showDetails={showAll} />
      <HtmlField term={termMap.associatedTaxa} showDetails={showAll} />
      <PlainTextField term={termMap.otherCatalogNumbers} showDetails={showAll} />
      <PlainTextField term={termMap.occurrenceRemarks} showDetails={showAll} />
      <HtmlField term={termMap.associatedMedia} showDetails={showAll} />
    </Properties>
  </Group>
}

function Organism({ updateToc, occurrence, setActiveImage }) {
  const hasContent = ['organismID',
    'organismScope',
    'associatedOccurrences',
    'associatedOrganisms',
    'previousIdentifications',
    'organismRemarks'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.organism" id="organism">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.organismID} showDetails={showAll} />
      <PlainTextField term={termMap.organismScope} showDetails={showAll} />
      <PlainTextField term={termMap.associatedOccurrences} showDetails={showAll} />
      <HtmlField term={termMap.associatedOrganisms} showDetails={showAll} />
      <PlainTextField term={termMap.previousIdentifications} showDetails={showAll} />
      <PlainTextField term={termMap.organismRemarks} showDetails={showAll} />
    </Properties>
  </Group>
}

function MaterialSample({ updateToc, occurrence, setActiveImage }) {
  if (!termMap.materialSampleID) return null;

  return <Group label="occurrenceDetails.groups.materialSample" id="material-sample">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.materialSampleID} showDetails={showAll} />
    </Properties>
  </Group>
}

function Event({ updateToc, occurrence, setActiveImage }) {
  const hasContent = [
    'eventID',
    'parentEventID',
    'fieldNumber',
    'eventDate',
    'eventTime',
    'startDayOfYear',
    'endDayOfYear',
    'year', 'month', 'day',
    'verbatimEventDate',
    'habitat',
    'samplingProtocol',
    'samplingEffort',
    'sampleSizeValue',
    'sampleSizeUnit',
    'fieldNotes',
    'eventRemarks'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.event" id="event">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.eventID} showDetails={showAll} />
      <PlainTextField term={termMap.parentEventID} showDetails={showAll} />
      <PlainTextField term={termMap.parentEventID} showDetails={showAll} />
      <PlainTextField term={termMap.eventDate} showDetails={showAll} />
      <PlainTextField term={termMap.eventTime} showDetails={showAll} />
      {showAll && <PlainTextField term={termMap.startDayOfYear} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.endDayOfYear} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.year} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.month} showDetails={showAll} />}
      {showAll && <PlainTextField term={termMap.day} showDetails={showAll} />}
      <PlainTextField term={termMap.verbatimEventDate} showDetails={showAll} />
      <PlainTextField term={termMap.habitat} showDetails={showAll} />
      <HtmlField term={termMap.samplingProtocol} showDetails={showAll} />
      <PlainTextField term={termMap.samplingEffort} showDetails={showAll} />
      <PlainTextField term={termMap.sampleSizeValue} showDetails={showAll} />
      <PlainTextField term={termMap.sampleSizeUnit} showDetails={showAll} />
      {/* <SampleSize     {...{ termMap, occurrence }} /> */}
      <PlainTextField term={termMap.fieldNotes} showDetails={showAll} />
      <PlainTextField term={termMap.eventRemarks} showDetails={showAll} />
    </Properties>
  </Group>
}

function Location({ updateToc, occurrence = {}, setActiveImage }) {
  const { collectionOccurrence } = occurrence;
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

function Identification({ updateToc, occurrence, setActiveImage }) {
  const hasContent = [
    'identificationID',
    'identificationQualifier',
    'typeStatus',
    'identifiedBy',
    'dateIdentified',
    'identificationReferences',
    'identificationVerificationStatus',
    'identificationRemarks'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.identification" id="identification">
    <Properties css={css.properties} breakpoint={800}>
      <HtmlField term={termMap.identificationID} showDetails={showAll} />
      <PlainTextField term={termMap.identificationQualifier} showDetails={showAll} />
      <EnumField term={termMap.typeStatus} showDetails={showAll} getEnum={value => `enums.typeStatus.${value}`} />
      <PlainTextField term={termMap.identifiedBy} showDetails={showAll} />
      <PlainTextField term={termMap.dateIdentified} showDetails={showAll} />
      <HtmlField term={termMap.identificationReferences} showDetails={showAll} />
      <PlainTextField term={termMap.identificationVerificationStatus} showDetails={showAll} />
      <HtmlField term={termMap.identificationRemark} showDetails={showAll} />
    </Properties>
  </Group>
}

function Taxon({ updateToc, occurrence, setActiveImage }) {
  const hasContent = [
    'taxonID',
    'scientificNameID',
    'acceptedNameUsageID',
    'parentNameUsageID',
    'originalNameUsageID',
    'nameAccordingToID',
    'namePublishedInID',
    'taxonConceptID',
    'scientificName',
    'acceptedNameUsage',
    'parentNameUsage',
    'originalNameUsage',
    'nameAccordingTo',
    'namePublishedIn',
    'namePublishedInYear',
    'higherClassification',
    'kingdom',
    'phylum',
    'class',
    'order',
    'family',
    'genus',
    'subgenus',
    'specificEpithet',
    'infraspecificEpithet',
    'taxonRank',
    'verbatimTaxonRank',
    'vernacularName',
    'nomenclaturalCode',
    'taxonomicStatus',
    'nomenclaturalStatus',
    'taxonRemarks',
    'scientificNameAuthorship'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.taxon" id="taxon">
    <Properties css={css.properties} breakpoint={800}>
      <HtmlField term={termMap.taxonID} showDetails={showAll} />
      <HtmlField term={termMap.scientificNameID} showDetails={showAll} />
      <HtmlField term={termMap.acceptedNameUsageID} showDetails={showAll} />
      <HtmlField term={termMap.parentNameUsageID} showDetails={showAll} />
      <HtmlField term={termMap.originalNameUsageID} showDetails={showAll} />
      <HtmlField term={termMap.nameAccordingToID} showDetails={showAll} />
      <HtmlField term={termMap.namePublishedInID} showDetails={showAll} />
      <HtmlField term={termMap.taxonConceptID} showDetails={showAll} />
      <HtmlField term={termMap.scientificName} showDetails={showAll} />
      <PlainTextField term={termMap.acceptedNameUsage} showDetails={showAll} />
      <AcceptedScientificName {...{ occurrence }} />

      <PlainTextField term={termMap.parentNameUsage} showDetails={showAll} />
      <PlainTextField term={termMap.originalNameUsage} showDetails={showAll} />
      <PlainTextField term={termMap.nameAccordingTo} showDetails={showAll} />
      <PlainTextField term={termMap.namePublishedIn} showDetails={showAll} />
      <PlainTextField term={termMap.namePublishedInYear} showDetails={showAll} />
      <PlainTextField term={termMap.higherClassification} showDetails={showAll} />
      <PlainTextField term={termMap.kingdom} showDetails={showAll} />
      <PlainTextField term={termMap.phylum} showDetails={showAll} />
      <PlainTextField term={termMap.class} showDetails={showAll} />
      <PlainTextField term={termMap.order} showDetails={showAll} />
      <PlainTextField term={termMap.family} showDetails={showAll} />
      <PlainTextField term={termMap.genus} showDetails={showAll} />
      <PlainTextField term={termMap.subgenus} showDetails={showAll} />
      <PlainTextField term={termMap.specificEpithet} showDetails={showAll} />
      <PlainTextField term={termMap.infraspecificEpithet} showDetails={showAll} />
      <EnumField term={termMap.taxonRank} showDetails={showAll} getEnum={value => `enums.taxonRank.${value}`} />
      <PlainTextField term={termMap.verbatimTaxonRank} showDetails={showAll} />
      <PlainTextField term={termMap.vernacularName} showDetails={showAll} />
      <PlainTextField term={termMap.nomenclaturalCode} showDetails={showAll} />
      <EnumField term={termMap.taxonomicStatus} showDetails={showAll} getEnum={value => `enums.taxonomicStatus.${value}`} />
      <PlainTextField term={termMap.nomenclaturalStatus} showDetails={showAll} />
      <HtmlField term={termMap.taxonRemarks} showDetails={showAll} />
      <PlainTextField term={termMap.scientificNameAuthorship} showDetails={showAll} />
    </Properties>
  </Group>
}

function Other({ updateToc, occurrence, setActiveImage }) {
  // const hasContent = [
  //   'abstract',
  //   'accessRights',
  //   'accrualMethod',
  //   'accrualPeriodicity',
  //   'accrualPolicy',
  //   'alternative',
  //   'audience',
  //   'available',
  //   'bibliographicCitation',
  //   'conformsTo',
  //   'contributor',
  //   'coverage',
  //   'created',
  //   'creator',
  //   'date',
  //   'dateAccepted',
  //   'dateCopyrighted',
  //   'dateSubmitted',
  //   'description',
  //   'educationLevel',
  //   'extent',
  //   'format',
  //   'hasFormat',
  //   'hasPart',
  //   'hasVersion',
  //   'identifier',
  //   'instructionalMethod',
  //   'isFormatOf',
  //   'isPartOf',
  //   'isReferencedBy',
  //   'isReplacedBy',
  //   'isRequiredBy',
  //   'isVersionOf',
  //   'issued',
  //   'language',
  //   'license',
  //   'mediator',
  //   'medium',
  //   'modified',
  //   'provenance',
  //   'publisher',
  //   'references',
  //   'relation',
  //   'replaces',
  //   'requires',
  //   'rights',
  //   'rightsHolder',
  //   'source',
  //   'spatial',
  //   'subject',
  //   'tableOfContents',
  //   'temporal',
  //   'title',
  //   'type',
  //   'valid',
  //   'gbifID'].find(x => termMap[x]);
  // if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.other" id="other">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.abstract} showDetails={showAll} />
      <PlainTextField term={termMap.accessRights} showDetails={showAll} />
      <PlainTextField term={termMap.accrualMethod} showDetails={showAll} />
      <PlainTextField term={termMap.accrualPeriodicity} showDetails={showAll} />
      <PlainTextField term={termMap.accrualPolicy} showDetails={showAll} />
      <PlainTextField term={termMap.alternative} showDetails={showAll} />
      <PlainTextField term={termMap.audience} showDetails={showAll} />
      <PlainTextField term={termMap.available} showDetails={showAll} />
      <HtmlField term={termMap.bibliographicCitation} showDetails={showAll} />
      <PlainTextField term={termMap.conformsTo} showDetails={showAll} />
      <PlainTextField term={termMap.contributor} showDetails={showAll} />
      <PlainTextField term={termMap.coverage} showDetails={showAll} />
      <PlainTextField term={termMap.created} showDetails={showAll} />
      <PlainTextField term={termMap.creator} showDetails={showAll} />
      <PlainTextField term={termMap.date} showDetails={showAll} />
      <PlainTextField term={termMap.dateAccepted} showDetails={showAll} />
      <PlainTextField term={termMap.dateCopyrighted} showDetails={showAll} />
      <PlainTextField term={termMap.dateSubmitted} showDetails={showAll} />
      <PlainTextField term={termMap.description} showDetails={showAll} />
      <PlainTextField term={termMap.educationLevel} showDetails={showAll} />
      <PlainTextField term={termMap.extent} showDetails={showAll} />
      <PlainTextField term={termMap.format} showDetails={showAll} />
      <PlainTextField term={termMap.hasFormat} showDetails={showAll} />
      <PlainTextField term={termMap.hasPart} showDetails={showAll} />
      <PlainTextField term={termMap.hasVersion} showDetails={showAll} />
      <HtmlField term={termMap.identifier} showDetails={showAll} />
      <PlainTextField term={termMap.instructionalMethod} showDetails={showAll} />
      <PlainTextField term={termMap.isFormatOf} showDetails={showAll} />
      <PlainTextField term={termMap.isPartOf} showDetails={showAll} />
      <HtmlField term={termMap.isReferencedBy} showDetails={showAll} />
      <HtmlField term={termMap.isReplacedBy} showDetails={showAll} />
      <HtmlField term={termMap.isRequiredBy} showDetails={showAll} />
      <HtmlField term={termMap.isVersionOf} showDetails={showAll} />
      <PlainTextField term={termMap.issued} showDetails={showAll} />
      <PlainTextField term={termMap.language} showDetails={showAll} />
      <EnumField term={termMap.license} showDetails={showAll} getEnum={value => `enums.license.${value}`} />
      <PlainTextField term={termMap.mediator} showDetails={showAll} />
      <PlainTextField term={termMap.medium} showDetails={showAll} />
      <PlainTextField term={termMap.modified} showDetails={showAll} />
      <PlainTextField term={termMap.provenance} showDetails={showAll} />
      <HtmlField term={termMap.publisher} showDetails={showAll} />
      <HtmlField term={termMap.references} showDetails={showAll} />
      <HtmlField term={termMap.relation} showDetails={showAll} />
      <HtmlField term={termMap.replaces} showDetails={showAll} />
      <HtmlField term={termMap.requires} showDetails={showAll} />
      <PlainTextField term={termMap.rights} showDetails={showAll} />
      <PlainTextField term={termMap.rightsHolder} showDetails={showAll} />
      <HtmlField term={termMap.source} showDetails={showAll} />
      <PlainTextField term={termMap.spatial} showDetails={showAll} />
      <PlainTextField term={termMap.subject} showDetails={showAll} />
      <PlainTextField term={termMap.tableOfContents} showDetails={showAll} />
      <PlainTextField term={termMap.temporal} showDetails={showAll} />
      <PlainTextField term={termMap.title} showDetails={showAll} />
      <PlainTextField term={termMap.type} showDetails={showAll} />
      <PlainTextField term={termMap.valid} showDetails={showAll} />
      <BasicField label="occurrenceFieldNames.gbifID">
        {termMap.gbifID.value}
      </BasicField>
    </Properties>
  </Group>
}

function Preparation({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/Preparation';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.preparation" id="preparation" />
}

function ResourceRelationship({ occurrence }) {
  const extensionName = 'http://rs.tdwg.org/dwc/terms/ResourceRelationship';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.resourceRelationship" id="resource-relationship" />
}

function Amplification({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/Amplification';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.amplification" id="amplification" />
}

function Permit({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/Permit';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.permit" id="permit" />
}

function Loan({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/Loan';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.loan" id="loan" />
}

function Preservation({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/Preservation';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.preservation" id="preservation" />
}

function MaterialSampleExt({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/MaterialSample';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.materialSample" id="material-sample" />
}

function Audubon({ occurrence }) {
  const extensionName = 'http://rs.tdwg.org/ac/terms/Multimedia';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.audubon" id="audubon" />
}

function DNADerivedData({ occurrence }) {
  const extensionName = 'http://rs.gbif.org/terms/1.0/DNADerivedData';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.DNADerivedData" id="dna-derived-data" />
}

function Cloning({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/Cloning';
  return <GenericExtension {...{ occurrence, extensionName }} label="phrases.cloning" id="cloning" />
}

function GelImage({ occurrence }) {
  const extensionName = 'http://data.ggbn.org/schemas/ggbn/terms/GelImage';
  return <GenericExtension
    {...{
      occurrence, extensionName, overwrites: {
        'http://purl.org/dc/terms/identifier': ({ item }) => <div>
          <img src={item['http://purl.org/dc/terms/identifier']} />
          <div>{item['http://purl.org/dc/terms/identifier']}</div>
        </div>
      }
    }}
    label="phrases.gelImage"
    id="gel-image" />
}


function GenericExtension({ occurrence, extensionName, overwrites, ...props }) {
  const list = occurrence?.extensions?.[extensionName];
  if (!list || list.length === 0) return null;

  return <Group {...props}>
    {list.length === 1 && <GenericExtensionContent item={list[0]} extensionName={extensionName} overwrites={overwrites} />}
    {list.length > 1 && <div css={css.listArea()}>
      <div style={{ fontSize: '12px', margin: '0 12px' }}>{list.length} rows</div>
      {list.map((item, i) => <ListCard>
        <GenericExtensionContent item={item} extensionName={extensionName} overwrites={overwrites} />
      </ListCard>)}
    </div>}
  </Group>
}

function GenericExtensionContent({ item, extensionName, overwrites = {} }) {
  const fields = Object.keys(item);
  console.log(fields);
  return <Properties css={css.properties} breakpoint={800}>
    {fields.map(field => {
      if (overwrites[field]) {
        return <ExtField key={field} {...{ item, extensionName, field }}>
          {overwrites[field]({ item })}
        </ExtField>
      } else {
        return <ExtField key={field} {...{ item, extensionName, field }} />
      }
    })}
  </Properties>
}

function ExtField({ item, extensionName, field, children, ...props }) {
  if (!item[field]) return null;
  return <>
    <T><FormattedMessage id={`occurrenceDetails.extensions.${extensionName}.${field}`} defaultMessage={getDefaultMessage(field)} /></T>
    <V>{children ? children : item[field]}</V>
  </>
}

function ListCard(props) {
  return <div css={css.listCard()} {...props} />
}

function Citation({ occurrence }) {
  return <Group label="phrases.citation" id="citation">
    <Properties css={css.properties} breakpoint={800}>
      <T><FormattedMessage id={`phrases.citeAs`} /></T>
      <V>{occurrence.dataset.citation.text} https://gbif.org/occurrence/{occurrence.key}</V>
    </Properties>
  </Group>
}

// function SampleSize({ termMap, occurrence }) {
//   if (!termMap?.sampleSizeValue?.value || !termMap?.sampleSizeUnit?.value) return null;
//   return <>
//     <T>
//       <FormattedMessage
//         id={`occurrenceDetails.sampleSize`}
//         defaultMessage={"Sample size"}
//       />
//     </T>
//     <V>
//       {termMap?.sampleSizeValue?.value} {termMap?.sampleSizeUnit?.value}
//     </V>
//   </>
// }

function DynamicProperties({ termMap }) {
  const value = termMap?.dynamicProperties?.value;
  if (!value) return null;

  let content;
  try {
    const jsonValue = JSON.parse(value);
    // restrict json to one level deep
    content = <Properties>
      {Object.keys(jsonValue).map((k) => (
        <React.Fragment key={k}>
          <T>{k}</T>
          <V>{jsonValue[k]}</V>
        </React.Fragment>
      ))}
    </Properties>;
  } catch (err) {
    //ignore any errors
    content = value;
  }
  return <>
    <T>
      <FormattedMessage
        id={`occurrenceFieldNames.dynamicProperties`}
        defaultMessage={"Dynamic properties"}
      />
    </T>
    <V>
      {content}
    </V>
  </>
}

function Images({ occurrence, setActiveImage }) {
  if (occurrence.stillImageCount < 1) return null;
  return <>
    <T>
      <FormattedMessage
        id={`occurrenceFieldNames.images`}
        defaultMessage={"Images"}
      />
    </T>
    <div>
      <V>
        <GalleryTiles>
          {occurrence.stillImages.map((x, i) => <GalleryTile key={i} src={x.identifier} height={120} onClick={() => setActiveImage(x)} />)}
        </GalleryTiles>
      </V>
    </div>
  </>
}

function Institution({ termMap, showAll, occurrence }) {
  const code = termMap.institutionCode;
  const id = termMap.institutionID;
  const inst = occurrence.institution;
  if (!code && !id && !inst) return null;
  // const issues = code?.issues || id?.issues;
  return <>
    <T>
      <FormattedMessage
        id={`occurrenceDetails.institution`}
        defaultMessage={"Institution"}
      />
    </T>
    <div>
      <V>
        <Properties horizontal={false}>
          <InstitutionKey {...{ occurrence }} />
          <PlainTextField term={termMap.institutionCode} showDetails={showAll} />
          <HtmlField term={termMap.institutionID} showDetails={showAll} />
          <PlainTextField term={termMap.ownerInstitutionCode} showDetails={showAll} />
        </Properties>
      </V>
    </div>
  </>
}

function Collection({ termMap, showAll, occurrence }) {
  const code = termMap.collectionCode;
  const id = termMap.collectionID;
  const inst = occurrence.collection;
  if (!code && !id && !inst) return null;
  return <>
    <T>
      <FormattedMessage
        id={`occurrenceDetails.collection`}
        defaultMessage={"Collection"}
      />
    </T>
    <div>
      <V>
        <Properties horizontal={false}>
          <CollectionKey {...{ occurrence }} />
          <PlainTextField term={termMap.collectionCode} showDetails={showAll} />
          <HtmlField term={termMap.collectionID} showDetails={showAll} />
        </Properties>
      </V>
    </div>
  </>
}

function InstitutionKey({ occurrence }) {
  if (!occurrence?.institution?.key) return null;
  return <BasicField label="occurrenceDetails.institutionGrSciColl">
    <ResourceLink type='institutionKey' id={occurrence?.institution?.key}>
      {occurrence.institution.name}
    </ResourceLink>
  </BasicField>
}

function CollectionKey({ occurrence }) {
  if (!occurrence?.collection?.key) return null;
  return <BasicField label="occurrenceDetails.collectionGrSciColl">
    <ResourceLink type='collectionKey' id={occurrence?.collection?.key}>
      {occurrence.collection.name}
    </ResourceLink>
  </BasicField>
}

function ScientificName({ termMap, showAll, occurrence }) {
  return <CustomValueField term={termMap.scientificName} showDetails={showAll}>
    <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }} />
  </CustomValueField>
}

function AcceptedScientificName({ termMap, showAll, occurrence }) {
  if (!occurrence?.gbifClassification?.synonym) return null;
  return <CustomValueField term={termMap.acceptedScientificName} showDetails={showAll} >
    <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.acceptedUsage.formattedName }} />
  </CustomValueField>
}

function AgentIds({ termMap, showAll, occurrence }) {
  if (equal(occurrence.recordedByIDs, occurrence.identifiedByIDs)) {
    return <Agents label="occurrenceDetails.recordedAndIdentifiedBy" value={occurrence.recordedByIDs} />
  } else {
    return <>
      <RecordedById {...{ occurrence }} />
      <IdentifiedById {...{ occurrence }} />
    </>
  }
}

function RecordedById({ termMap, showAll, occurrence }) {
  return <Agents label="occurrenceFieldNames.recordedByID" value={occurrence.recordedByIDs} />
}

function IdentifiedById({ termMap, showAll, occurrence }) {
  return <Agents label="occurrenceFieldNames.identifiedByID" value={occurrence.identifiedByIDs} />
}

function Agents({ label, value }) {
  if (!value?.[0]) return null;
  return <BasicField label={label}>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {value
        .map(x => {
          if (!x.person) {
            return <li key={x.value}>{x.value}</li>
          }
          return <li key={x.value} style={{ marginBottom: 4 }}>
            {/* <AgentSummary agent={x} /> */}
          </li>
        })
      }
    </ul>
  </BasicField>
}

function MediaSummary({ occurrence, ...props }) {
  const [activeImage, setActiveImage] = useState(0);
  // const [view, setView] = useState(occurrence.stillImages.length > 0 ? 'IMAGE' : 'MAP');

  const hasVideo = occurrence?.movingImageCount > 0;
  const hasPlayableVideo = hasVideo && ['video/mp4', 'video/ogg'].includes(occurrence?.movingImages[0].format);
  if (!occurrence.stillImageCount > 0 && !hasPlayableVideo) return null;

  return <div style={{ position: 'relative', background: '#eee' }}>
    {hasPlayableVideo && occurrence?.movingImages[0] && <video controls style={{ maxWidth: '100%', height: 400, display: 'block', margin: 'auto' }} >
      <source src={occurrence?.movingImages[0].identifier} type={occurrence?.movingImages[0].format} />
      Unable to play
    </video>}
    {!hasPlayableVideo && <Image src={occurrence.stillImages[activeImage].identifier} h={400} style={{ maxWidth: '100%', height: 400, display: 'block', margin: 'auto' }} />}

    {/* <div style={{ display: 'flex', background: 'white', padding: 8, justifyContent: 'flex-end' }}> */}
    {/* <div style={{ position: 'absolute', margin: 12, top: 0, right: 0, zIndex: 2 }}>
      <ButtonGroup style={{ fontSize: 14 }}>
        <Button appearance={view === 'IMAGE' ? 'ink' : 'inkOutline'} truncate onClick={e => setView('IMAGE')}>Media</Button>
        <Button appearance={view !== 'IMAGE' ? 'ink' : 'inkOutline'} onClick={e => setView('MAP')}>Map</Button>
      </ButtonGroup>
    </div> */}


    {/* {view === 'MAP' && <div style={{ maxWidth: '100%', height: 400, display: 'block', margin: 'auto', position: 'relative' }}>
      <img
        style={{ display: "block", maxWidth: "100%" }}
        src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},13,0/738x400@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
      />
      <img
        style={{
          border: "1px solid #aaa",
          width: "30%",
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
        src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+dedede(${occurrence.coordinates.lon},${occurrence.coordinates.lat})/${occurrence.coordinates.lon},${occurrence.coordinates.lat},4,0/200x100@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
      />
    </div>} */}
  </div>
}

function getDefaultMessage(str) {
  if (typeof str !== 'string') return;
  return startCase(str.replace(/\./g, '/').split('/').reverse()[0]);
}