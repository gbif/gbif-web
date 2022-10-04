
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { useQuery } from '../../dataManagement/api';
import { CollectionPresentation } from './CollectionPresentation';
import EnsureRouter from '../../EnsureRouter';

export function Collection({
  id,
  ...props
}) {
  const { data, error, loading, load } = useQuery(COLLECTION, { lazyLoad: true });
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({
        variables: {
          key: id,
          predicate: {
            type: "equals",
            key: "collectionKey",
            value: id
          }
        }
      });
    }
  }, [id]);

  return <EnsureRouter>
    <CollectionPresentation {...{ data, error, loading: loading || !data, id }} />
  </EnsureRouter>
};

const COLLECTION = `
query collection($key: String!, $predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      recordedBy
    }
  }
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
    # occurrenceMappings
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

