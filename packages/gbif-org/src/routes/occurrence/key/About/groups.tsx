import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { PlainTextField, HtmlField, EnumField, BasicField } from '../properties';
import {
  Institution,
  Collection,
  ScientificName,
  AcceptedScientificName,
  AgentIds,
  DynamicProperties,
} from './customValues';
import { FormattedMessage } from 'react-intl';
import Properties from '@/components/Properties';
import { RenderIfChildren } from '@/components/renderIfChildren';
import { useState } from 'react';
import { GadmClassification, TaxonClassification } from '@/components/classification';
import { DynamicLink } from '@/components/dynamicLink';
import { Media } from './media';
import { OccurrenceQuery, Term } from '@/gql/graphql';
import { BulletList } from '@/components/BulletList';
import {
  Amplification,
  Audubon,
  ChronometricAge,
  Cloning,
  DNADerivedData,
  EolReference,
  ExtendedMeasurementOrFact,
  GelImage,
  GermplasmAccession,
  GermplasmMeasurementScore,
  GermplasmMeasurementTrait,
  GermplasmMeasurementTrial,
  IdentificationHistory,
  Identifier,
  Loan,
  MaterialSampleExt,
  MeasurementOrFact,
  Permit,
  Preparation,
  Preservation,
  Reference,
  ResourceRelationship,
} from './extensions';

const Map = React.lazy(() => import('@/components/map'));

export function Groups({
  occurrence,
  showAll,
  updateToc,
  termMap,
}: {
  occurrence: OccurrenceQuery['occurrence'];
  showAll: boolean;
  updateToc: (id: string, visible: boolean) => void;
  termMap: { [key: string]: Term };
}) {
  if (!occurrence) return null;
  return (
    <div style={{ wordBreak: 'break-word' }}>
      <MediaSummary {...{ updateToc, showAll, termMap, occurrence }} />
      {/*<SequenceTeaser       {...{ updateToc, showAll, termMap, occurrence, setActiveImage }} />*/}
      {/* <Summary {...{ updateToc, showAll, termMap, occurrence }} /> */}

      <Provenance {...{ updateToc, showAll, termMap, occurrence }} />

      <GeologicalContext {...{ updateToc, showAll, termMap, occurrence }} />
      <Record {...{ showAll, termMap, occurrence, updateToc }} />
      <Taxon {...{ updateToc, showAll, termMap, occurrence }} />
      <Location {...{ updateToc, showAll, termMap, occurrence }} />
      <Event {...{ updateToc, showAll, termMap, occurrence }} />
      <Occurrence {...{ updateToc, showAll, termMap, occurrence }} />
      <Organism {...{ updateToc, showAll, termMap, occurrence }} />
      <MaterialSample {...{ updateToc, showAll, termMap, occurrence }} />
      <Identification {...{ updateToc, showAll, termMap, occurrence }} />
      <Other {...{ updateToc, showAll, termMap, occurrence }} />

      {/* <Media occurrence={occurrence} termMap={termMap} updateToc={updateToc} /> */}

      <Preparation {...{ updateToc, showAll, termMap, occurrence }} />
      <ResourceRelationship {...{ updateToc, showAll, termMap, occurrence }} />
      <Amplification {...{ updateToc, showAll, termMap, occurrence }} />
      <Permit {...{ updateToc, showAll, termMap, occurrence }} />
      <Loan {...{ updateToc, showAll, termMap, occurrence }} />
      <Preservation {...{ updateToc, showAll, termMap, occurrence }} />
      <MaterialSampleExt {...{ updateToc, showAll, termMap, occurrence }} />
      <DNADerivedData {...{ updateToc, showAll, termMap, occurrence }} />
      <Cloning {...{ updateToc, showAll, termMap, occurrence }} />
      <GelImage {...{ updateToc, showAll, termMap, occurrence }} />
      <Reference {...{ updateToc, showAll, termMap, occurrence }} />
      <EolReference {...{ updateToc, showAll, termMap, occurrence }} />
      <GermplasmAccession {...{ updateToc, showAll, termMap, occurrence }} />
      <GermplasmMeasurementScore {...{ updateToc, showAll, termMap, occurrence }} />
      <GermplasmMeasurementTrait {...{ updateToc, showAll, termMap, occurrence }} />
      <GermplasmMeasurementTrial {...{ updateToc, showAll, termMap, occurrence }} />
      <IdentificationHistory {...{ updateToc, showAll, termMap, occurrence }} />
      <Identifier {...{ updateToc, showAll, termMap, occurrence }} />
      <MeasurementOrFact {...{ updateToc, showAll, termMap, occurrence }} />
      <ExtendedMeasurementOrFact {...{ updateToc, showAll, termMap, occurrence }} />
      <ChronometricAge {...{ updateToc, showAll, termMap, occurrence }} />
      {/* <Audubon              {...{ updateToc, showAll, termMap, occurrence }} /> */}

      <Citation {...{ updateToc, showAll, termMap, occurrence }} />
      <Debug {...{ updateToc, showAll, termMap, occurrence }} />
    </div>
  );
}

export function Group({
  label,
  children,
  id,
  ...props
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="mb-4" id={id}>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id={label} />
        </CardTitle>
      </CardHeader>
      <CardContent {...props}>{children}</CardContent>
    </Card>
  );
}

function PropGroup({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <Group label={label} id={id}>
      <Properties breakpoint={800} className="[&>dt]:w-52">
        {children}
      </Properties>
    </Group>
  );
}

function Summary({
  showAll,
  termMap,
  occurrence,
  updateToc = () => {},
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
  updateToc: (id: string, visible: boolean) => void;
}) {
  return (
    <RenderIfChildren as={PropGroup} label="occurrenceDetails.groups.summary" id="summary">
      <ScientificName {...{ showAll, termMap, occurrence }} />
      <AcceptedScientificName {...{ showAll, termMap, occurrence }} />

      <BasicField label="occurrenceFieldNames.taxonomicClassification">
        <TaxonClassification classification={occurrence.gbifClassification.classification} />
      </BasicField>
      {occurrence?.gadm?.level0 && (
        <BasicField label="occurrenceFieldNames.gadmClassification">
          <GadmClassification gadm={occurrence.gadm} />
        </BasicField>
      )}

      <BasicField label="occurrenceDetails.dataset">
        <DynamicLink to={`/dataset/${occurrence.datasetKey}`}>
          {occurrence.datasetTitle}
        </DynamicLink>
      </BasicField>

      <BasicField label="occurrenceFieldNames.publisher">
        <DynamicLink to={`/publisher/${occurrence.publishingOrgKey}`}>
          {occurrence.publisherTitle}
        </DynamicLink>
      </BasicField>

      <EnumField
        term={termMap.basisOfRecord}
        showDetails={showAll}
        getEnum={(value) => `enums.basisOfRecord.${value}`}
      />
      {/* <PlainTextField term={termMap.recordedBy} showDetails={showAll} /> */}
      <AgentIds {...{ showAll, termMap, occurrence }} />
    </RenderIfChildren>
  );
}

function Provenance({
  showAll,
  termMap,
  occurrence,
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
}) {
  return (
    <Card className="mb-4 bg-slate-300 text-slate-600">
      <CardContent className="py-4 md:py-4">
        This record is part of the dataset{' '}
        <span className="underline">
          <DynamicLink to={`/dataset/${occurrence.datasetKey}`}>
            {occurrence.datasetTitle}
          </DynamicLink>
        </span>
        .
      </CardContent>
    </Card>
  );
}

function Record({
  showAll,
  termMap,
  occurrence
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
}) {
  // no reason to test this, this group is always present since basisOfRecord is always present
  return (
    <PropGroup label="occurrenceDetails.groups.record" id="record">
      <Institution {...{ showAll, termMap, occurrence }} />
      <Collection {...{ showAll, termMap, occurrence }} />

      <HtmlField term={termMap.datasetID} showDetails={showAll} />
      <PlainTextField term={termMap.datasetName} showDetails={showAll} />
      <EnumField
        term={termMap.basisOfRecord}
        showDetails={showAll}
        getEnum={(value) => `enums.basisOfRecord.${value}`}
      />
      <PlainTextField term={termMap.informationWithheld} showDetails={showAll} />
      <PlainTextField term={termMap.dataGeneralizations} showDetails={showAll} />
      <DynamicProperties termMap={termMap} />
    </PropGroup>
  );
}

function Taxon({
  showAll,
  termMap,
  occurrence,
  updateToc = () => {},
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
  updateToc: (id: string, visible: boolean) => void;
}) {
  return (
    <RenderIfChildren as={PropGroup} label="occurrenceDetails.groups.taxon" id="taxon">
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
      {/* <AcceptedScientificName {...{ showAll, termMap, occurrence }} /> */}

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
      <EnumField
        term={termMap.taxonRank}
        showDetails={showAll}
        getEnum={(value) => `enums.taxonRank.${value}`}
      />
      <PlainTextField term={termMap.verbatimTaxonRank} showDetails={showAll} />
      <PlainTextField term={termMap.vernacularName} showDetails={showAll} />
      <PlainTextField term={termMap.nomenclaturalCode} showDetails={showAll} />
      <EnumField
        term={termMap.taxonomicStatus}
        showDetails={showAll}
        getEnum={(value) => `enums.taxonomicStatus.${value}`}
      />
      <PlainTextField term={termMap.nomenclaturalStatus} showDetails={showAll} />
      <HtmlField term={termMap.taxonRemarks} showDetails={showAll} />
      <PlainTextField term={termMap.scientificNameAuthorship} showDetails={showAll} />
    </RenderIfChildren>
  );
}

function Location({
  showAll,
  termMap,
  occurrence,
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
}) {
  return (
    <Card className="mb-4" id="location">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="occurrenceDetails.groups.location" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-full">
        <Properties breakpoint={800} className="[&>dt]:w-52 flex-auto">
          <PlainTextField term={termMap.locationID} showDetails={showAll} />
          <PlainTextField term={termMap.higherGeographyID} showDetails={showAll} />
          <PlainTextField term={termMap.higherGeography} showDetails={showAll} />

          <EnumField
            term={termMap.continent}
            showDetails={showAll}
            getEnum={(value) => `enums.continent.${value}`}
          />
          <EnumField
            term={termMap.countryCode}
            label="occurrenceFieldNames.country"
            showDetails={showAll}
            getEnum={(value) => `enums.countryCode.${value}`}
          />
          {/* <PlainTextField term={termMap.country} showDetails={showAll} /> */}
          <PlainTextField term={termMap.waterBody} showDetails={showAll} />
          <PlainTextField term={termMap.islandGroup} showDetails={showAll} />
          <PlainTextField term={termMap.island} showDetails={showAll} />
          <PlainTextField term={termMap.stateProvince} showDetails={showAll} />
          <PlainTextField term={termMap.county} showDetails={showAll} />
          <PlainTextField term={termMap.municipality} showDetails={showAll} />

          <PlainTextField term={termMap.locality} showDetails={showAll} />
          <PlainTextField term={termMap.verbatimLocality} showDetails={showAll} />

          <PlainTextField
            term={termMap.minimumDistanceAboveSurfaceInMeters}
            showDetails={showAll}
          />
          <PlainTextField
            term={termMap.maximumDistanceAboveSurfaceInMeters}
            showDetails={showAll}
          />
          <PlainTextField term={termMap.locationAccordingTo} showDetails={showAll} />
          <PlainTextField term={termMap.locationRemarks} showDetails={showAll} />

          <PlainTextField term={termMap.decimalLatitude} showDetails={showAll} />
          <PlainTextField term={termMap.decimalLongitude} showDetails={showAll} />
          <PlainTextField term={termMap.coordinateUncertaintyInMeters} showDetails={showAll} />
          <PlainTextField term={termMap.coordinatePrecision} showDetails={showAll} />
          <PlainTextField term={termMap.pointRadiusSpatialFit} showDetails={showAll} />
          <PlainTextField term={termMap.footprintWKT} showDetails={showAll} />
          <PlainTextField term={termMap.footprintSRS} showDetails={showAll} />
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

          {occurrence?.gadm?.level0 && (
            <BasicField label="occurrenceFieldNames.gadmClassification">
              <GadmClassification gadm={occurrence.gadm} />
            </BasicField>
          )}
        </Properties>

        {occurrence.coordinates.lon && (
          <div className="ms-4 flex-auto w-1/2">
            <React.Suspense fallback={<div>Loading map...</div>}>
              <Map
                coordinates={occurrence.coordinates}
                className="w-full rounded overflow-hidden"
              />
            </React.Suspense>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Occurrence({
  showAll,
  termMap,
  occurrence,
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
}) {
  // no reason to test this, this group is always present since occurrence ID is required
  return (
    <PropGroup label="occurrenceDetails.groups.occurrence" id="occurrence">
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
      <EnumField
        term={termMap.occurrenceStatus}
        showDetails={showAll}
        getEnum={(value) => `enums.occurrenceStatus.${value}`}
      />
      <PlainTextField term={termMap.preparations} showDetails={showAll} />
      <PlainTextField term={termMap.disposition} showDetails={showAll} />
      <HtmlField term={termMap.associatedReferences} showDetails={showAll} />
      <HtmlField term={termMap.associatedSequences} showDetails={showAll} />
      <HtmlField term={termMap.associatedTaxa} showDetails={showAll} />
      <PlainTextField term={termMap.otherCatalogNumbers} showDetails={showAll} />
      <PlainTextField term={termMap.occurrenceRemarks} showDetails={showAll} />
      <HtmlField term={termMap.associatedMedia} showDetails={showAll} />
    </PropGroup>
  );
}

function Event({
  showAll,
  termMap,
  occurrence,
  updateToc = () => {},
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
  updateToc: (id: string, visible: boolean) => void;
}) {
  const sectionName = 'event';
  const [visible, setVisible] = useState<boolean | undefined>();
  useEffect(() => {
    if (typeof visible === 'boolean') updateToc(sectionName, visible);
  }, [visible]);

  return (
    <RenderIfChildren
      as={PropGroup}
      label="occurrenceDetails.groups.event"
      id="event"
      onChange={(newState) => {
        if (newState !== visible) setVisible(newState);
      }}
    >
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
    </RenderIfChildren>
  );
}

function Organism({
  showAll,
  termMap,
  occurrence,
  updateToc = () => {},
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
  updateToc: (id: string, visible: boolean) => void;
}) {
  const sectionName = 'organism';
  const [visible, setVisible] = useState<boolean | undefined>();
  useEffect(() => {
    if (typeof visible === 'boolean') updateToc(sectionName, visible);
  }, [visible]);

  return (
    <RenderIfChildren
      as={PropGroup}
      label="occurrenceDetails.groups.organism"
      id="organism"
      onChange={(newState) => {
        if (newState !== visible) setVisible(newState);
      }}
    >
      <PlainTextField term={termMap.organismID} showDetails={showAll} />
      <PlainTextField term={termMap.organismScope} showDetails={showAll} />
      <PlainTextField term={termMap.associatedOccurrences} showDetails={showAll} />
      <HtmlField term={termMap.associatedOrganisms} showDetails={showAll} />
      <PlainTextField term={termMap.previousIdentifications} showDetails={showAll} />
      <PlainTextField term={termMap.organismRemarks} showDetails={showAll} />
    </RenderIfChildren>
  );
}

function MaterialSample({
  showAll,
  termMap,
  occurrence,
  updateToc = () => {},
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
  updateToc: (id: string, visible: boolean) => void;
}) {
  const sectionName = 'material-sample';
  const [visible, setVisible] = useState<boolean | undefined>();
  useEffect(() => {
    if (typeof visible === 'boolean') updateToc(sectionName, visible);
  }, [visible]);

  return (
    <RenderIfChildren
      as={PropGroup}
      label="occurrenceDetails.groups.materialSample"
      id="material-sample"
      onChange={(newState) => {
        if (newState !== visible) setVisible(newState);
      }}
    >
      <PlainTextField term={termMap.materialSampleID} showDetails={showAll} />
    </RenderIfChildren>
  );
}

function GeologicalContext({
  showAll,
  termMap,
  occurrence,
  updateToc = () => {},
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
  updateToc: (id: string, visible: boolean) => void;
}) {
  const sectionName = 'geological-context';
  const [visible, setVisible] = useState<boolean | undefined>();
  useEffect(() => {
    if (typeof visible === 'boolean') updateToc(sectionName, visible);
  }, [visible]);

  return (
    <RenderIfChildren
      as={PropGroup}
      label="occurrenceDetails.groups.geologicalContext"
      id={sectionName}
      onChange={(newState) => {
        if (newState !== visible) setVisible(newState);
      }}
    >
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
    </RenderIfChildren>
  );
}

function Identification({
  showAll,
  termMap,
  occurrence,
  updateToc = () => {},
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
  updateToc: (id: string, visible: boolean) => void;
}) {
  const sectionName = 'identification';
  const [visible, setVisible] = useState<boolean | undefined>();
  useEffect(() => {
    if (typeof visible === 'boolean') updateToc(sectionName, visible);
  }, [visible]);

  return (
    <RenderIfChildren
      as={PropGroup}
      label="occurrenceDetails.groups.identification"
      id="identification"
      onChange={(newState) => {
        if (newState !== visible) setVisible(newState);
      }}
    >
      <HtmlField term={termMap.identificationID} showDetails={showAll} />
      <PlainTextField term={termMap.identificationQualifier} showDetails={showAll} />
      <EnumField
        term={termMap.typeStatus}
        showDetails={showAll}
        getEnum={(value) => `enums.typeStatus.${value}`}
      />
      <PlainTextField term={termMap.identifiedBy} showDetails={showAll} />
      <PlainTextField term={termMap.dateIdentified} showDetails={showAll} />
      <HtmlField term={termMap.identificationReferences} showDetails={showAll} />
      <PlainTextField term={termMap.identificationVerificationStatus} showDetails={showAll} />
      <HtmlField term={termMap.identificationRemarks} showDetails={showAll} />
    </RenderIfChildren>
  );
}

function Other({
  showAll,
  termMap,
  occurrence,
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
}) {
  // no reason to test this, this group is always present since GBIF id is required
  return (
    <PropGroup label="occurrenceDetails.groups.other" id="other">
      <EnumField
        term={termMap.license}
        showDetails={showAll}
        getEnum={(value) => `enums.license.${value}`}
      />
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
      {/* <PlainTextField term={termMap.created} showDetails={showAll} /> */}
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
      <BasicField label="occurrenceFieldNames.gbifID">{termMap.gbifID.value}</BasicField>
    </PropGroup>
  );
}

function MediaSummary({
  showAll,
  termMap,
  occurrence,
}: {
  showAll: boolean;
  termMap: any;
  occurrence: any;
}) {
  const [activeImage, setActiveImage] = useState(0); // the idea with this is that down the line we can link from the gallery to open on a specific image. Or add a carousel

  const hasVideo = occurrence?.movingImageCount > 0;
  const hasPlayableVideo =
    hasVideo && ['video/mp4', 'video/ogg'].includes(occurrence?.movingImages[0].format);
  if (!(occurrence.stillImageCount > 0) && !hasPlayableVideo) return null;

  const hasMore =
    occurrence.stillImageCount + occurrence.movingImageCount > 1 || occurrence?.soundCount > 0;
  return (
    <Card className="mb-4">
      <div style={{ position: 'relative', background: '#eee' }}>
        {hasMore && (
          <a
            href="#media"
            className="absolute top-0 end-0 m-2 bg-neutral-800 rounded text-slate-100 px-2 py-1"
          >
            See all
          </a>
        )}
        {hasPlayableVideo && occurrence?.movingImages[0] && (
          <video
            controls
            style={{ maxWidth: '100%', height: 400, display: 'block', margin: 'auto' }}
          >
            <source
              src={occurrence?.movingImages[0].identifier}
              type={occurrence?.movingImages[0].format}
            />
            Unable to play
          </video>
        )}
        {!hasPlayableVideo && (
          <img
            src={occurrence.stillImages[activeImage].thumbor}
            height={400}
            style={{ maxWidth: '100%', maxHeight: 400, display: 'block', margin: 'auto' }}
          />
        )}
      </div>
    </Card>
  );
}

function Citation({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  if (!occurrence) return null;
  return (
    <Group label="phrases.citation" id="citation">
      <Properties breakpoint={800} className="[&>dt]:w-52">
        <BasicField label="phrases.citeAs">
          {occurrence?.dataset?.citation?.text} https://gbif.org/occurrence/{occurrence.key}
        </BasicField>
      </Properties>
    </Group>
  );
}

function Debug({ occurrence }: { occurrence: OccurrenceQuery['occurrence'] }) {
  if (!occurrence) return null;
  return (
    <div className="mb-4 text-sm scroll-mt-24" id="provenance">
      <CardContent>
        <Properties breakpoint={800} className="[&>dt]:w-52">
          <BasicField label="API access">
            <BulletList>
              <li>
                <a href={`https://api.gbif.org/v1/occurrence/${occurrence.key}`}>Processed</a>
              </li>
              <li>
                <a href={`https://api.gbif.org/v1/occurrence/${occurrence.key}/fragment`}>
                  Fragment
                </a>
              </li>
            </BulletList>
          </BasicField>
          <BasicField label="occurrenceDetails.dataset">
            <DynamicLink to={`/dataset/${occurrence.datasetKey}`}>
              {occurrence.datasetTitle}
            </DynamicLink>
          </BasicField>

          <BasicField label="occurrenceFieldNames.publisher">
            <DynamicLink to={`/publisher/${occurrence.publishingOrgKey}`}>
              {occurrence.publisherTitle}
            </DynamicLink>
          </BasicField>
          <BasicField label="Last crawled">{occurrence?.lastCrawled}</BasicField>
        </Properties>
      </CardContent>
    </div>
  );
}
