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

export function Taxon({ id }) {
  const { data, error, loading, load } = useQuery(QUERY_TAXON, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (typeof id !== 'undefined') {
      const query = {
        variables: {
          key: id,
          predicate: {
            type: 'equals',
            key: 'taxonKey',
            value: id,
          },
        },
      };
      load(query);
    }
  }, [id]);

  return (
    <EnsureRouter>
      <TaxonPresentation {...{ data, error, loading, id }} />
    </EnsureRouter>
  );
}

const QUERY_TAXON = `
query list($predicate: Predicate) {
  eventSearch(predicate: $predicate, size: 10) {
    documents {
      results {
        eventID
      }
    }
  }
}
`;
