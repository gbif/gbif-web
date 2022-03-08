
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { useQuery } from '../../dataManagement/api';
import { InstitutionPresentation } from './InstitutionPresentation';

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
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (typeof id !== 'undefined') {
      load({
        variables: {
          key: id,
          predicate: {
            type: "equals",
            key: "institutionKey",
            value: id
          }
        }
      });
    }
  }, [id]);

  return <EnsureRouter>
    <InstitutionPresentation {...{ data, error, loading: loading || !data, id }} />
  </EnsureRouter>
};

const INSTITUTION = `
query institution($key: String!, $predicate: Predicate){
  occurrenceSearch(predicate: $predicate) {
    documents(size: 0) {
      total
    }
    cardinality {
      recordedBy
    }
  }
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

    identifiers {
      identifier
    }
    contacts {
      key
      firstName
      lastName
      position
      areaResponsibility
      researchPursuits
      phone
      email
      fax
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
  }
}
`;

