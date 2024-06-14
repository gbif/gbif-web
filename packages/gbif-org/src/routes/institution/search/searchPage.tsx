import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DynamicLink } from '@/components/dynamicLink';
import useQuery from '@/hooks/useQuery';

const INSTITUTION_SEARCH_QUERY = /* GraphQL */ `
  query InstitutionSearch($offset: Int) {
    list: institutionSearch(offset: $offset, limit: 100, sortBy: NUMBER_SPECIMENS, sortOrder: DESC) {
      results {
        title: name
        key
      }
    }
  }

`;

export function InstitutionSearchPage(): React.ReactElement {
  const { data, loading, error } = useQuery(INSTITUTION_SEARCH_QUERY, {variables: {offset: 0}});

  return (
    <>
      <Helmet>
        <title>Institution search</title>
      </Helmet>

      <section>
        {(!loading && data) && <ul>
          {data.list.results.map((item) => ( 
            <li key={item.key}>
              <DynamicLink to={`/institution/${item.key}`}>{item.title}</DynamicLink>
            </li>))}
          </ul>}
      </section>
    </>
  );
}
