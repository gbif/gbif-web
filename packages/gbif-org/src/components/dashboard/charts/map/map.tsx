import React, { useEffect, useState } from 'react';
import { hash } from '@/utils/hash';
import { Skeleton } from '@/components/ui/skeleton';
import { FormattedMessage } from 'react-intl';
import { AdHocMapProps } from '@/routes/occurrence/search/views/map/Map/AdHocMap';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { FormattedNumber, Table } from '../../shared';
import { SimpleTooltip as Tooltip } from '@/components/simpleTooltip';
import { MdLocationPin, MdOutlineDragIndicator as MdDragHandle, MdSwapVert } from 'react-icons/md';
import { useOccurrenceCount } from '@/components/count';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { cn } from '@/utils/shadcn';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import useQuery from '@/hooks/useQuery';

const AdHocMap = React.lazy(() => import('@/routes/occurrence/search/views/map/Map/AdHocMap'));

type ResultItem = {
  key: string;
  title?: string;
  description?: string;
  count: number;
  hidden?: boolean;
  colorIndex?: number;
  customColor?: string;
  filter?: Record<string, unknown[]>;
  occurrences?: {
    _meta: { predicate: object };
    metaPredicate?: string;
  };
};

type FacetFilter = { filter: Record<string, unknown[]> };

type FacetMapProps = {
  contextHash?: string;
  loading?: boolean;
  columnTitle?: string;
  columnCount?: string;
  results?: ResultItem[];
  onClick?: (args: FacetFilter) => void;
  interactive?: boolean;
  total?: number;
  palette: string[];
  distinct?: number;
};

type MapProps = {
  facetResults?: {
    data: unknown;
    results: ResultItem[];
    loading: boolean;
    total: number;
    distinct: number;
  };
  transform?: (data: unknown) => ResultItem[];
  contextHash?: string;
  onClick?: (args: FacetFilter) => void;
  palette: string[];
  interactive?: boolean;
};

type SpeciesCountQueryResult = {
  search?: {
    cardinality?: {
      total?: number;
    };
  };
};

function FacetMap({
  contextHash,
  loading,
  results = [],
  onClick,
  interactive = false,
  palette,
  distinct = 0,
}: FacetMapProps) {
  const [orderedResults, setOrderedResults] = useState<ResultItem[]>(results);

  // Update ordered results when results prop changes
  useEffect(() => {
    // create a sorted list of predicateIds and compare them to the current orderedResults. If there is a change, then update. otherwise ignore
    const sortedNewIds = results.map((r) => r.key).sort();
    const sortedOldIds = orderedResults.map((r) => r.key).sort();
    if (hash(sortedNewIds) === hash(sortedOldIds)) {
      // create a new array with the objects from results, preserving the order in orderedResults as well as the colorIndex from orderedResults
      const newOrderedResults = orderedResults.map((oldR, i) => {
        const newR = results.find((r) => r.key === oldR.key);
        return newR ? { ...oldR, ...newR, colorIndex: oldR.colorIndex ?? i } : oldR;
      });
      setOrderedResults(newOrderedResults);
    } else {
      setOrderedResults(results.reverse().map((r, i) => ({ ...r, colorIndex: i })));
    }
  }, [results, orderedResults]);

  if (loading) {
    return (
      <div>
        {[1, 2].map((x) => (
          <React.Fragment key={x}>
            <Skeleton className="g-h-6" style={{ width: '60%', marginBottom: 12 }} />
            <Skeleton className="g-h-6" style={{ marginBottom: 12 }} />
          </React.Fragment>
        ))}
      </div>
    );
  }

  const reorder = (list: ResultItem[], startIndex: number, endIndex: number): ResultItem[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedResults = reorder(orderedResults, result.source.index, result.destination.index);

    setOrderedResults(reorderedResults);
  };

  // Resolve the color for a layer: an explicitly chosen color takes precedence
  // over the color derived from the palette via the colorIndex.
  const resolveColor = (r: ResultItem): string =>
    r.customColor ?? palette[(r.colorIndex ?? 0) % palette.length];

  const reverseOrder = () => {
    setOrderedResults([...orderedResults].reverse());
  };

  const allHidden = orderedResults.length > 0 && orderedResults.every((r) => r.hidden);

  const toggleAllVisibility = () => {
    const nextHidden = !allHidden;
    setOrderedResults(orderedResults.map((r) => ({ ...r, hidden: nextHidden })));
  };

  const mapProps: AdHocMapProps = {
    overlays: orderedResults
      .map((r) => ({
        id: r.key,
        predicate: r.occurrences?._meta.predicate ?? {},
        predicateHash: r.occurrences?.metaPredicate || '',
        style: {
          mapDensityColors: [resolveColor(r)],
          mapPointOpacities: [1, 1, 0.95, 0.9, 0.85],
          mapPointSizes: [3, 3, 4, 5, 5],
        },
        hidden: r.hidden ?? false,
      }))
      .reverse(),
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
      <div className="g-text-sm g-text-slate-500 g-mt-2 g-flex">
        <div className="g-flex-1">
          {loading && <Skeleton className="g-h-6 g-mb-2" />}
          {!loading && distinct > 0 && (
            <>
              <FormattedMessage id="counts.nResults" values={{ total: distinct }} />
            </>
          )}
        </div>
        {orderedResults.length > 0 && (
          <div className="g-inline-block g-flex-inline g-items-center g-gap-3 g-text-slate-500">
            <Tooltip title={<FormattedMessage id="dashboard.reverseOrder" />} side="top">
              <button
                className="g-w-6 g-h-6 hover:g-bg-slate-200 g-rounded g-flex g-items-center g-justify-center hover:g-text-slate-700"
                onClick={reverseOrder}
              >
                <MdSwapVert />
              </button>
            </Tooltip>
            <Tooltip
              title={
                allHidden ? (
                  <FormattedMessage id="dashboard.showAll" />
                ) : (
                  <FormattedMessage id="dashboard.hideAll" />
                )
              }
              side="top"
            >
              <button
                className="g-w-6 g-h-6 hover:g-bg-slate-200 g-rounded g-flex g-items-center g-justify-center hover:g-text-slate-700"
                onClick={toggleAllVisibility}
              >
                {allHidden ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            </Tooltip>
          </div>
        )}
      </div>
      <div style={{ overflow: 'auto' }}>
        <Table removeBorder={false} className="g-mb-2">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="facet-map-table">
              {(provided) => (
                <>
                  <tbody
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal"
                  >
                    {orderedResults.map((e, i) => {
                      return (
                        <Row
                          key={e.key}
                          row={e}
                          index={i}
                          interactive={interactive}
                          onClick={onClick}
                          color={resolveColor(e)}
                          visiblityHandler={(hidden: boolean) => {
                            const newResults = [...orderedResults];
                            newResults[i] = { ...newResults[i], hidden };
                            setOrderedResults(newResults);
                          }}
                          colorHandler={(customColor: string) => {
                            const newResults = [...orderedResults];
                            newResults[i] = { ...newResults[i], customColor };
                            setOrderedResults(newResults);
                          }}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </tbody>
                </>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>
    </div>
  );
}

function Row({
  row,
  index,
  interactive,
  onClick,
  color,
  visiblityHandler,
  colorHandler,
  showSpeciesCounts,
}: {
  row: ResultItem;
  index: number;
  interactive?: boolean;
  onClick?: (args: FacetFilter) => void;
  color?: string;
  visiblityHandler: (hidden: boolean) => void;
  colorHandler: (color: string) => void;
  showSpeciesCounts: boolean;
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
    <Draggable draggableId={row.key} index={index}>
      {(provided, snapshot) => (
        <React.Fragment>
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={cn('g-border-t g-border-slate-200', {
              'g-opacity-60': count === 0,
              'g-bg-slate-50': snapshot.isDragging,
            })}
            style={{
              ...provided.draggableProps.style,
              userSelect: 'none',
            }}
          >
            <td
              className="!g-me-0 !g-pe-0 g-w-6 g-cursor-grab active:g-cursor-grabbing"
              {...provided.dragHandleProps}
            >
              <MdDragHandle className="g-text-slate-400" />
            </td>
            <td className="!g-me-0 !g-pe-0 g-w-5">
              <div className="g-flex g-items-center g-gap-1">
                <button
                  onClick={() => {
                    visiblityHandler(!row.hidden);
                  }}
                >
                  {!row.hidden && <IoMdEye />}
                  {row.hidden && <IoMdEyeOff />}
                </button>
                <label
                  className={cn(
                    'g-w-4 g-h-4 g-relative g-rounded-full g-inline-block g-cursor-pointer g-overflow-hidden',
                    {
                      'g-animate-pulse': loading || typeof count !== 'number',
                    }
                  )}
                  style={{
                    backgroundColor: count !== 0 ? color : undefined,
                    border: '1px solid #ccc',
                  }}
                  title="Change color"
                >
                  <input
                    type="color"
                    value={color ?? '#000000'}
                    onChange={(e) => colorHandler(e.target.value)}
                    className="g-absolute g-inset-0 g-w-full g-h-full g-p-0 g-border-0 g-opacity-0 g-cursor-pointer"
                    aria-label="Change layer color"
                  />
                </label>
              </div>
            </td>
            <td style={interactive ? { cursor: 'pointer' } : {}}>
              {row.filter && (
                <>
                  <div
                    onClick={() => {
                      if (interactive) onClick?.({ filter: row.filter ?? {} });
                    }}
                  >
                    {row.title}
                  </div>
                  {row.description && (
                    <div className="g-text-slate-400 g-text-sm g-mb-1">{row.description}</div>
                  )}
                </>
              )}
              {!row.filter && <div>{row.title}</div>}
            </td>
            <td className="g-text-end">
              <FormattedNumber value={row.count} />
            </td>
            <td className="g-w-20 g-text-end">
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
            {showSpeciesCounts && (
              <td className="g-text-end">
                <SpeciesCount predicate={row.occurrences?._meta.predicate} />
              </td>
            )}
          </tr>
        </React.Fragment>
      )}
    </Draggable>
  );
}

const query = `
query distinct($q: String, $predicate: Predicate) {
  search: occurrenceSearch(q: $q, predicate: $predicate) {
    cardinality {
      total: speciesKey
    }
  }
}
`;

function SpeciesCount({ predicate }: { predicate?: object }) {
  const { data, load, error, loading } = useQuery<SpeciesCountQueryResult, { predicate?: object }>(
    query,
    {
      lazyLoad: false,
      variables: { predicate },
      queue: {
        name: 'graphql-counts',
      },
    }
  );

  const predicateId = hash(JSON.stringify(predicate));

  useEffect(() => {
    if (predicate) {
      load({
        variables: {
          predicate,
        },
      });
    }
    // We are tracking the params via a calculated ID
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predicateId, load]);

  if (error) return <span className="g-text-red-700 g-text-sm">Error</span>;

  if (loading || !data) {
    return <Skeleton className="g-inline g-w-12">Loading</Skeleton>;
  }
  return <FormattedNumber value={data?.search?.cardinality?.total || 0} />;
}

export function Map({ facetResults, transform, contextHash, ...props }: MapProps) {
  if (!facetResults) {
    return null;
  }
  const { data, results, loading, total, distinct } = facetResults;
  const mappedResults = transform ? transform(data) : results;
  return (
    <>
      <FacetMap
        results={mappedResults}
        total={total}
        {...props}
        loading={loading}
        contextHash={contextHash}
        distinct={distinct}
      />
    </>
  );
}
