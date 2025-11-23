import React, { useCallback, useState } from 'react';
// import { Button, Progress, Skeleton, Tooltip } from '../../../components';
import { Skeleton } from '@/components/ui/skeleton';
import { FormattedMessage } from 'react-intl';
import { AdHocMapProps } from '@/routes/occurrence/search/views/map/Map/AdHocMap';
const AdHocMap = React.lazy(() => import('@/routes/occurrence/search/views/map/Map/AdHocMap'));
import { ClientSideOnly } from '@/components/clientSideOnly';
import { FormattedNumber, Table } from '../../shared';
import { SimpleTooltip as Tooltip } from '@/components/simpleTooltip';
import { MdLocationPin, MdPin, MdPinDrop } from 'react-icons/md';
import { OccurrenceIcon } from '@/components/highlights';
import { Count, useOccurrenceCount } from '@/components/count';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { cn } from '@/utils/shadcn';

function FacetMap({
  predicate,
  loading,
  columnTitle,
  columnCount = 'Records',
  results = [],
  onClick,
  interactive = false,
  total = 800,
  palette,
  ...props
}) {
  if (loading) {
    return (
      <div>
        {[1, 2].map((x) => (
          <React.Fragment key={x}>
            <Skeleton className="g-h-6" width="60%" style={{ marginBottom: 12 }} />
            <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  const mapProps: AdHocMapProps = {
    overlays: results.map((r, i) => ({
      id: r.key,
      predicate: r.occurrences?._meta.predicate || predicate,
      predicateHash: r.occurrences?.metaPredicate || '',
      style: {
        mapDensityColors: [palette[i % palette.length]],
        mapPointOpacities: [0.9, 0.9, 0.8, 0.8, 0.7],
        mapPointSizes: [3, 3, 4, 5, 5],
      },
    })),
    loading,
    // features,
    tools: {
      draw: false,
      projection: true,
      layer: true,
      location: false,
      zoom: true,
    },
  };

  return (
    <div style={{ overflow: 'auto' }}>
      <ClientSideOnly>
        <AdHocMap {...mapProps} />
      </ClientSideOnly>
      <div style={{ overflow: 'auto' }}>
        <Table removeBorder={false}>
          {columnTitle && (
            <thead className="[&_th]:g-text-sm [&_th]:g-font-normal [&_th]:g-py-2 [&_th]:g-text-slate-500">
              <tr>
                <th className="g-text-start">{columnTitle}</th>
                <th className="g-text-end">{columnCount}</th>
                <th></th>
              </tr>
            </thead>
          )}
          <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
            {results.map((e, i) => {
              return (
                <Row
                  key={e.key}
                  row={e}
                  total={total}
                  interactive={interactive}
                  onClick={onClick}
                  color={palette[i % palette.length]}
                />
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

function Row({
  row,
  interactive,
  onClick,
  total,
  color,
}: {
  row: any;
  interactive?: boolean;
  onClick?: (filter: any) => void;
  total?: number;
  color?: string;
}) {
  const { count: occurrenceCount } = row;
  const predicate = {
    type: 'and',
    predicates: [
      row.occurrences?._meta.predicate,
      {
        type: 'equals',
        key: 'hasCoordinate',
        value: true,
      },
    ],
  };
  const { count, loading, error } = useOccurrenceCount({ predicate });
  const fraction = occurrenceCount ? count / occurrenceCount : 0;
  const formattedPercentage = formatAsPercentage(fraction);

  return (
    <React.Fragment key={row.key}>
      <tr className={cn('g-border-t g-border-slate-200', { 'g-opacity-60': count === 0 })}>
        <td className="!g-mr-0 !g-pr-0 g-w-5">
          <div
            className="g-w-4 g-h-4 g-relative g-top-0.5 g-rounded-full"
            style={{ backgroundColor: count > 0 ? color : undefined, border: '1px solid #ccc' }}
          ></div>
        </td>
        <td style={interactive ? { cursor: 'pointer' } : {}}>
          {row.filter && (
            <div
              onClick={() => {
                if (interactive) onClick({ filter: row.filter });
              }}
            >
              {row.title}
            </div>
          )}
          {!row.filter && <div>{row.title}</div>}
          {/* {e.description && (
                            <div className="g-text-slate-400 g-text-sm g-mb-1">{e.description}</div>
                          )} */}
        </td>
        <td className="g-text-end">
          <FormattedNumber value={row.count} />
        </td>
        <td className="g-w-20">
          {loading && <Skeleton className="g-h-4 g-w-16 g-inline-block" />}
          {error && <span>-</span>}
          {!loading && count > 0 && (
            <Tooltip title={`${count} with occurrences`} side="left">
              <div>
                <MdLocationPin className="-g-mt-1" />
                {formattedPercentage}%
              </div>
            </Tooltip>
          )}
          {!loading && !error && count === 0 && <span>-</span>}
        </td>
      </tr>
      {row.description && (
        <tr className="!g-border-t-0">
          <td colSpan={3} className="!g-p-0">
            <div className="g-text-slate-400 g-text-sm g-mb-1">{row.description}</div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export function Map({ facetResults, transform, ...props }) {
  const { data, results, loading, total, distinct } = facetResults;
  const mappedResults = transform ? transform(data) : results;
  return (
    <>
      <div className="g-text-sm g-text-slate-500 g-mb-1">
        {loading && <Skeleton className="g-h-6 g-mb-2" width="100px" />}
        {!loading && distinct > 0 && (
          <>
            <FormattedMessage id="counts.nResults" values={{ total: distinct }} />
          </>
        )}
      </div>
      <FacetMap results={mappedResults} total={total} {...props} loading={loading} />
    </>
  );
}
