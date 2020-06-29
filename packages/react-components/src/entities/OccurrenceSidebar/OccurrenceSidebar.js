/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo, MdInsertPhoto } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as css from './styles';
import { Properties, Row, Col, Tabs } from "../../components";
import { useQuery } from '../../dataManagement/api';
import { ImageDetails } from './details/ImageDetails';
import { Intro } from './details/Intro';

const { TabList, Tab, TabPanel } = Tabs;
const { Term, Value } = Properties;

export function OccurrenceSidebar({
  onImageChange,
  id,
  defaultTab,
  className,
  style,
  ...props
}) {
  const { data, error, loading, load } = useQuery(OCCURRENCE, { lazyLoad: true });
  const [activeId, setTab] = useState(defaultTab || 'details');
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({ variables: { key: id } });
    }
  }, [id]);

  return <Tabs activeId={activeId} onChange={id => setTab(id === activeId ? undefined : id)}>
    <Row wrap="nowrap" style={style} css={css.sideBar}>
      <Col shrink={false} grow={false} css={css.detailDrawerBar}>
        <TabList aria-label="Images" style={{ paddingTop: '12px' }}>
          <Tab tabId="details" direction="left">
            <MdInfo />
          </Tab>
          <Tab tabId="images" direction="left">
            <MdInsertPhoto />
          </Tab>
        </TabList>
      </Col>
      <Col shrink={false} grow={false} css={css.detailDrawerContent}>
        <TabPanel tabId='images'>
          <ImageDetails data={data} loading={loading} error={error} />
        </TabPanel>
        <TabPanel tabId='details'>
          <Intro data={data} loading={loading} error={error} />
        </TabPanel>
      </Col>
    </Row>
  </Tabs>
  // return <Div css={styles.occurrenceDrawer({ theme })} {...props}>
  //   <Properties style={{ fontSize: 13, maxWidth: 600 }} horizontal={true}>
  //     <Term>Description</Term>
  //     <Value>
  //       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus efficitur pulvinar. Maecenas ornare lobortis leo vel condimentum. Suspendisse dui lorem, tempus sed pulvinar eu, interdum et tellus. Morbi malesuada facilisis ullamcorper. Donec vehicula purus et neque sagittis mollis. Ut quis diam ex. Donec aliquam lorem vel nunc blandit dignissim. Nulla eget scelerisque neque, ut vulputate neque. Maecenas eu venenatis nisi. Duis sollicitudin, urna quis vestibulum elementum, augue est dapibus urna, in tempor dolor risus nec felis. Cras blandit luctus tortor, vitae fringilla dui ultricies non. Sed rhoncus erat quis tristique hendrerit.
  //   </Value>
  //   </Properties>
  // </Div>
};

const groups = {
  "Occurrence": [
    "occurrenceId",
    "catalogNumber",
    "recordNumber",
    "recordedBy",
    "individualCount",
    "organismQuantity",
    "organismQuantityType",
    "sex",
    "lifeStage",
    "reproductiveCondition",
    "behavior",
    "establishmentMeans",
    "occurrenceStatus",
    "preparations",
    "disposition",
    "associatedReferences",
    "associatedSequences",
    "associatedTaxa",
    "otherCatalogNumbers",
    "occurrenceRemarks",
    "issues",
    "hasCoordinate",
    "hasGeospatialIssue",
    "repatriated",
    "recordedBy",
    "associatedMedia"
  ],
  // "misc": [
  //   "abstract",
  //   "accessRights",
  //   "accrualMethod",
  //   "accrualPeriodicity",
  //   "accrualPolicy",
  //   "alternative",
  //   "audience",
  //   "available",
  //   "bibliographicCitation",
  //   "conformsTo",
  //   "contributor",
  //   "coverage",
  //   "created",
  //   "creator",
  //   "date",
  //   "dateAccepted",
  //   "dateCopyrighted",
  //   "dateSubmitted",
  //   "description",
  //   "educationLevel",
  //   "extent",
  //   "format",
  //   "hasFormat",
  //   "hasPart",
  //   "hasVersion",
  //   "identifier",
  //   "instructionalMethod",
  //   "isFormatOf",
  //   "isPartOf",
  //   "isReferencedBy",
  //   "isReplacedBy",
  //   "isRequiredBy",
  //   "isVersionOf",
  //   "issued",
  //   "language",
  //   "license",
  //   "mediator",
  //   "medium",
  //   "modified",
  //   "provenance",
  //   "publisher",
  //   "references",
  //   "relation",
  //   "replaces",
  //   "requires",
  //   "rights",
  //   "rightsHolder",
  //   "source",
  //   "spatial",
  //   "subject",
  //   "tableOfContents",
  //   "temporal",
  //   "title",
  //   "type",
  //   "valid"
  // ],
  "Record": [
    "institutionID",
    "collectionID",
    "datasetID",
    "institutionCode",
    "collectionCode",
    "datasetName",
    "ownerInstitutionCode",
    "basisOfRecord",
    "informationWithheld",
    "dataGeneralizations",
    "dynamicProperties"
  ],
  "Organism": [
    "organismID",
    "organismName",
    "organismScope",
    "associatedOccurrences",
    "associatedOrganisms",
    "previousIdentifications",
    "organismRemarks"
  ],
  "MaterialSample": [
    "materialSampleID",
    "relativeOrganismQuantity"
  ],
  "Event": [
    "eventID",
    "parentEventID",
    "fieldNumber",
    "eventDate",
    "eventTime",
    "startDayOfYear",
    "endDayOfYear",
    "year",
    "month",
    "day",
    "verbatimEventDate",
    "habitat",
    "samplingProtocol",
    "samplingEffort",
    "sampleSizeValue",
    "sampleSizeUnit",
    "fieldNotes",
    "eventRemarks"
  ],
  "Location": [
    "locationID",
    "higherGeographyID",
    "higherGeography",
    "continent",
    "waterBody",
    "islandGroup",
    "island",
    "countryCode",
    "stateProvince",
    "county",
    "municipality",
    "locality",
    "verbatimLocality",
    "verbatimElevation",
    "verbatimDepth",
    "minimumDistanceAboveSurfaceInMeters",
    "maximumDistanceAboveSurfaceInMeters",
    "locationAccordingTo",
    "locationRemarks",
    "decimalLatitude",
    "decimalLongitude",
    "coordinateUncertaintyInMeters",
    "coordinatePrecision",
    "pointRadiusSpatialFit",
    "verbatimCoordinateSystem",
    "verbatimSRS",
    "footprintWKT",
    "footprintSRS",
    "footprintSpatialFit",
    "georeferencedBy",
    "georeferencedDate",
    "georeferenceProtocol",
    "georeferenceSources",
    "georeferenceVerificationStatus",
    "georeferenceRemarks",
    "elevation",
    "elevationAccuracy",
    "depth",
    "depthAccuracy",
    "distanceAboveSurface",
    "distanceAboveSurfaceAccuracy",
    "country",
    "minimumElevationInMeters",
    "maximumElevationInMeters",
    "minimumDepthInMeters",
    "maximumDepthInMeters",
    "geodeticDatum",
    "verbatimCoordinates",
    "verbatimLatitude",
    "verbatimLongitude"
  ],
  "GeologicalContext": [
    "geologicalContextID",
    "earliestEonOrLowestEonothem",
    "latestEonOrHighestEonothem",
    "earliestEraOrLowestErathem",
    "latestEraOrHighestErathem",
    "earliestPeriodOrLowestSystem",
    "latestPeriodOrHighestSystem",
    "earliestEpochOrLowestSeries",
    "latestEpochOrHighestSeries",
    "earliestAgeOrLowestStage",
    "latestAgeOrHighestStage",
    "lowestBiostratigraphicZone",
    "highestBiostratigraphicZone",
    "lithostratigraphicTerms",
    "group",
    "formation",
    "member",
    "bed"
  ],
  "Identification": [
    "identificationID",
    "identificationQualifier",
    "typeStatus",
    "identifiedBy",
    "dateIdentified",
    "identificationReferences",
    "identificationVerificationStatus",
    "identificationRemarks",
    "typifiedName",
    "identifiedByID"
  ],
  "Taxon": [
    "taxonID",
    "scientificNameID",
    "acceptedNameUsageID",
    "parentNameUsageID",
    "originalNameUsageID",
    "nameAccordingToID",
    "namePublishedInID",
    "taxonConceptID",
    "scientificName",
    "acceptedNameUsage",
    "parentNameUsage",
    "originalNameUsage",
    "nameAccordingTo",
    "namePublishedIn",
    "namePublishedInYear",
    "higherClassification",
    "kingdom",
    "phylum",
    "class",
    "order",
    "family",
    "genus",
    "subgenus",
    "specificEpithet",
    "infraspecificEpithet",
    "taxonRank",
    "verbatimTaxonRank",
    "vernacularName",
    "nomenclaturalCode",
    "taxonomicStatus",
    "nomenclaturalStatus",
    "taxonRemarks",
    "taxonKey",
    "acceptedTaxonKey",
    "kingdomKey",
    "phylumKey",
    "classKey",
    "orderKey",
    "familyKey",
    "genusKey",
    "subgenusKey",
    "speciesKey",
    "species",
    "genericName",
    "acceptedScientificName",
    "verbatimScientificName",
    "scientificNameAuthorship"
  ],
  "Dataset": [
    "datasetKey",
    "publishingCountry"
  ],
  "Crawling": [
    "protocol",
    "lastParsed",
    "lastCrawled"
  ]
}
const OCCURRENCE = `
query occurrence($key: ID!){
  occurrence(key: $key) {
    coordinates
    volatile {
      globe(sphere: false, land: false, graticule: false) {
        svg
        lat
        lon
      }
    }

    datasetTitle
    ${groups.Record.join(('\n'))}
    ${groups.Occurrence.join(('\n'))}
    ${groups.Organism.join(('\n'))}

    multimediaItems {
      type
      format
      identifier
      created
      creator
      license
      publisher
      references
      rightsHolder
    }

    gbifClassification {
      usage {
        formattedName
      }
    }

    primaryImage {
      identifier
    }
  }
}
`;

