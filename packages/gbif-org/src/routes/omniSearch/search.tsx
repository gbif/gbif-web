import { OmniSearchQuery, OmniSearchQueryVariables, PredicateType } from '@/gql/graphql';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { useEffect, useState } from 'react';
import { DatasetResult } from '../dataset/datasetResult';
import { PublisherResult } from '../publisher/publisherResult';
import { ResourceSearchResult } from '../resource/search/resourceSearchResult';
import { TaxonResult } from '../taxon/taxonResult';
import { CategoryLinks } from './CategoryLinks';
import { CountryResult } from './CountryResult';
import { OtherParticipantResult } from './OtherParticipantResult';
import { SearchInput } from './SearchInput';
import OMNI_SEARCH from './query';

export interface CategoryCount {
  type: string;
  count: number;
  label: string;
  icon: string;
}

export function SearchPage() {
  const {
    data,
    load,
    loading: dataLoading,
    error,
  } = useQuery<OmniSearchQuery, OmniSearchQueryVariables>(OMNI_SEARCH, { lazyLoad: true });
  const [searchQuery, setSearchQuery] = useStringParam({
    key: 'q',
    defaultValue: '',
    hideDefault: true,
  });
  const [serverResults, setServerResults] = useState({});
  const [counts, setCounts] = useState({
    species: 0,
    occurrence: 0,
    dataset: 0,
    publisher: 0,
    resource: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery || !searchQuery.trim()) {
        setServerResults({});
        setCounts({
          species: 0,
          occurrence: 0,
          dataset: 0,
          publisher: 0,
          resource: 0,
        });
        return;
      }
      const q = searchQuery.trim().replace(/\s\s/g, ' ');

      load({
        variables: {
          q: q,
          datasetQuery: {
            q: q,
            limit: 3,
            offset: 0,
          },
          taxonQuery: {
            q: q,
            datasetKey: ['d7dddbf4-2cf0-4f39-9b2a-bb099caae36c'],
            limit: 3,
            offset: 0,
          },
          resourcePredicate: {
            type: PredicateType.And,
            predicates: [
              {
                type: PredicateType.In,
                key: 'contentType',
                values: [
                  'news',
                  'dataUse',
                  'event',
                  'project',
                  'programme',
                  'tool',
                  'document',
                  'network',
                ],
              },
              {
                type: PredicateType.Fuzzy,
                key: 'q',
                value: q,
              },
            ],
          },
          resourceKeywordPredicate: {
            type: PredicateType.And,
            predicates: [
              {
                type: PredicateType.In,
                key: 'contentType',
                values: [
                  'news',
                  'dataUse',
                  'event',
                  'project',
                  'programme',
                  'tool',
                  'document',
                  'network',
                ],
              },
              {
                type: PredicateType.Equals,
                key: 'keywords',
                value: q,
              },
            ],
          },
        },
      });

      setLoading(true);
      try {
        const serverResults = await fetch(
          `http://localhost:4002/unstable-api/cross-content-search?q=${encodeURIComponent(
            searchQuery
          )}`
        ).then((r) => r.json());
        setServerResults(serverResults);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, load]);

  useEffect(() => {
    // set counts
    if (data) {
      setCounts({
        species: data.taxonSearch.count,
        occurrence: 0,
        dataset: data.datasetSearch.count,
        publisher: data?.organizationSearch?.count,
        resource: data.resourceSearch?.documents.total || 0,
      });
    }
  }, [data]);

  return (
    <div className="g-min-h-screen g-bg-slate-100 g-border-t g-border-gray-200">
      <div className="g-max-w-7xl g-mx-auto g-px-4 g-py-8">
        <h1 className="g-text-3xl g-font-bold g-text-gray-900 g-mb-2">GBIF Search</h1>
        <p className="g-text-gray-600 g-mb-8">
          Search across species, occurrences, datasets, publishers, and articles
        </p>

        <div className="g-mb-8">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="g-mb-8">
          <h2 className="g-text-xl g-font-semibold g-text-gray-900 g-mb-4">Browse by Category</h2>
          <CategoryLinks counts={counts} query={searchQuery} />
        </div>

        <div className="g-space-y-4">
          <h2 className="g-text-xl g-font-semibold g-text-gray-900 g-mb-4">
            {loading && <span className="g-text-gray-600">Searching...</span>}
          </h2>
          <div className="g-max-w-3xl">
            {serverResults?.country && (
              <>
                <CountryResult country={serverResults.country} />
              </>
            )}

            {serverResults?.participant?.highlighted && (
              <>
                <OtherParticipantResult participant={serverResults.participant.highlighted} />
              </>
            )}

            {data?.resourceKeywordSearch?.documents.results.map((resource) => (
              <ResourceSearchResult key={resource.id} resource={resource} className="g-bg-white" />
            ))}
            {serverResults?.taxa &&
              serverResults?.taxa?.map((taxon) => (
                <TaxonResult key={taxon.key} taxon={taxon.taxon} className="g-bg-white" />
              ))}
            {data?.datasetSearch.results.map((result) => (
              <DatasetResult key={result.key} dataset={result} hidePublisher={false} />
            ))}
            {data?.organizationSearch?.results.map((result) => (
              <PublisherResult key={result.key} publisher={result} />
            ))}
            {data?.taxonSearch?.results.map((result) => (
              <TaxonResult key={result.key} taxon={result} />
            ))}
            {!serverResults?.participant?.highlighted && serverResults?.participant?.other && (
              <>
                <OtherParticipantResult participant={serverResults?.participant?.other[0]} />
              </>
            )}
            {data?.resourceSearch?.documents.results.map((resource) => (
              <ResourceSearchResult key={resource.id} resource={resource} className="g-bg-white" />
            ))}
          </div>

          {/* {results.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))} */}

          {/* {!loading && searchQuery && results.length === 0 && (
            <p className="g-text-gray-600 g-text-center g-py-8">
              No results found for "{searchQuery}"
            </p>
          )} */}
        </div>
      </div>
    </div>
  );
}
