
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
      const query = {
        variables: {
          key: id,
          predicate: {
            type: "equals",
            key: "collectionKey",
            value: id
          }
        }
      };
      load(query);
      slowLoad(query);
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
query collection($predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      recordedBy
    }
  }
}
`;

const COLLECTION = `
query collection($key: String!){
  collection(key: $key) {
    key
    active
    code
    name
    description
    taxonomicCoverage
    geography
    notes
    homepage

    numberSpecimens
    incorporatedCollections
    importantCollectors

    contentTypes
    
    personalCollection
    email
    phone
    
    catalogUrl
    apiUrl
    preservationTypes
    accessionStatus
    
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
    collectionSummary
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

