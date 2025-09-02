import { BulletList } from '@/components/bulletList';
import { GadmClassification } from '@/components/classification';
import { ConceptValue } from '@/components/conceptValue';
import { HelpLine } from '@/components/helpText';
import { GeoJsonMap } from '@/components/maps/geojsonMap';
import { generatePointGeoJson } from '@/components/maps/geojsonMap/GeoJsonMap';
import Properties, { Property } from '@/components/properties';
import { RenderIfChildren } from '@/components/renderIfChildren';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useConfig } from '@/config/config';
import { OccurrenceQuery, SlowOccurrenceKeyQuery, Term } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import React, { useEffect, useState } from 'react';
import { MdAudiotrack, MdImage } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import wellknown from 'wellknown';
import { BasicField, EnumField, HtmlField, PlainTextField, VerbatimTextField } from '../properties';
import {
  AgentIds,
  CollectionKey,
  DatasetKey,
  DynamicProperties,
  IdentifiedById,
  InstitutionKey,
  RecordedById,
} from './customValues';
import {
  Amplification,
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
import { Media } from './media';
import { TaxonInterpretationCard } from './TaxonInterpretationCard';

// const Map = React.lazy(() => import('@/components/maps/map'));

export function Groups({
  occurrence,
  slowOccurrence,
  showAll,
  updateToc,
  termMap,
}: {
  occurrence: OccurrenceQuery['occurrence'];
  slowOccurrence: SlowOccurrenceKeyQuery['occurrence'];
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

      {/* <Provenance {...{ updateToc, showAll, termMap, occurrence }} /> */}

      <GeologicalContext {...{ updateToc, showAll, termMap, occurrence }} />
      <Record {...{ showAll, termMap, occurrence, slowOccurrence, updateToc }} />
      <Taxon {...{ updateToc, showAll, termMap, occurrence }} />
      <Identification {...{ updateToc, showAll, termMap, occurrence }} />
      <Location {...{ updateToc, showAll, termMap, occurrence }} />
      <Occurrence {...{ updateToc, showAll, termMap, occurrence }} />
      <Event {...{ updateToc, showAll, termMap, occurrence }} />
      <Organism {...{ updateToc, showAll, termMap, occurrence }} />
      <MaterialSample {...{ updateToc, showAll, termMap, occurrence }} />
      <Other {...{ updateToc, showAll, termMap, occurrence }} />

      <Media occurrence={occurrence} termMap={termMap} updateToc={updateToc} />

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
    <Card className="g-mb-4" id={id}>
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
      <Properties breakpoint={800} className="[&>dt]:g-w-52">
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
      {occurrence?.gadm?.level0 && (
        <BasicField label="occurrenceFieldNames.gadmClassification">
          <GadmClassification gadm={occurrence.gadm} />
        </BasicField>
      )}

      <BasicField label="occurrenceDetails.dataset">
        <DynamicLink
          to={`/dataset/${occurrence.datasetKey}`}
          pageId="datasetKey"
          variables={{ key: occurrence.datasetKey }}
        >
          {occurrence.datasetTitle}
        </DynamicLink>
      </BasicField>

      <BasicField label="occurrenceFieldNames.publisher">
        <DynamicLink
          to={`/publisher/${occurrence.publishingOrgKey}`}
          pageId="publisherKey"
          variables={{ key: occurrence.publishingOrgKey }}
        >
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

// function Provenance({
//   showAll,
//   termMap,
//   occurrence,
// }: {
//   showAll: boolean;
//   termMap: any;
//   occurrence: any;
// }) {
//   return (
//     <Card className="g-mb-4 g-bg-slate-300 g-text-slate-600">
//       <div className="g-py-4 g-px-4 md:g-px-8">
//         This record is part of the dataset{' '}
//         <span className="g-underline">
//           <DynamicLink
//             to={`/dataset/${occurrence.datasetKey}`}
//             pageId="datasetKey"
//             variables={{ key: occurrence.datasetKey }}
//             className="g-text-inherit"
//           >
//             {occurrence.datasetTitle}
//           </DynamicLink>
//         </span>
//         .
//       </div>
//     </Card>
//   );
// }

function Record({
  showAll,
  termMap,
  occurrence,
  slowOccurrence,
}: {
  showAll: boolean;
  termMap: any;
  occurrence: OccurrenceQuery['occurrence'];
  slowOccurrence: SlowOccurrenceKeyQuery['occurrence'];
}) {
  // no reason to test this, this group is always present since basisOfRecord is always present
  return (
    <PropGroup label="occurrenceDetails.groups.record" id="record">
      <InstitutionKey {...{ occurrence, slowOccurrence }} />
      <CollectionKey {...{ occurrence, slowOccurrence }} />
      <DatasetKey {...{ occurrence }} />

      <EnumField
        term={termMap.basisOfRecord}
        showDetails={showAll}
        getEnum={(value) => `enums.basisOfRecord.${value}`}
      />
      <PlainTextField term={termMap.informationWithheld} showDetails={showAll} />
      <PlainTextField term={termMap.dataGeneralizations} showDetails={showAll} />
      <DynamicProperties termMap={termMap} slowOccurrence={slowOccurrence} />
    </PropGroup>
  );
}

function Taxon({
  showAll,
  termMap,
  occurrence,
}: {
  showAll: boolean;
  termMap: any;
  occurrence: OccurrenceQuery['occurrence'];
  updateToc: (id: string, visible: boolean) => void;
}) {
  const config = useConfig();
  const enabledChecklists = config.availableChecklistKeys || [];
  // filter occurrence.classifications to only show those in enabledChecklists. Use the ordering of the enabledChecklists
  // to order the classifications
  const filteredClassifications = occurrence?.classifications
    .filter((classification) => enabledChecklists.includes(classification?.checklistKey))
    .sort((a, b) => {
      return (
        enabledChecklists.indexOf(a?.checklistKey) - enabledChecklists.indexOf(b?.checklistKey)
      );
    });
  return (
    <>
      <Group label="occurrenceDetails.groups.taxon" id="taxon">
        <Properties breakpoint={800} className="[&>dt]:g-w-52">
          <VerbatimTextField term={termMap.scientificName} />
          <HtmlField term={termMap.taxonID} showDetails={showAll} hideIssues hideRemarks />
          <HtmlField term={termMap.scientificNameID} showDetails={showAll} hideIssues hideRemarks />
          <HtmlField
            term={termMap.acceptedNameUsageID}
            showDetails={showAll}
            hideIssues
            hideRemarks
          />
          <HtmlField
            term={termMap.parentNameUsageID}
            showDetails={showAll}
            hideIssues
            hideRemarks
          />
          <HtmlField
            term={termMap.originalNameUsageID}
            showDetails={showAll}
            hideIssues
            hideRemarks
          />
          <HtmlField
            term={termMap.nameAccordingToID}
            showDetails={showAll}
            hideIssues
            hideRemarks
          />
          <HtmlField
            term={termMap.namePublishedInID}
            showDetails={showAll}
            hideIssues
            hideRemarks
          />
          <VerbatimTextField term={termMap.taxonConceptID} />
          <VerbatimTextField term={termMap.acceptedNameUsage} />
          <VerbatimTextField term={termMap.parentNameUsage} />
          <VerbatimTextField term={termMap.originalNameUsage} />
          <VerbatimTextField term={termMap.nameAccordingTo} />
          <VerbatimTextField term={termMap.namePublishedIn} />
          <VerbatimTextField term={termMap.namePublishedInYear} />
          <VerbatimTextField term={termMap.higherClassification} />
          <VerbatimTextField term={termMap.kingdom} />
          <VerbatimTextField term={termMap.phylum} />
          <VerbatimTextField term={termMap.class} />
          <VerbatimTextField term={termMap.order} />
          <VerbatimTextField term={termMap.family} />
          <VerbatimTextField term={termMap.genus} />
          <VerbatimTextField term={termMap.subgenus} />
          <VerbatimTextField term={termMap.specificEpithet} />
          <VerbatimTextField term={termMap.infraspecificEpithet} />
          <VerbatimTextField term={termMap.taxonRank} />
          <VerbatimTextField term={termMap.verbatimTaxonRank} />
          <VerbatimTextField term={termMap.vernacularName} />
          <VerbatimTextField term={termMap.nomenclaturalCode} />
          <VerbatimTextField term={termMap.nomenclaturalStatus} />
          <HtmlField term={termMap.taxonRemarks} showDetails={showAll} />
          <VerbatimTextField term={termMap.scientificNameAuthorship} />
          <VerbatimTextField term={termMap.taxonomicStatus} />
        </Properties>

        <div className="g-mt-4 g-border-t g-border-slate-300 g-pt-4">
          <div className="g-mb-2">
            <HelpLine id={'taxonomic-interpretations'} icon />

            {/* Taxonomic Interpretations <MdInfoOutline />
            <div className="g-bg-slate-200 g-p-2 g-rounded g-text-slate-600 g-text-xs">
              <HelpText identifier={'taxonomic-interpretations'} />
            </div> */}
          </div>
          {filteredClassifications.map((classification) => (
            <TaxonInterpretationCard
              key={classification.checklistKey}
              classification={classification}
            />
          ))}
        </div>
      </Group>
    </>
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
  const [geoJson2] = useState(
    generatePointGeoJson({
      lat: occurrence?.coordinates.lat as number,
      lon: occurrence?.coordinates.lon as number,
    })
  );
  return (
    <Card className="g-mb-4" id="location">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="occurrenceDetails.groups.location" />
        </CardTitle>
      </CardHeader>
      <CardContent className="g-w-full">
        {occurrence.coordinates.lon && (
          <div className="g-mb-4 g-min-w-64">
            <StaticRenderSuspence fallback={<div>Loading map...</div>}>
              {/* <GeoJsonMap geoJson={geoJson} className="g-w-full g-rounded g-overflow-hidden" /> */}
              <GeoJsonMap
                geoJson={
                  termMap?.footprintWKT?.value
                    ? {
                        type: 'FeatureCollection',
                        features: [
                          {
                            type: 'Feature',
                            geometry: wellknown.parse(termMap.footprintWKT.value || '') || geoJson2,
                            properties: {},
                          },
                          generatePointGeoJson({
                            lat: occurrence?.coordinates.lat as number,
                            lon: occurrence?.coordinates.lon as number,
                          }),
                        ],
                      }
                    : generatePointGeoJson({
                        lat: occurrence?.coordinates.lat as number,
                        lon: occurrence?.coordinates.lon as number,
                      })
                }
                className="g-w-full g-rounded g-overflow-hidden"
                initialCenter={[occurrence.coordinates.lon, occurrence.coordinates.lat]}
                initialZoom={1}
                rasterStyle="gbif-natural"
              />
            </StaticRenderSuspence>
          </div>
        )}
        <div>
          <Properties breakpoint={800} className="[&>dt]:g-w-52">
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
        </div>
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
      <RecordedById {...{ showAll, termMap, occurrence }} />
      <PlainTextField term={termMap.individualCount} showDetails={showAll} />
      <PlainTextField term={termMap.organismQuantity} showDetails={showAll} />
      <PlainTextField term={termMap.organismQuantityType} showDetails={showAll} />
      <BasicField label="occurrenceFieldNames.sex">
        {termMap?.sex?.value && <ConceptValue vocabulary="Sex" name={termMap?.sex?.value} />}
      </BasicField>
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
  }, [visible, updateToc]);

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
  }, [visible, updateToc]);

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
      <Property
        value={termMap?.typeStatus?.value}
        labelId="occurrenceFieldNames.typeStatus"
        formatter={(val) => <ConceptValue vocabulary="TypeStatus" name={val} />}
      />
      <PlainTextField term={termMap.identifiedBy} showDetails={showAll} />
      <IdentifiedById {...{ showAll, termMap, occurrence }} />
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
      {/* RECORD LEVEL Actually belongs on Record card, but it seems wrong to put it first on the page, so I've moved it here along with other identifiers */}
      <PlainTextField term={termMap.institutionCode} showDetails={showAll} />
      <HtmlField term={termMap.institutionID} showDetails={showAll} />
      <PlainTextField term={termMap.ownerInstitutionCode} showDetails={showAll} />
      <PlainTextField term={termMap.collectionCode} showDetails={showAll} />
      <HtmlField term={termMap.collectionID} showDetails={showAll} />
      <HtmlField term={termMap.datasetID} showDetails={showAll} />
      <PlainTextField term={termMap.datasetName} showDetails={showAll} />
      {/* END RECORD LEVEL */}

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
      <BasicField label="occurrenceFieldNames.gbifID">{termMap?.gbifID?.value}</BasicField>
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
  const count = occurrence.stillImageCount + occurrence.movingImageCount + occurrence.soundCount;
  const Icon = occurrence.stillImageCount > 0 ? MdImage : MdAudiotrack;
  return (
    <Card className="g-mb-4">
      <div style={{ position: 'relative', background: '#eee' }}>
        {hasMore && (
          <a
            href="#multimedia"
            className="g-flex g-items-center g-absolute g-top-0 g-end-0 g-m-2 g-bg-neutral-800 g-rounded g-text-slate-100 g-px-2 g-py-1"
          >
            <Icon className="g-me-1" />
            <FormattedNumber value={count} />
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
      <Properties breakpoint={800} className="[&>dt]:g-w-52">
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
    <div className="g-mb-4 g-text-sm g-scroll-mt-24" id="provenance">
      <CardContent>
        <Properties breakpoint={800} className="[&>dt]:g-w-52">
          <BasicField label="phrases.apiAccess">
            <BulletList>
              <li>
                <a
                  className="g-text-inherit g-underline"
                  href={`${import.meta.env.PUBLIC_API_V1}/occurrence/${occurrence.key}`}
                >
                  <FormattedMessage id="occurrenceDetails.processed" />
                </a>
              </li>
              <li>
                <a
                  className="g-text-inherit g-underline"
                  href={`${import.meta.env.PUBLIC_API_V1}/occurrence/${occurrence.key}/fragment`}
                >
                  <FormattedMessage id="occurrenceDetails.fragment" />
                </a>
              </li>
            </BulletList>
          </BasicField>
          <BasicField label="occurrenceDetails.dataset">
            <DynamicLink
              to={`/dataset/${occurrence.datasetKey}`}
              pageId="datasetKey"
              variables={{ key: occurrence.datasetKey }}
              className="g-text-inherit g-underline"
            >
              {occurrence.datasetTitle}
            </DynamicLink>
          </BasicField>

          <BasicField label="occurrenceFieldNames.publisher">
            <DynamicLink
              to={`/publisher/${occurrence.publishingOrgKey}`}
              pageId="publisherKey"
              variables={{ key: occurrence.publishingOrgKey }}
              className="g-text-inherit g-underline"
            >
              {occurrence.publisherTitle}
            </DynamicLink>
          </BasicField>
          <BasicField label="phrases.lastCrawled">{occurrence?.lastCrawled}</BasicField>
        </Properties>
      </CardContent>
    </div>
  );
}
