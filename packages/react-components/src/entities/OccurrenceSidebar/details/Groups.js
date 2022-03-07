import { jsx } from '@emotion/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import equal from 'fast-deep-equal/react';
import intersection from 'lodash/intersection';
import { ResourceLink, Accordion, Properties, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink } from "../../../components";
import { CustomValueField, BasicField, PlainTextField, EnumField, HtmlField, LicenseField, Chips } from './properties';
import { TaxonClassification } from './TaxonClassification/TaxonClassification';
import { AgentSummary } from './AgentSummary'
import * as css from "../styles";

const { Term: T, Value: V } = Properties;

export function Groups({ occurrence, showAll, setActiveImage }) {
  const { terms } = occurrence;
  const termMap = terms.reduce((map, term) => { map[term.simpleName] = term; return map; }, {});

  return <>
    <Summary              {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Record               {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Taxon                {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Location             {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Occurrence           {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Event                {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Organism             {...{ showAll, termMap, occurrence, setActiveImage }} />
    <MaterialSample       {...{ showAll, termMap, occurrence, setActiveImage }} />
    <GeologicalContext    {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Identification       {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Other                {...{ showAll, termMap, occurrence, setActiveImage }} />
    <Citation             {...{ showAll, termMap, occurrence, setActiveImage }} />
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
function Summary({ showAll, termMap, occurrence, setActiveImage }) {
  return <Group label="occurrenceDetails.groups.summary">
    <Properties css={css.properties} breakpoint={800}>

      <Images {...{ showAll, termMap, occurrence, setActiveImage }} />
      <ScientificName {...{ showAll, termMap, occurrence }} />
      <AcceptedScientificName {...{ showAll, termMap, occurrence }} />

      {occurrence.gbifClassification?.classification?.length > 1 && <BasicField label="occurrenceFieldNames.taxonomicClassification">
        <TaxonClassification ranks={occurrence.gbifClassification.classification} />
      </BasicField>}
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
      <AgentIds {...{ showAll, termMap, occurrence }} />
    </Properties>
  </Group>
}

function Record({ showAll, termMap, occurrence, setActiveImage }) {
  return <Group label="occurrenceDetails.groups.record">
    <Properties css={css.properties} breakpoint={800}>
      <Institution      {...{ showAll, termMap, occurrence }} />
      <Collection       {...{ showAll, termMap, occurrence }} />

      <HtmlField term={termMap.datasetID} showDetails={showAll} />
      <PlainTextField term={termMap.datasetName} showDetails={showAll} />
      <EnumField term={termMap.basisOfRecord} showDetails={showAll} getEnum={value => `enums.basisOfRecord.${value}`} />
      <PlainTextField term={termMap.informationWithheld} showDetails={showAll} />
      <PlainTextField term={termMap.dataGeneralizations} showDetails={showAll} />
      <DynamicProperties termMap={termMap} />
    </Properties>
  </Group>
}

function Occurrence({ showAll, termMap, occurrence, setActiveImage }) {
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
    'degreeOfEstablishment',
    'pathway',
    'associatedMedia'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.occurrence">
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
      {/* Voabularies and should really be translated as such */}
      <PlainTextField term={termMap.establishmentMeans} showDetails={showAll} />
      <PlainTextField term={termMap.degreeOfEstablishment} showDetails={showAll} />
      <PlainTextField term={termMap.pathway} showDetails={showAll} />
      
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

function Organism({ showAll, termMap, occurrence, setActiveImage }) {
  const hasContent = ['organismID',
    'organismScope',
    'associatedOccurrences',
    'associatedOrganisms',
    'previousIdentifications',
    'organismRemarks'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.organism">
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

function MaterialSample({ showAll, termMap, occurrence, setActiveImage }) {
  if (!termMap.materialSampleID) return null;

  return <Group label="occurrenceDetails.groups.materialSample">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.materialSampleID} showDetails={showAll} />
    </Properties>
  </Group>
}

function Event({ showAll, termMap, occurrence, setActiveImage }) {
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

  return <Group label="occurrenceDetails.groups.event">
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

function Location({ showAll, termMap, occurrence, setActiveImage }) {
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

  return <Group label="occurrenceDetails.groups.location">
    <Properties css={css.properties} breakpoint={800}>
      <PlainTextField term={termMap.locationID} showDetails={showAll} />
      <PlainTextField term={termMap.higherGeographyID} showDetails={showAll} />
      <PlainTextField term={termMap.higherGeography} showDetails={showAll} />

      <EnumField term={termMap.continent} showDetails={showAll} getEnum={value => `enums.continent.${value}`} />
      <EnumField term={termMap.countryCode} label="occurrenceFieldNames.country" showDetails={showAll} getEnum={value => `enums.countryCode.${value}`} />
      {/* <PlainTextField term={termMap.country} showDetails={showAll} /> */}
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

      {occurrence?.gadm?.level0 && <BasicField label="occurrenceFieldNames.gadmClassification">
        <GadmClassification gadm={occurrence.gadm} />
      </BasicField>}
    </Properties>
  </Group>
}

function GeologicalContext({ showAll, termMap, occurrence, setActiveImage }) {
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

  return <Group label="occurrenceDetails.groups.geologicalContext">
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

function Identification({ showAll, termMap, occurrence, setActiveImage }) {
  const hasContent = [
    'identificationID',
    'identificationQualifier',
    'typeStatus',
    'identifiedBy',
    'identifiedByIDs',
    'verbatimIdentification',
    'dateIdentified',
    'identificationReferences',
    'identificationVerificationStatus',
    'identificationRemarks'].find(x => termMap[x]);
  if (!hasContent) return null;

  return <Group label="occurrenceDetails.groups.identification">
    <Properties css={css.properties} breakpoint={800}>
      <HtmlField term={termMap.identificationID} showDetails={showAll} />
      <PlainTextField term={termMap.identificationQualifier} showDetails={showAll} />
      <EnumField term={termMap.typeStatus} showDetails={showAll} getEnum={value => `enums.typeStatus.${value}`} />
      <PlainTextField term={termMap.identifiedBy} showDetails={showAll} />
      <IdentifiedById {...{ showAll, termMap, occurrence }} />
      <PlainTextField term={termMap.verbatimIdentification} showDetails={showAll} />
      <PlainTextField term={termMap.dateIdentified} showDetails={showAll} />
      <HtmlField term={termMap.identificationReferences} showDetails={showAll} />
      <PlainTextField term={termMap.identificationVerificationStatus} showDetails={showAll} />
      <HtmlField term={termMap.identificationRemark} showDetails={showAll} />
    </Properties>
  </Group>
}

function Taxon({ showAll, termMap, occurrence, setActiveImage }) {
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

  return <Group label="occurrenceDetails.groups.taxon">
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
      <AcceptedScientificName {...{ showAll, termMap, occurrence }} />

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

function Other({ showAll, termMap, occurrence, setActiveImage }) {
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

  return <Group label="occurrenceDetails.groups.other">
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

function Citation({ occurrence }) {
  return <Group label="phrases.citation">
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
      <RecordedById {...{ showAll, termMap, occurrence }} />
      <IdentifiedById {...{ showAll, termMap, occurrence }} />
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
            <AgentSummary agent={x} />
          </li>
        })
      }
    </ul>
  </BasicField>
}

