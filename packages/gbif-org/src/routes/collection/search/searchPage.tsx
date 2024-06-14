import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DynamicLink } from '@/components/dynamicLink';
import useQuery from '@/hooks/useQuery';

const COLLECTION_SEARCH_QUERY = /* GraphQL */ `
  query CollectionSearch($offset: Int) {
    list: collectionSearch(offset: $offset, limit: 100, sortBy: NUMBER_SPECIMENS, sortOrder: DESC) {
      results {
        title: name
        key
      }
    }
  }

`;

export function CollectionSearchPage(): React.ReactElement {
  const { data, loading, error } = useQuery(COLLECTION_SEARCH_QUERY, {variables: {offset: 0}});

  return (
    <>
      <Helmet>
        <title>Collection search</title>
      </Helmet>

      <section>
        {(!loading && data) && <ul>
          {data.list.results.map((item) => ( 
            <li key={item.key}>
              <DynamicLink to={`/collection/${item.key}`}>{item.title}</DynamicLink>
            </li>))}
          </ul>}
      </section>
    </>
  );
}
