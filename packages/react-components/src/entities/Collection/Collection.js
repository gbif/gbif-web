
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { useQuery } from '../../dataManagement/api';
import { CollectionPresentation } from './CollectionPresentation';
import merge from 'lodash/merge';
import EnsureRouter from '../../EnsureRouter';
import { ErrorBoundary } from '../../components';

export function Collection({
  id,
  ...props
}) {
  const { data, error, loading, load } = useQuery(COLLECTION, { lazyLoad: true });
  const { data: slowData, error: slowError, loading: slowLoading, load: slowLoad } = useQuery(SLOW_QUERY, { lazyLoad: true });
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const collectionPredicate = {
        type: "equals",
        key: "collectionKey",
        value: id
      };

      const query = {
        variables: {
          key: id,
          predicate: collectionPredicate
        }
      };
      load(query);
      slowLoad({
        variables: {
          predicate: collectionPredicate,
          imagePredicate: {
            type: 'and',
            predicates: [collectionPredicate, { type: 'equals', key: 'mediaType', value: 'StillImage' }]
          },
          coordinatePredicate: {
            type: 'and',
            predicates: [
              collectionPredicate,
              { type: 'equals', key: 'hasCoordinate', value: 'true' }
            ]
          },
          clusterPredicate: {
            type: 'and',
            predicates: [
              collectionPredicate,
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
      <CollectionPresentation {...{ data: mergedData, error, loading: loading, id }} />
    </ErrorBoundary>
  </EnsureRouter>
};

const SLOW_QUERY = `
query collection($predicate: Predicate, $imagePredicate: Predicate, $coordinatePredicate: Predicate, $clusterPredicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      recordedBy
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

const COLLECTION = `
query collection($key: ID!){
  collection(key: $key) {
    key
    active
    code
    name
    description
    descriptorGroups {
      count
    }
    taxonomicCoverage
    geographicCoverage
    temporalCoverage
    notes
    homepage

    numberSpecimens
    incorporatedCollections

    contentTypes
    
    personalCollection
    email
    phone
    
    catalogUrls
    apiUrls
    preservationTypes
    accessionStatus

    featuredImageUrl
    featuredImageLicense
    
    created
    deleted
    modified
    modifiedBy
    replacedByCollection {
      name
      key
    }

    institutionKey
    identifiers {
      key
      type
      identifier
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

    alternativeCodes {
      code
      description
    }
    institution {
      code
      name
      key
    }
    
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
  }
}
`;

