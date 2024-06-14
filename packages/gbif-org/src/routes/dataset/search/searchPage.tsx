import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DynamicLink } from '@/components/dynamicLink';
import useQuery from '@/hooks/useQuery';

const DATASET_SEARCH_QUERY = /* GraphQL */ `
  query DatasetSearch($offset: Int) {
    list: datasetSearch(offset: $offset, limit: 100) {
      count
      limit
      offset
      results {
        key
        title
      }
    }
  }

`;

export function DatasetSearchPage(): React.ReactElement {
  const { data, loading, error } = useQuery(DATASET_SEARCH_QUERY, {variables: {offset: 0}});

  return (
    <>
      <Helmet>
        <title>Dataset search</title>
      </Helmet>

      <section>
        {(!loading && data) && <ul>
          {data.list.results.map((item) => ( 
            <li key={item.key}>
              <DynamicLink to={`/dataset/${item.key}`}>{item.title}</DynamicLink>
            </li>))}
          </ul>}
      </section>
    </>
  );
}
