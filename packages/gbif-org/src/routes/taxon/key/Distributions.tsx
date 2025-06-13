import { Table } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TaxonDistributionsQuery, TaxonDistributionsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

const limit = 10;

interface DistributionsTableProps {
  taxonKey: string | number;
  total: number;
}

export function DistributionsTable({ taxonKey, total }: DistributionsTableProps) {
  const [offset, setOffset] = useState(0);
  const {
    data,
    load: distributionsLoad,
    loading,
  } = useQuery<TaxonDistributionsQuery, TaxonDistributionsQueryVariables>(
    TAXON_DISTRIBUTIONS_QUERY,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );

  useEffect(() => {
    if (taxonKey) {
      distributionsLoad({
        variables: {
          key: taxonKey.toString(),
          limit,
          offset,
        },
      });
    }
  }, [taxonKey, distributionsLoad, offset]);

  if (total > 0 && (loading || !data?.taxon?.distributions?.results)) {
    return (
      <div>
        {Array.from({ length: total }).map((x, i) => (
          <React.Fragment key={i}>
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
      </div>
      <div style={{ overflow: 'auto' }}>
        <Table removeBorder={false}>
          <thead className="[&_th]:g-text-sm [&_th]:g-font-normal [&_th]:g-py-2 [&_th]:g-text-slate-500">
            <tr>
              {[
                'threatStatus',
                'establishmentMeans',
                'status',
                'locality',
                'locationId',
                'country',
              ].map((c) => (
                <th className="g-text-start">
                  <FormattedMessage id={`taxon.distribution.${c}`} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
            {(data?.taxon?.distributions?.results || []).map((e, i) => {
              return (
                <tr key={i}>
                  <td className="g-text-sm g-text-slate-500">
                    {e?.threatStatus ? (
                      <FormattedMessage
                        id={`enums.threatStatus.${e?.threatStatus}`}
                        defaultMessage={e?.threatStatus || ''}
                      />
                    ) : (
                      e?.threatStatus
                    )}
                  </td>
                  <td className="g-text-sm g-text-slate-500">{e?.establishmentMeans}</td>
                  <td className="g-text-sm g-text-slate-500">{e?.status}</td>
                  <td className="g-text-sm g-text-slate-500">{e?.locality}</td>
                  <td className="g-text-sm g-text-slate-500">{e?.locationId}</td>
                  <td className="g-text-sm g-text-slate-500">
                    {e?.country ? (
                      <FormattedMessage
                        id={`enums.countryCode.${e?.country}`}
                        defaultMessage={e?.country || ''}
                      />
                    ) : (
                      ''
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
          isLastPage={!!data?.taxon?.distributions?.endOfRecords}
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

const TAXON_DISTRIBUTIONS_QUERY = /* GraphQL */ `
  query TaxonDistributions($key: ID!, $limit: Int, $offset: Int) {
    taxon(key: $key) {
      distributions(limit: $limit, offset: $offset) {
        endOfRecords
        limit
        offset
        results {
          threatStatus
          establishmentMeans
          status
          locality
          locationId
          country
        }
      }
    }
  }
`;
