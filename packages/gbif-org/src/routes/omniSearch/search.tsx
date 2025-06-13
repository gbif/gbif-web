import { NoRecords } from '@/components/noDataMessages';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { OmniSearchQuery, OmniSearchQueryVariables, PredicateType } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { useI18n } from '@/reactRouterPlugins';
import { fetchWithCancel } from '@/utils/fetchWithCancel';
import { ParamQuery } from '@/utils/querystring';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdPerson } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { DatasetResult } from '../dataset/datasetResult';
import { PublisherResult } from '../publisher/publisherResult';
import { ResourceSearchResult } from '../resource/search/resourceSearchResult';
import { TaxonResult } from '../taxon/taxonResult';
import { CategoryLinks } from './CategoryLinks';
import { CountryResult } from './CountryResult';
import OccurrenceResultCard from './OccurrenceResultCard';
import { OtherParticipantResult } from './OtherParticipantResult';
import { SearchInput } from './SearchInput';
import OMNI_SEARCH from './query';

export interface CategoryCount {
  type: string;
  count: number;
  label: string;
  icon: string;
}

type ServerResults = {
  country?: {
    countryCode: string;
    participant: {
      id: string;
      participationStatus: string;
      participantUrl: string;
      type: string;
      countryCode: string;
      name: string;
      membershipStart: string;
    };
  };
  occurrences?: {
    catalogNumber?: string;
    recordedBy?: string;
    recordNumber?: string;
  };
  taxa?: Array<{ key: number; taxon: any }>;
  participant?: {
    highlighted?: any;
    other?: Array<any>;
  };
};

export function SearchPage() {
  const { locale } = useI18n();
  const { formatMessage } = useIntl();
  const {
    data,
    load,
    loading: dataLoading,
    error,
  } = useQuery<OmniSearchQuery, OmniSearchQueryVariables>(OMNI_SEARCH, { lazyLoad: true });
  const [searchQuery] = useStringParam({
    key: 'q',
    defaultValue: '',
    hideDefault: true,
  });
  const isSmallDevice = useBelow(1000);
  const [serverResults, setServerResults] = useState<ServerResults>({});
  const [counts, setCounts] = useState({
    speciesSearch: 0,
    datasetSearch: 0,
    publisherSearch: 0,
    resourceSearch: 0,
  });
  const [occurrenceCategory, setOccurrenceCategory] = useState<{
    label: JSX.Element;
    searchParams: ParamQuery;
  }>({ label: <FormattedMessage id="search.crossContentSearch.seeAll" />, searchParams: {} });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelFetch;
    setCounts({
      speciesSearch: 0,
      datasetSearch: 0,
      publisherSearch: 0,
      resourceSearch: 0,
    });
    const fetchResults = async () => {
      if (!searchQuery || !searchQuery.trim()) {
        setServerResults({});
        setCounts({
          speciesSearch: 0,
          datasetSearch: 0,
          publisherSearch: 0,
          resourceSearch: 0,
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
            datasetKey: [import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY],
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
                  'article',
                  'composition',
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
                  'article',
                  'composition',
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
        const { promise, cancel } = fetchWithCancel(
          `${import.meta.env.PUBLIC_WEB_UTILS}/cross-content-search?languageCode=${
            locale.iso3LetterCode
          }&q=${encodeURIComponent(searchQuery)}`
        );
        cancelFetch = cancel;
        const serverResults = await promise.then((r) => r.json());
        setServerResults(serverResults);
        if (serverResults?.country) {
          setOccurrenceCategory({
            label: (
              <FormattedMessage id={`enums.countryCode.${serverResults.country.countryCode}`} />
            ),
            searchParams: {
              country: serverResults.country.countryCode,
            },
          });
        } else if (serverResults.taxa?.[0]?.taxon?.key) {
          setOccurrenceCategory({
            label: serverResults.taxa?.[0]?.taxon?.scientificName,
            searchParams: {
              taxonKey: serverResults.taxa?.[0]?.taxon?.key,
            },
          });
        } else {
          setOccurrenceCategory({
            label: <FormattedMessage id="search.crossContentSearch.seeAll" />,
            searchParams: {},
          });
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    const debounceTimer = setTimeout(fetchResults, 200);
    return () => {
      clearTimeout(debounceTimer);
      if (cancelFetch) {
        cancelFetch();
      }
    };
  }, [searchQuery, load]);

  useEffect(() => {
    // set counts
    if (data) {
      setCounts({
        speciesSearch: data.taxonSearch.count,
        datasetSearch: data.datasetSearch.count,
        publisherSearch: data?.organizationSearch?.count || 0,
        resourceSearch: data.resourceSearch?.documents.total || 0,
      });
    }
  }, [data, setCounts]);

  const noResults =
    !serverResults?.country &&
    !serverResults?.participant?.highlighted &&
    !serverResults?.occurrences?.recordedBy &&
    !serverResults?.occurrences?.catalogNumber &&
    !serverResults?.occurrences?.recordNumber &&
    !serverResults?.taxa?.length &&
    data?.resourceKeywordSearch?.documents.results.length === 0 &&
    data?.resourceSearch?.documents.results.length === 0 &&
    data?.datasetSearch.results.length === 0 &&
    data?.organizationSearch?.results.length === 0 &&
    data?.taxonSearch?.results.length === 0 &&
    !loading &&
    !dataLoading &&
    searchQuery;

  const isloading = loading || dataLoading;

  const title = formatMessage({ id: 'search.crossContentSearch.title' });
  const description = formatMessage({ id: 'search.crossContentSearch.description' });
  const placeholder = formatMessage({ id: 'search.crossContentSearch.placeholder' });

  const noSearchQuery = !searchQuery || searchQuery === '';

  // remove duplicate results. server results should stay and duplicates in graphql results should be removed
  const remainingTaxaResults =
    data?.taxonSearch?.results.filter((result) => {
      const isDuplicate = serverResults?.taxa?.some((taxon) => taxon.taxon.key === result.key);
      return !isDuplicate;
    }) ?? [];

  // if already in resourceKeywordResults, then do not show it in resourceResults
  const remainingResourceResults =
    data?.resourceSearch?.documents.results.filter((result) => {
      const isDuplicate = data?.resourceKeywordSearch?.documents.results.some(
        (resource) => resource?.id === result?.id
      );
      return !isDuplicate;
    }) ?? [];

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex" />
        {/* TODO we need much richer meta data. */}
      </Helmet>
      <div className="g-min-h-screen g-bg-slate-100 g-border-t g-border-gray-200">
        <div className="g-max-w-7xl g-mx-auto g-px-4 g-py-8">
          <h1 className="g-text-3xl g-font-bold g-text-gray-900 g-mb-2">{title}</h1>
          <p className="g-text-gray-600 g-mb-8">{description}</p>

          <div className="g-mb-8">
            <SearchInput placeholder={placeholder} />
          </div>
          {noSearchQuery && (
            <div className="g-flex g-gap-4">
              <div className="g-text-lg g-text-slate-500">
                <FormattedMessage id="search.crossContentSearch.noSearchTermsEntered" />
              </div>
            </div>
          )}
          {!noSearchQuery && (
            <div className="g-flex g-gap-4">
              <div className="g-space-y-4 g-flex-auto g-w-full g-max-w-[800px]">
                {isloading && <CardListSkeleton />}
                {!isloading && (
                  <div className="g-w-full">
                    {noResults && <NoRecords />}

                    {serverResults?.country && (
                      <>
                        <CountryResult country={serverResults.country} />
                      </>
                    )}

                    {serverResults?.participant?.highlighted && (
                      <>
                        <OtherParticipantResult
                          participant={serverResults.participant.highlighted}
                        />
                      </>
                    )}

                    {data?.resourceKeywordSearch?.documents.results.map((resource) => (
                      <ResourceSearchResult
                        key={resource.id}
                        resource={resource}
                        className="g-bg-white"
                      />
                    ))}
                    {serverResults?.taxa &&
                      serverResults?.taxa?.map((taxon) => (
                        <TaxonResult
                          key={taxon.taxon.key}
                          taxon={taxon.taxon}
                          className="g-bg-white"
                        />
                      ))}

                    {data?.datasetSearch.results.slice(0, 1).map((result) => (
                      <DatasetResult key={result.key} dataset={result} hidePublisher={false} />
                    ))}

                    {isSmallDevice && (
                      <CategoryLinks
                        counts={counts}
                        query={searchQuery}
                        occurrenceDescription={occurrenceCategory.label}
                        occurrenceSearchParams={occurrenceCategory.searchParams}
                      />
                    )}

                    {serverResults?.occurrences?.recordedBy && (
                      <OccurrenceResultCard
                        Icon={MdPerson}
                        searchParams={{ recordedBy: serverResults?.occurrences?.recordedBy }}
                        queryString={serverResults?.occurrences?.recordedBy}
                        label="Recorded by"
                      />
                    )}
                    {!serverResults?.occurrences?.recordedBy &&
                      serverResults?.occurrences?.catalogNumber && (
                        <OccurrenceResultCard
                          Icon={MdPerson}
                          searchParams={{ recordedBy: serverResults?.occurrences?.catalogNumber }}
                          queryString={serverResults?.occurrences?.catalogNumber}
                          label="Catalog number"
                        />
                      )}

                    {!serverResults?.occurrences?.recordedBy &&
                      !serverResults?.occurrences?.catalogNumber &&
                      serverResults?.occurrences?.recordNumber && (
                        <OccurrenceResultCard
                          Icon={MdPerson}
                          searchParams={{ recordedBy: serverResults?.occurrences?.recordNumber }}
                          queryString={serverResults?.occurrences?.recordNumber}
                          label="Record number"
                        />
                      )}

                    {data?.datasetSearch.results.slice(1).map((result) => (
                      <DatasetResult key={result.key} dataset={result} hidePublisher={false} />
                    ))}

                    {data?.organizationSearch?.results.map((result) => (
                      <PublisherResult key={result.key} publisher={result} />
                    ))}
                    {remainingTaxaResults.map((result) => (
                      <TaxonResult key={result.key} taxon={result} />
                    ))}
                    {!serverResults?.participant?.highlighted &&
                      serverResults?.participant?.other && (
                        <>
                          <OtherParticipantResult
                            participant={serverResults?.participant?.other[0]}
                          />
                        </>
                      )}
                    {remainingResourceResults.map((resource) => (
                      <ResourceSearchResult
                        key={resource.id}
                        resource={resource}
                        className="g-bg-white"
                      />
                    ))}
                  </div>
                )}
              </div>
              {!isSmallDevice && !isloading && (
                <div className="g-mb-8 g-flex-auto g-min-w-80">
                  {/* <h2 className="g-text-xl g-font-semibold g-text-gray-900 g-mb-4">Browse by Category</h2> */}
                  <CategoryLinks
                    counts={counts}
                    query={searchQuery}
                    occurrenceDescription={occurrenceCategory.label}
                    occurrenceSearchParams={occurrenceCategory.searchParams}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
