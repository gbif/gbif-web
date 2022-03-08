import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Properties, GadmClassification, GalleryTiles, GalleryTile, DatasetKeyLink, PublisherKeyLink } from '../../../components';
import { TaxonClassification } from './TaxonClassification/TaxonClassification';
import { AgentSummary } from './AgentSummary'

const { Term: T, Value: V } = Properties;

export const orderedGroups = [
  'summary',
  'record',
  'taxon',
  'location',
  'occurrence',
  'event',
  'organism',
  'materialSample',
  'geologicalContext',
  'identification',
  'other'
];

export const occurrenceFields = {
  summary: [
    {
      name: 'Images',
      condition: ({ occurrence }) => occurrence.stillImageCount > 0,
      Component: ({ setActiveImage, occurrence, theme }) => {
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
    },
    {
      name: 'scientificName', Value: ({ occurrence }) => {
        return <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.usage.formattedName }} />
      }
    },
    {
      name: 'acceptedScientificName', condition: ({ occurrence }) => occurrence?.gbifClassification?.synonym, Value: ({ occurrence }) => {
        return <span dangerouslySetInnerHTML={{ __html: occurrence.gbifClassification.acceptedUsage.formattedName }} />
      }
    },
    {
      name: 'taxonomicClassification', Value: ({ name, occurrence, theme }) => {
        return <TaxonClassification ranks={occurrence.gbifClassification.classification} />
      }
    },
    {
      name: 'gadmClassification', condition: ({ occurrence }) => occurrence?.gadm?.level0, Value: ({ name, occurrence, theme }) => {
        return <GadmClassification gadm={occurrence.gadm} />
      }
    },
    {
      name: 'datasetKey', trKey: 'occurrenceDetails.dataset', Value: ({ occurrence }) => {
        return <DatasetKeyLink id={occurrence.datasetKey}>{occurrence.datasetTitle}</DatasetKeyLink>
      }
    },
    {
      name: 'publishingOrgKey', trKey: 'occurrenceDetails.publisher', Value: ({ occurrence }) => {
        return <PublisherKeyLink id={occurrence.publishingOrgKey}>{occurrence.publisherTitle}</PublisherKeyLink>
      }
    },
    { name: 'basisOfRecord', enum: 'basisOfRecord' },
    'recordedBy',
    {
      name: 'recordedById', trKey: 'occurrenceFieldNames.recordedByID', condition: ({ occurrence }) => occurrence?.recordedById?.[0], Value: ({ name, occurrence, theme }) => {
        return <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {occurrence.recordedById
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
      }
    },
    'identifiedBy',
    {
      name: 'identifiedById', trKey: 'occurrenceFieldNames.identifiedByID', condition: ({ occurrence }) => occurrence?.identifiedById?.[0], Value: ({ name, occurrence, theme }) => {
        return <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {occurrence.identifiedById
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
      }
    },
  ],
  occurrence: [
    'occurrenceID',
    { name: 'catalogNumber', condition: ({ occurrence, showAll }) => showAll || occurrence.volatile.features.isSpecimen },
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
    { name: 'occurrenceStatus', enum: 'occurrenceStatus' },
    'preparations',
    'disposition',
    'associatedReferences',
    'associatedSequences',
    'associatedTaxa',
    'otherCatalogNumbers',
    'occurrenceRemarks',
    { name: 'associatedMedia', condition: ({ showAll }) => showAll },
  ],
  record: [
    'ownerInstitutionCode',
    'institutionCode',
    'institutionID',
    'collectionCode',
    'collectionID',
    // {
    //   name: 'institution', 
    //   condition: ({termMap}) => termMap?.institutionCode || termMap?.institutionID,
    //   Component: ({ occurrence, termMap }) => {
    //     return <>
    //       <T>
    //         Institution
    //       </T>
    //       <Properties style={{ fontSize: 13, gridTemplateColumns: '1fr 10fr' }} horizontal={true}>
    //         {termMap?.institutionCode?.value && <>
    //           <T>
    //             Code
    //           </T>
    //           <V>
    //             {termMap?.institutionCode?.value}
    //           </V>
    //         </>}
    //         {termMap?.institutionID?.value && <>
    //           <T>
    //             ID
    //           </T>
    //           <V>
    //             {termMap?.institutionID?.value}
    //           </V>
    //         </>}
    //       </Properties>
    //     </>
    //   }
    // },
    // {
    //   name: 'collection', 
    //   condition: ({termMap}) => termMap?.collectionCode || termMap?.collectionID,
    //   Component: ({ occurrence, termMap }) => {
    //     return <>
    //       <T>
    //         Collection
    //       </T>
    //       <Properties style={{ fontSize: 13, gridTemplateColumns: '1fr 10fr' }} horizontal={true}>
    //         {termMap?.collectionCode?.value && <>
    //           <T>
    //             Code
    //           </T>
    //           <V>
    //             {termMap?.collectionCode?.value}
    //           </V>
    //         </>}
    //         {termMap?.collectionID?.value && <>
    //           <T>
    //             ID
    //           </T>
    //           <V>
    //             {termMap?.collectionID?.value}
    //           </V>
    //         </>}
    //       </Properties>
    //     </>
    //   }
    // },
    'datasetID',
    'datasetName',
    { name: 'basisOfRecord', enum: 'basisOfRecord' },
    'informationWithheld',
    'dataGeneralizations',
    'dynamicProperties'
  ],
  organism: [
    'organismID',
    'organismName',
    'organismScope',
    'associatedOccurrences',
    'associatedOrganisms',
    'previousIdentifications',
    'organismRemarks'
  ],
  materialSample: [
    'materialSampleID'
  ],
  event: [
    'eventID',
    'parentEventID',
    'fieldNumber',
    'eventDate',
    'eventTime',
    'startDayOfYear',
    'endDayOfYear',
    { name: 'year', condition: ({ showAll }) => showAll },
    { name: 'month', condition: ({ showAll }) => showAll },
    { name: 'day', condition: ({ showAll }) => showAll },
    'verbatimEventDate',
    'habitat',
    'samplingProtocol',
    'samplingEffort',
    'sampleSizeValue',
    'sampleSizeUnit',
    'fieldNotes',
    'eventRemarks'
  ],
  location: [
    'locationID',
    'higherGeographyID',
    'higherGeography',
    { name: 'continent', enum: 'continent' },
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
    'verticalDatum',
    'verbatimSRS',
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
    { name: 'minimumElevationInMeters', condition: ({ showAll }) => showAll },
    { name: 'maximumElevationInMeters', condition: ({ showAll }) => showAll },
    'elevation',
    'elevationAccuracy',
    'minimumDepthInMeters',
    'maximumDepthInMeters',
    { name: 'minimumDepthInMeters', condition: ({ showAll }) => showAll },
    { name: 'maximumDepthInMeters', condition: ({ showAll }) => showAll },
    'depth',
    'depthAccuracy',
    'geodeticDatum',
    'verbatimCoordinates',
    'verbatimLatitude',
    'verbatimLongitude'
  ],
  geologicalContext: [
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
    'bed'
  ],
  identification: [
    'identificationID',
    'identificationQualifier',
    { name: 'typeStatus', enum: 'typeStatus' },
    'identifiedBy',
    'verbatimIdentification',
    'dateIdentified',
    'identificationReferences',
    'identificationVerificationStatus',
    'identificationRemarks'
  ],
  taxon: [
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
    { name: 'taxonRank', enum: 'taxonRank' },
    'verbatimTaxonRank',
    'vernacularName',
    'nomenclaturalCode',
    { name: 'taxonomicStatus', enum: 'taxonomicStatus' },
    'nomenclaturalStatus',
    'taxonRemarks',
    'scientificNameAuthorship'
  ],
  other: [
    'abstract',
    'accessRights',
    'accrualMethod',
    'accrualPeriodicity',
    'accrualPolicy',
    'alternative',
    'audience',
    'available',
    'bibliographicCitation',
    'conformsTo',
    'contributor',
    'coverage',
    'created',
    'creator',
    'date',
    'dateAccepted',
    'dateCopyrighted',
    'dateSubmitted',
    'description',
    'educationLevel',
    'extent',
    'format',
    'hasFormat',
    'hasPart',
    'hasVersion',
    'identifier',
    'instructionalMethod',
    'isFormatOf',
    'isPartOf',
    'isReferencedBy',
    'isReplacedBy',
    'isRequiredBy',
    'isVersionOf',
    'issued',
    'language',
    { name: 'license', enum: 'license' },
    'mediator',
    'medium',
    'modified',
    'provenance',
    'publisher',
    'references',
    'relation',
    'replaces',
    'requires',
    'rights',
    'rightsHolder',
    'source',
    'spatial',
    'subject',
    'tableOfContents',
    'temporal',
    'title',
    'type',
    'valid',
    {
      name: 'key', trKey: 'occurrenceFieldNames.gbifID', Value: ({ occurrence }) => {
        return <>{occurrence.key}</>
      }
    },
  ]
}