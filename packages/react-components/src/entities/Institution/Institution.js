
import React, { useEffect } from 'react';
import { useQuery } from '../../dataManagement/api';
import { InstitutionPresentation } from './InstitutionPresentation';
import merge from 'lodash/merge';
import { MemoryRouter, useRouteMatch } from 'react-router-dom';
import { ErrorBoundary } from '../../components';

function EnsureRouter({ children }) {
  let hasRouter;
  try {
    const forTestOnly = useRouteMatch();
    hasRouter = true;
  } catch (err) {
    console.log('No router context found, so creating a MemoryRouter for the component');
    hasRouter = false;
  }
  return hasRouter ? <>{children}</> : <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
}

export function Institution({
  id,
  ...props
}) {
  const { data, error, loading, load } = useQuery(INSTITUTION, { lazyLoad: true });
  const { data: slowData, error: slowError, loading: slowLoading, load: slowLoad } = useQuery(SLOW_QUERY, { lazyLoad: true });

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const institutionPredicate = {
        type: "equals",
        key: "institutionKey",
        value: id
      };

      const query = {
        variables: {
          key: id,
          predicate: institutionPredicate
        }
      };
      load(query);
      slowLoad({
        variables: {
          key: id,
          predicate: institutionPredicate,
          imagePredicate: {
            type: 'and',
            predicates: [institutionPredicate, { type: 'equals', key: 'mediaType', value: 'StillImage' }]
          },
          coordinatePredicate: {
            type: 'and',
            predicates: [
              institutionPredicate,
              { type: 'equals', key: 'hasCoordinate', value: 'true' }
            ]
          },
          clusterPredicate: {
            type: 'and',
            predicates: [
              institutionPredicate,
              { type: 'equals', key: 'isInCluster', value: 'true' }
            ]
          },
        }
      });
    }
  }, [id]);

  let mergedData = data ? merge({}, data, slowData) : data;

  return <EnsureRouter>
    <ErrorBoundary>
      <InstitutionPresentation {...{ data: mergedData, error, loading, id }} />
    </ErrorBoundary>
  </EnsureRouter>
};

const SLOW_QUERY = `
query institution($key: ID!, $predicate: Predicate, $imagePredicate: Predicate, $coordinatePredicate: Predicate, $clusterPredicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
  }
  institution(key: $key) {
    key
    collections(limit: 200) {
      key
      occurrenceCount
      richness
    }
  }
  withImages: occurrenceSearch(predicate: $imagePredicate) {
    documents(size: 0) {
      total
    }
  }
  withCoordinates: occurrenceSearch(predicate: $coordinatePredicate) {
    documents(size: 0) {
      total
    }
  }
  withClusters: occurrenceSearch(predicate: $clusterPredicate) {
    documents(size: 0) {
      total
    }
  }
}
`;

const INSTITUTION = `
query institution($key: ID!){
  institution(key: $key) {
    key
    code
    name
    description
    active
    email
    phone
    homepage
    catalogUrls
    alternativeCodes {
      code
      description
    }
    featuredImageUrl
    featuredImageLicense
    types
    apiUrls
    institutionalGovernances
    disciplines
    latitude
    longitude
    additionalNames
    foundingDate
    numberSpecimens
    logoUrl

    masterSourceMetadata {
      key
      source
      sourceId
    }

    created
    deleted
    modified
    modifiedBy
    replacedByInstitution {
      name
      key
    }
    replacedByCollection {
      name
      key
    }

    identifiers {
      identifier
      type
    }
    contactPersons {
      key
      firstName
      lastName
      phone
      email
      taxonomicExpertise
      primary
      position
      userIds {
        type
        id
      }
    }
    numberSpecimens
    
    mailingAddress {
      address
      city
      province
      postalCode
      country
    }
    address {
      address
      city
      province
      postalCode
      country
    }
    collections(limit: 200) {
      key
      excerpt
      code
      name
      active
      numberSpecimens
      richness
    }
  }
}
`;

