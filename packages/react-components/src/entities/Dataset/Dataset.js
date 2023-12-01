
import React, { useContext, useEffect } from 'react';
import SiteContext from '../../dataManagement/SiteContext';
import { useQuery } from '../../dataManagement/api';
import { DatasetPresentation } from './DatasetPresentation';
import { ErrorBoundary } from '../../components';

export function Dataset({
  id,
  useMemoryRouter,
  ...props
}) {
  const { data, error, loading, load } = useQuery(DATASET, { lazyLoad: true });
  const { data: insights, error: insightsError, loading: insightsLoading, load: loadInsights } = useQuery(DATASET_SECONDARY, { lazyLoad: true });
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
            predicates: [datasetPredicate, { type: 'equals', key: 'mediaType', value: 'StillImage' }]
          },
          coordinatePredicate: {
            type: 'and',
            predicates: [
              datasetPredicate,
              { type: 'equals', key: 'hasCoordinate', value: 'true' },
              { type: 'equals', key: 'hasGeospatialIssue', value: 'false' }
            ]
          },
          taxonPredicate: {
            type: 'and',
            predicates: [datasetPredicate, { type: 'equals', key: 'issue', value: 'TAXON_MATCH_NONE' }]
          },
          yearPredicate: {
            type: 'and',
            predicates: [datasetPredicate, { type: 'isNotNull', key: 'year' }]
          },
          eventPredicate: {
            type: 'and',
            predicates: [datasetPredicate, { type: 'isNotNull', key: 'eventId' }]
          }
        }
      });
    }
  }, [id]);

  return <ErrorBoundary>
    <DatasetPresentation {...{ data, error, loading: loading || !data, id }} insights={{ data: insights, loading: insightsLoading, error: insightsError }} {...props} />
  </ErrorBoundary>
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
          identifier: thumbor(height: 400)
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
      total
    }
  }
  totalTaxa: taxonSearch(datasetKey: [$key], origin: [SOURCE]){
    count
  }
  accepted: taxonSearch(datasetKey: [$key], origin: [SOURCE], status: [ACCEPTED]){
    count
  }
  synonyms: taxonSearch(datasetKey: [$key], origin: [SOURCE], status: [SYNONYM, HETEROTYPIC_SYNONYM, PROPARTE_SYNONYM, HOMOTYPIC_SYNONYM]){
    count
  }
  dataset(key: $key) {
    key
    checklistBankDataset {
      key
    }
    type
    title
    created
    modified
    deleted
    duplicateOfDataset {
      key
      title
    }
    metrics {
      colCoveragePct
      nubCoveragePct
      nubMatchingCount
      colMatchingCount
    }
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
