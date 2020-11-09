import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Properties, GadmClassification } from '../../../components';
import { TaxonClassification } from './TaxonClassification/TaxonClassification';

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
    'scientificName',
    {
      name: 'classification', Value: ({ name, occurrence, theme }) => {
        return <TaxonClassification ranks={occurrence.gbifClassification.classification} />
      }
    },
    {
      name: 'gadm', condition: ({ occurrence }) => occurrence?.gadm?.level0, Value: ({ name, occurrence, theme }) => {
        return <GadmClassification gadm={occurrence.gadm} />
      }
    }
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
    'associatedMedia'
  ],
  record: [
    {
      name: 'custom', Component: ({ name, occurrence, theme }) => {
        return <>
          <T>
            <FormattedMessage
              id={`ocurrenceFieldNames.${name}`}
              defaultMessage={_.startCase(name)}
            />
          </T>
          <V>
            custom value
        </V>
        </>
      }
    },
    'institutionID',
    'collectionID',
    'datasetID',
    { name: 'institutionCode', condition: ({ occurrence, showAll }) => showAll || occurrence.volatile.features.isSpecimen },
    { name: 'collectionCode', condition: ({ occurrence, showAll }) => showAll || occurrence.volatile.features.isSpecimen },
    'datasetName',
    { name: 'ownerInstitutionCode', condition: ({ occurrence, showAll }) => showAll || occurrence.volatile.features.isSpecimen },
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
    'typeStatus',
    'identifiedBy',
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
    'valid'
  ]
}