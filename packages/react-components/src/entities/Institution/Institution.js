
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { useQuery } from '../../dataManagement/api';
import { InstitutionPresentation } from './InstitutionPresentation';
import merge from 'lodash/merge';
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

export function Institution({
  id,
  ...props
}) {
  const { data, error, loading, load } = useQuery(INSTITUTION, { lazyLoad: true });
  const { data: slowData, error: slowError, loading: slowLoading, load: slowLoad } = useQuery(SLOW_QUERY, { lazyLoad: true });
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const query = {
        variables: {
          key: id,
          predicate: {
            type: "equals",
            key: "institutionKey",
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
    <InstitutionPresentation {...{ data: mergedData, error, loading: loading || !data, id }} />
  </EnsureRouter>
};

const SLOW_QUERY = `
query institution($key: String!, $predicate: Predicate){
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
}
`;

const INSTITUTION = `
query institution($key: String!){
  institution(key: $key) {
    key
    code
    name
    description
    active
    email
    phone
    homepage
    catalogUrl
    alternativeCodes {
      code
      description
    }
    type
    apiUrl
    institutionalGovernance
    disciplines
    latitude
    longitude
    additionalNames
    foundingDate
    geographicDescription
    taxonomicDescription
    numberSpecimens
    indexHerbariorumRecord
    logoUrl
    citesPermitNumber

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

