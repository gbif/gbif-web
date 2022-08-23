
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import SiteContext from '../../dataManagement/SiteContext';
import { useQuery } from '../../dataManagement/api';
import { DatasetPresentation } from './DatasetPresentation';

import { MemoryRouter, useRouteMatch } from 'react-router-dom';

function EnsureRouter({children}) {
  let hasRouter;
  try {
    const forTestOnly = useRouteMatch();
    hasRouter = true;
  } catch(err) {
    console.log('No router context found, so creating a MemoryRouter for the component');
    hasRouter = false;
  }
  return hasRouter ? <>{children}</> : <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
}

export function Dataset({
  id,
  ...props
}) {
  const { error, loading, load } = useQuery(DATASET, { lazyLoad: true });
  const data = {
    "occurrenceSearch": {
        "documents": {
            "total": 1121933
        }
    },
    "siteOccurrences": {
        "documents": {
            "total": 1121933
        }
    },
    "literatureSearch": {
        "documents": {
            "count": 356
        }
    },
    "taxonSearch": {
        "count": 0
    },
    "dataset": {
        "key": "2985efd1-45b1-46de-b6db-0465d2834a5a",
        "type": "OCCURRENCE",
        "title": "Tasmanian Natural Values Atlas",
        "created": "2017-09-20T14:51:27.457+00:00",
        "modified": "2022-06-20T07:42:12.362+00:00",
        "pubDate": "2019-10-11T00:00:00.000+00:00",
        "description": "<p>ABOUT THE NATURAL VALUES ATLAS<br>\nThe Natural Values Atlas provides an easy to use web interface allowing access to authoritative and comprehensive natural values information.  It draws together in one centralised location data on Tasmanian flora and fauna including Threatened species and weeds as well as the Tasmanian Geodiversity Database.  It also incorporates access to other essential data sets such as TASVEG, Threatened communities and Reserves.  The Natural Values Atlas is a supported information tool that ensures knowledge about Tasmania's valuable natural assets is readily available and quickly obtained.  This information informs planning and decision making processes across all levels of government, industry and the general public, assisting to improve conservation outcomes for natural values in the State.</p>\n<p>SPECIES<br>\nThe Natural Values Atlas is comprised of a database and web based application that allows observations of plants and animals from various sources to be viewed, recorded and analysed.  It can be used to search for information on more than 20,000 plant and animal species from Tasmania, Australia and can display maps showing their location and extent.  There are currently over 1 million observations of plants and animals recorded in the Natural Values Atlas which have been collected by a variety of custodians.  This information has been generated through general species surveys and projects undertaken for scientific research, environmental assessments and other purposes throughout the State since the 1800's.<br>\nThe application maintains species taxonomy, attributes and conservation values and provides access to images, related web sites and management documents such as listing statements and recovery plans.  Habitat Mapping for a number of high priority threatened fauna species is also available.  Information sourced from monitoring individual flora and fauna species is accessible as well as samples and analysis which allows information about samples that are associated with an observation to be recorded and tracked.</p>\n<p>GEODIVERSITY<br>\nThe Natural Values Atlas can be used to find and download information about sites that are listed in the Tasmanian Geodiversty Database either for their geology, geomorphology or soil conservation values.  The database contains descriptions of the sites and the geodiverstiy values they encompass, their significance to conservation, sensitivity to disturbance, and advice as to appropriate site management.  The Natural Values Atlas can display maps showing the location and extent of sites.</p>\n<p>MANAGEMENT<br>\nManagement locations and activities are another important area of the Natural Values Atlas which provide access to data about locations where activities are being undertaken to control, monitor, manage or maintain natural values.  Examples include 1080 baits, traps, nests, nest boxes and monitoring plots.</p>\n<p>PROJECTS<br>\nAll data stored in the Natural Values Atlas is organised under a Project.  This component of the Natural Values Atlas contains information regarding the custodian responsible for the project, specific project details such as the people involved in the project or the methodology used to collect the data.  Associated reports, links and images can also be found in this area.  It provides metadata for each project data set.</p>\n<p>CONSEVATION INFORMATION SYSTEM<br>\nThe Conservation Information System (CIS) contains data that assists with conservation planning at the landscape scale.  The CIS Conservation Analysis interface allows you to apply your own weightings for a particular conservation value to create a map of areas that have a high density of the natural values of interest.</p>\n<p>NATURAL VALUES REPORTS<br>\nNatural Values Reports enables multiple data sets to be brought together in the one report providing a resource that can be used for desktop assessments of natural values for specific areas.  Some of the data sets available through the Natural Values Report facility include: threatened species, species of conservation significance, weeds, geodiversity, TASVEG, threatened communities and reserves.</p>\n<p>QUALITY ASSURANCE<br>\nNew data is loaded into the Natural Values Atlas daily and existing data is regularly reviewed and updated as required.  All data in the Natural Values Atlas is carefully scrutinized by the NVA team who draw on the support of relevant experts to ensure that the data is of the highest quality possible.  This is an ongoing task for which the NVA team welcomes feedback and input from NVA users to continually improve the quality of the data.<br>\nThe NVA is supported by Metadata and Business Rules.  These are available from within the NVA or on request.<br>\nThe Natural Values Atlas undergoes constant review and improvement where existing functionality is streamlined and new functionality is added as required.  New versions are regularly released.  The Natural Values Atlas Message Board informs users of changes to the system.</p>\n<p>SUPPORT<br>\nThere is online help embedded in the Natural Values Atlas which instructs users on how to operate the database and make use of the various functions available.  It you are interested in attending a training session then please contact the NVA team to find out what is available.</p>\n<p>HOW TO ACCESS THE NATURAL VALUES ATLAS<br>\nGo to www.naturalvaluesatlas.tas.gov.au and select the Register button.  Fill in and submit the form.  You will be informed via email when your user name and password has been activated.  Simplified data from the NVA is also available via the Land Information System Tasmania (LIST) at www.thelist.tas.gov.au.</p>\n<p>FURTHER INFORMATION<br>\nFor enquiries please contact support(at)naturalvaluesatlas.tas.gov.au.</p>\n",
        "purpose": "",
        "temporalCoverages": [],
        "logoUrl": null,
        "publishingOrganizationKey": "e401baff-ed77-4484-9897-81209fa336d8",
        "publishingOrganizationTitle": "Tasmanian Department of Primary Industries, Parks, Water and Environment",
        "homepage": "http://www.dpiw.tas.gov.au/inter.nsf/webpages/ljem-6tv6tv?open",
        "additionalInfo": "The Natural Values Atlas does contain restricted data however only non restricted project and species observation data will be provided to the ALA. To request access to these records please contact support(at)naturalvaluesatlas.tas.gov.au.",
        "installation": {
            "key": "19893c10-381e-4534-9bb8-6c37d03ad29e",
            "title": "ALA.org.au",
            "organization": {
                "key": "3c5e4331-7f2f-4a8d-aa56-81ece7014fc8",
                "title": "Atlas of Living Australia"
            }
        },
        "volatileContributors": [
            {
                "key": "3347859",
                "firstName": null,
                "lastName": null,
                "position": [],
                "organization": "Tasmanian Natural Values Atlas",
                "address": [],
                "userId": [],
                "email": [],
                "phone": [],
                "type": "ORIGINATOR",
                "_highlighted": null,
                "roles": [
                    "ORIGINATOR",
                    "METADATA_AUTHOR"
                ]
            },
            {
                "key": "3347861",
                "firstName": null,
                "lastName": null,
                "position": [],
                "organization": "Atlas of Living Australia",
                "address": [
                    "CSIRO Ecosystems Services"
                ],
                "userId": [],
                "email": [],
                "phone": [],
                "type": "DISTRIBUTOR",
                "_highlighted": null,
                "roles": [
                    "DISTRIBUTOR",
                    "ADMINISTRATIVE_POINT_OF_CONTACT"
                ]
            }
        ],
        "contactsCitation": [],
        "geographicCoverages": [],
        "taxonomicCoverages": [],
        "bibliographicCitations": [],
        "samplingDescription": {
            "studyExtent": null,
            "sampling": null,
            "qualityControl": null,
            "methodSteps": []
        },
        "dataDescriptions": [],
        "citation": {
            "text": "Tasmanian Department of Primary Industries, Parks, Water and Environment (2019). Tasmanian Natural Values Atlas. Occurrence dataset https://doi.org/10.15468/rtnb4m accessed via GBIF.org on 2022-08-18."
        },
        "license": "http://creativecommons.org/licenses/by/4.0/legalcode",
        "project": null,
        "endpoints": [
            {
                "key": "336916",
                "type": "DWC_ARCHIVE",
                "url": "https://biocache.ala.org.au/archives/gbif/dr710/dr710.zip"
            }
        ],
        "identifiers": [
            {
                "key": "110105",
                "type": "URL",
                "identifier": "https://collections.ala.org.au/public/show/dr710"
            },
            {
                "key": "110104",
                "type": "UUID",
                "identifier": "511a3d16-66cd-3cae-9d21-60cdc59dec45"
            },
            {
                "key": "105738",
                "type": "URL",
                "identifier": "http://collections.ala.org.au/public/show/dr710"
            },
            {
                "key": "105737",
                "type": "UUID",
                "identifier": "2985efd1-45b1-46de-b6db-0465d2834a5a"
            },
            {
                "key": "105736",
                "type": "UUID",
                "identifier": "bef76b2c-5926-3b7b-9f21-960c56d0332c"
            },
            {
                "key": "104590",
                "type": "UUID",
                "identifier": "ae74dd39-6920-3011-baf7-26754ebfc4ef"
            }
        ],
        "doi": "10.15468/rtnb4m",
        "machineTags": [
            {
                "namespace": "crawler.gbif.org"
            },
            {
                "namespace": "sampling.gbif.org"
            },
            {
                "namespace": "sampling.gbif.org"
            }
        ],
        "gridded": []
    }
};
  const { data: insights, error: insightsError, loading: insightsLoading, load: loadInsights } = useQuery(DATASET_SECONDARY, { lazyLoad: true });
  const theme = useContext(ThemeContext);
  const siteContext = useContext(SiteContext);
  const sitePredicate = siteContext?.occurrence?.rootPredicate;

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const datasetPredicate = {
        type: "equals",
        key: "datasetKey",
        value: id
      };
      // we also want to know how many of those occurrences are included on the present site
      const predicates = [datasetPredicate];
      if (sitePredicate) predicates.push(sitePredicate);
      load({
        variables: {
          key: id,
          predicate: datasetPredicate,
          sitePredicate: {
            type: 'and',
            predicates
          }
        }
      });
      loadInsights({
        variables: {
          key: id,
          datasetPredicate,
          imagePredicate: {
            type: 'and',
            predicates: [datasetPredicate, {type: 'equals', key: 'mediaType', value: 'StillImage'}]
          },
          coordinatePredicate: {
            type: 'and',
            predicates: [
              datasetPredicate, 
              {type: 'equals', key: 'hasCoordinate', value: 'true'},
              {type: 'equals', key: 'hasGeospatialIssue', value: 'false'}
            ]
          },
          taxonPredicate: {
            type: 'and',
            predicates: [datasetPredicate, {type: 'equals', key: 'issue', value: 'TAXON_MATCH_NONE'}]
          },
          yearPredicate: {
            type: 'and',
            predicates: [datasetPredicate, {type: 'isNotNull', key: 'year'}]
          },
          eventPredicate: {
            type: 'and',
            predicates: [datasetPredicate, {type: 'isNotNull', key: 'eventId'}]
          }
        }
      });
    }
  }, [id]);

  return <EnsureRouter>
    <DatasetPresentation {...{ data, error, loading: loading || !data, id }} insights={{data: insights, loading: insightsLoading, error: insightsError}} />
  </EnsureRouter>
};

const DATASET_SECONDARY = `
query ($datasetPredicate: Predicate, $imagePredicate: Predicate, $coordinatePredicate: Predicate, $taxonPredicate: Predicate, $yearPredicate: Predicate, $eventPredicate: Predicate){
  unfiltered: occurrenceSearch(predicate: $datasetPredicate) {
    cardinality {
      eventId
    }
    facet {
      dwcaExtension {
        key
        count
      }
    }
  }
  images: occurrenceSearch(predicate: $imagePredicate) {
    documents(size: 10) {
      total
      results {
        key
        stillImages {
          identifier
        }
      }
    }
  }
  withCoordinates: occurrenceSearch(predicate: $coordinatePredicate) {
    documents(size: 10) {
      total
    }
  }
  withTaxonMatch: occurrenceSearch(predicate: $taxonPredicate) {
    documents(size: 10) {
      total
    }
  }
  withYear: occurrenceSearch(predicate: $yearPredicate) {
    documents(size: 10) {
      total
    }
  }
  withEventId: occurrenceSearch(predicate: $eventPredicate) {
    documents(size: 10) {
      total
    }
  }
}
`;

const DATASET = `
query dataset($key: ID!, $predicate: Predicate, $sitePredicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
  }
  siteOccurrences: occurrenceSearch(predicate: $sitePredicate) {
    documents(size: 0) {
      total
    }
  }
  literatureSearch(gbifDatasetKey: [$key]) {
    documents {
      count
    }
  }
  taxonSearch(datasetKey: [$key], origin: [SOURCE], status: [ACCEPTED]){
    count
  }
  dataset(key: $key) {
    key
    type
    title
    created
    modified
    pubDate
    description
    purpose
    temporalCoverages
    logoUrl
    publishingOrganizationKey
    publishingOrganizationTitle
    homepage
    additionalInfo
    installation {
      key
      title
      organization {
        key
        title
      }
    }
    volatileContributors {
      key
      firstName
      lastName
      position
      organization
      address
      userId
      email
      phone
      type
      _highlighted
      roles
    }
    contactsCitation {
      key
      abbreviatedName
      firstName
      lastName
      userId
      roles
    }
    geographicCoverages {
      description
      boundingBox {
        minLatitude
        maxLatitude
        minLongitude
        maxLongitude
        globalCoverage
      }
    }
    taxonomicCoverages {
      description
      coverages {
        scientificName
        commonName
        rank {
          interpreted
        }
      }
    }
    bibliographicCitations {
      identifier
      text
    }
    samplingDescription {
      studyExtent
      sampling
      qualityControl
      methodSteps
    }
    dataDescriptions {
      charset
      name
      format
      formatVersion
      url
    }
    citation {
      text
    }
    license
    project {
      title
      abstract
      studyAreaDescription
      designDescription
      funding
      contacts {
        firstName
        lastName

        organization
        position
        roles
        type

        address
        city
        postalCode
        province
        country
        
        homepage
        email
        phone
        userId
      }
      identifier
    }
    endpoints {
      key
      type
      url
    }
    identifiers {
      key
      type
      identifier
    }
    doi
    machineTags {
      namespace
    }
    gridded {
      percent
    }
  }
}
`;

