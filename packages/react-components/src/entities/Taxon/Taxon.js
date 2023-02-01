import React, { useEffect } from 'react';
import { useQuery } from '../../dataManagement/api';
import { TaxonPresentation } from './TaxonPresentation';
import { MemoryRouter, useRouteMatch } from 'react-router-dom';

function EnsureRouter({ children }) {
  let hasRouter;
  try {
    const forTestOnly = useRouteMatch();
    hasRouter = true;
  } catch (err) {
    console.log(
      'No router context found, so creating a MemoryRouter for the component'
    );
    hasRouter = false;
  }
  return hasRouter ? (
    <>{children}</>
  ) : (
    <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>
  );
}

export function Taxon({ id, config }) {
  const { data, error, loading, load } = useQuery(QUERY_TAXON, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const query = {
        variables: { id },
      };
      load(query);
    }
  }, [id]);

  return (
    <EnsureRouter>
      <TaxonPresentation {...{ data, error, loading, id, config }} />
    </EnsureRouter>
  );
}

const QUERY_TAXON = `
query info($id: ID!) {
  taxon(key: $id) {
    key
    nubKey
    kingdom
    phylum
    class
    order
    family
    genus
    species
    kingdomKey
    phylumKey
    classKey
    orderKey
    familyKey
    genusKey
    speciesKey
    authorship
    issues
    rank
    remarks
    scientificName
    vernacularName
  }
}
`;
