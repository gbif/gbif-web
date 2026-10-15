import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import React from 'react';

const INSTITUTION_SEARCH_QUERY = `
  query InstitutionSearch($offset: Int) {
    list: institutionSearch(
      offset: $offset
      limit: 100
      sortBy: NUMBER_SPECIMENS
      sortOrder: DESC
    ) {
      results {
        title: name
        key
      }
    }
  }
`;

// The query is not tagged for codegen, so its result is typed by hand.
type InstitutionStubSearchResult = {
  list: { results: { title?: string | null; key: string }[] };
};

export function InstitutionSearchPage(): React.ReactElement {
  const { data, loading } = useQuery<InstitutionStubSearchResult, { offset: number }>(
    INSTITUTION_SEARCH_QUERY,
    { variables: { offset: 0 } }
  );

  return (
    <>
      <section className="g-m-4">
        <h1 className="g-text-2xl g-mb-2 g-font-bold">
          This page is a crude stub for search. For now it serves as a placeholder and easy access
          to individual records
        </h1>
        {!loading && data && (
          <ul className="g-text-blue-400">
            {data.list.results.map((item) => (
              <li key={item.key}>
                <DynamicLink
                  to={`/institution/${item.key}`}
                  pageId="institutionKey"
                  variables={{ key: item.key }}
                >
                  {item.title}
                </DynamicLink>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
