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

      <section className="g-m-4">
        <h1 className="g-text-2xl g-mb-2 g-font-bold">This page is a crude stub for search. For now it serves as a placeholder and easy access to individual records</h1>
        {(!loading && data) && <ul className="g-text-blue-400">
          {data.list.results.map((item) => ( 
            <li key={item.key}>
              <DynamicLink to={`/dataset/${item.key}`}>{item.title}</DynamicLink>
            </li>))}
          </ul>}
      </section>
    </>
  );
}
