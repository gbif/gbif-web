import React, { useContext, useEffect } from 'react';
import SiteContext from '../../dataManagement/SiteContext';
import { useQuery } from '../../dataManagement/api';
import { PublisherPresentation } from './PublisherPresentation';
import { ErrorBoundary } from '../../components';

export function Publisher({
  id,
  useMemoryRouter,
  ...props
}) {
  const { data, error, loading, load } = useQuery(PUBLISHER, { lazyLoad: true });
  const { data: insights, error: insightsError, loading: insightsLoading, load: loadInsights } = useQuery(PUBLISHER_SECONDARY, { lazyLoad: true });
  const siteContext = useContext(SiteContext);
  const sitePredicate = siteContext?.occurrence?.rootPredicate;

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const publisherPredicate = {
        type: "equals",
        key: "publishingOrg",
        value: id
      };
      // we also want to know how many of those occurrences are included on the present site
      const predicates = [publisherPredicate];
      if (sitePredicate) predicates.push(sitePredicate);
      load({
        variables: {
          key: id,
          predicate: publisherPredicate,
          sitePredicate: {
            type: 'and',
            predicates
          }
        }
      });
      loadInsights({
        variables: {
          key: id,
          publisherPredicate,
          imagePredicate: {
            type: 'and',
            predicates: [publisherPredicate, { type: 'equals', key: 'mediaType', value: 'StillImage' }]
          },
          coordinatePredicate: {
            type: 'and',
            predicates: [
              publisherPredicate,
              { type: 'equals', key: 'hasCoordinate', value: 'true' },
              { type: 'equals', key: 'hasGeospatialIssue', value: 'false' }
            ]
          },
          taxonPredicate: {
            type: 'and',
            predicates: [publisherPredicate, { type: 'equals', key: 'issue', value: 'TAXON_MATCH_NONE' }]
          },
          yearPredicate: {
            type: 'and',
            predicates: [publisherPredicate, { type: 'isNotNull', key: 'year' }]
          },
          eventPredicate: {
            type: 'and',
            predicates: [publisherPredicate, { type: 'isNotNull', key: 'eventId' }]
          }
        }
      });
    }
  }, [id]);

  return <ErrorBoundary>
    <PublisherPresentation {...{ data, error, loading: loading || !data, id }} insights={{ data: insights, loading: insightsLoading, error: insightsError }} {...props} />
  </ErrorBoundary>
};

const PUBLISHER_SECONDARY = `
query ($publisherPredicate: Predicate, $imagePredicate: Predicate, $coordinatePredicate: Predicate, $taxonPredicate: Predicate, $yearPredicate: Predicate, $eventPredicate: Predicate){
  unfiltered: occurrenceSearch(predicate: $publisherPredicate) {
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

const PUBLISHER = `
query publisher($key: ID!, $predicate: Predicate, $sitePredicate: Predicate){
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
  literatureSearch(publishingOrganizationKey: [$key]) {
    documents {
      total
    }
  }
  hostedDatasets: datasetSearch(hostingOrg: [$key]) {
    count
  }
  publisher: organization(key: $key) {
    key
    title
    description
    homepage
    created
    modified
    deleted
    createdBy
    modifiedBy
    numPublishedDatasets
    logoUrl
    
    latitude
    longitude
    address
    city
    country
    email
    phone
    postalCode
    province

    endorsingNode {
      title
      participant {
        id
        name
        type
        countryCode
      }
    }
    endorsingNodeKey
    endorsementApproved

    installation {
      count
      results {
        key
        title
      }
    }

    contacts {
      key
      address
      city
      country
      email
      firstName
      lastName
      homepage
      organization
      phone
      position
      postalCode
      primary
      province
      type
      userId
      roles
    }
  }
}
`;
