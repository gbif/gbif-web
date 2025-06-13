import { Table } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dataset,
  TaxonVernacularNamesQuery,
  TaxonVernacularNamesQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const DEFAULT_LIMIT = 10;

interface VernacularNameTableProps {
  columnTitle?: string;
  taxonKey: number;
  total: number;
}
interface VernacularName {
  vernacularName: string;
  language: string;
  datasets: Dataset[];
}

export function VernacularNameTable({ taxonKey, total }: VernacularNameTableProps) {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [processedVernaculars, setProcessedVernaculars] = useState<{
    count: number;
    results: VernacularName[];
  }>({ count: 0, results: [] });
  const [offset, setOffset] = useState(0);
  const {
    data: vernacularNames,
    load: vernacularNamesLoad,
    loading,
  } = useQuery<TaxonVernacularNamesQuery, TaxonVernacularNamesQueryVariables>(
    VERNACULAR_NAMES_QUERY,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );

  useEffect(() => {
    if (taxonKey) {
      vernacularNamesLoad({
        variables: {
          key: taxonKey.toString(),
          limit: 200,
          offset: 0,
        },
      });
    }
  }, [taxonKey, vernacularNamesLoad]);

  useEffect(() => {
    if (vernacularNames?.taxon?.vernacularNames?.results) {
      const names = vernacularNames.taxon.vernacularNames;
      const namesWithLanguage: { [key: string]: { [key: string]: VernacularName[] } } = {};
      const namesWithoutLanguage = [];

      for (let i = 0; i < names.results.length; i++) {
        const name = names?.results[i];
        if (!name?.language) {
          namesWithoutLanguage.push(name);
        } else {
          if (!namesWithLanguage[name.language]) {
            namesWithLanguage[name.language] = {};
          }

          if (!namesWithLanguage[name.language][name.vernacularName.toLowerCase()]) {
            namesWithLanguage[name.language][name.vernacularName.toLowerCase()] = [name];
          } else {
            namesWithLanguage[name.language][name.vernacularName.toLowerCase()].push(name);
          }
        }
      }
      const results: { vernacularName: string; language: string; datasets: Dataset[] }[] = [];

      namesWithoutLanguage.forEach((n) => {
        const found = Object.values(namesWithLanguage).find((val) => {
          return Object.entries(val).find(([k, v]) => {
            if (n && n.vernacularName === k) {
              v.push(n);
              return true;
            }
            return false;
          });
        });
        if (!found) {
          results.push({
            vernacularName: n.vernacularName,
            language: '',
            datasets: [n],
          });
        }
      });

      Object.entries(namesWithLanguage).forEach(([lang, val]) => {
        Object.entries(val).forEach(([k, v]) => {
          results.push({ vernacularName: k, language: lang, datasets: v });
        });
      });
      setProcessedVernaculars({ count: results.length, results: results });
    }
  }, [vernacularNames]);

  if (total > 0 && processedVernaculars.count === 0) {
    return (
      <div>
        {Array.from({ length: total }).map((x, i) => (
          <React.Fragment key={i}>
            <Skeleton className="g-h-6" style={{ width: '60%', marginBottom: 12 }} />
            <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="g-text-sm g-text-slate-500 g-mb-1">
        {loading && <Skeleton className="g-h-6 g-mb-2" style={{ width: '100px' }} />}
        {!loading && (
          <>
            <FormattedMessage id="counts.nResults" values={{ total: processedVernaculars.count }} />
            {processedVernaculars.count > limit && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(processedVernaculars.count);
                  setOffset(0);
                }}
              >
                <FormattedMessage id="taxon.showAll" />
              </Button>
            )}
            {limit > DEFAULT_LIMIT && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(DEFAULT_LIMIT);
                  setOffset(0);
                }}
              >
                <FormattedMessage id="taxon.showLess" />
              </Button>
            )}
          </>
        )}
      </div>
      <div style={{ overflow: 'auto' }}>
        <Table removeBorder={false}>
          <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
            {processedVernaculars.results.slice(offset, offset + limit).map((e, i) => {
              return (
                <tr key={i}>
                  <td>
                    <div>
                      {e.vernacularName}{' '}
                      {e.language && (
                        <span className="g-text-sm g-text-slate-500">
                          {' '}
                          <FormattedMessage
                            id={`enums.language.${e.language}`}
                            defaultMessage={e.language}
                          />
                        </span>
                      )}
                    </div>
                    {e?.datasets?.[0]?.source && (
                      <div className="g-text-sm g-text-slate-500">
                        <FormattedMessage id={`taxon.source`} defaultMessage={'Source'} />:{' '}
                        <DynamicLink
                          pageId="datasetKey"
                          variables={{
                            key: e.datasets?.[0].sourceTaxon?.datasetKey,
                            taxonKey: e.datasets?.[0].sourceTaxonKey,
                          }}
                        >
                          {e.datasets?.[0]?.source}
                        </DynamicLink>
                        {e.datasets.length > 1 && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="link" size="sm">
                                <FormattedMessage
                                  id="counts.nMoreDatasets"
                                  values={{ total: e.datasets.length - 1 }}
                                />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <ul className="g-text-sm g-text-slate-500">
                                {e.datasets.slice(1).map((d, i) => (
                                  <li key={i}>
                                    <DynamicLink
                                      pageId="datasetKey"
                                      variables={{
                                        key: d.sourceTaxon?.datasetKey,
                                        taxonKey: d.sourceTaxonKey,
                                      }}
                                    >
                                      {d.source}
                                    </DynamicLink>
                                  </li>
                                ))}
                              </ul>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Paging
          next={() => setOffset(offset + limit)}
          prev={() => setOffset(offset - limit)}
          isFirstPage={offset === 0}
          isLastPage={offset + limit >= processedVernaculars.count}
        />
      </div>
    </>
  );
}

interface PagingProps {
  next: () => void;
  prev: () => void;
  isLastPage: boolean;
  isFirstPage: boolean;
}

export function Paging({ next, prev, isLastPage, isFirstPage }: PagingProps) {
  if (isFirstPage && isLastPage) return null;
  return (
    <div className="g-mb-2">
      {!(isLastPage && isFirstPage) && (
        <Button
          size="sm"
          variant="secondary"
          onClick={prev}
          className="g-me-2"
          disabled={isFirstPage}
        >
          <FormattedMessage id="pagination.previous" />
        </Button>
      )}
      {!isLastPage && (
        <Button size="sm" variant="secondary" onClick={next}>
          <FormattedMessage id="pagination.next" />
        </Button>
      )}
    </div>
  );
}

const VERNACULAR_NAMES_QUERY = /* GraphQL */ `
  query TaxonVernacularNames($key: ID!, $limit: Int, $offset: Int) {
    taxon(key: $key) {
      vernacularNames(limit: $limit, offset: $offset) {
        endOfRecords
        results {
          vernacularName
          language
          sourceTaxonKey
          sourceTaxon {
            datasetKey
          }
          source
        }
      }
    }
  }
`;
