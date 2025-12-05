import { jsx, css } from '@emotion/react';
import React, { useCallback, useState } from 'react';
import { Button, Progress, Skeleton, Tooltip } from '../../../components';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { Table } from '../shared';
import { useQuery } from '../../../dataManagement/api';
import { useDeepCompareEffect } from 'react-use';
import { formatAsPercentage } from '../../../utils/util';

export function GroupByTable({
  predicate,
  loading,
  columnTitle,
  columnCount = 'Records',
  results = [],
  onClick,
  interactive = false,
  total = 800,
  ...props
}) {
  const totalPage = results.reduce((a, c) => a + (c.count || 0), 0);
  // maximum count on page
  const maxCount = results.reduce((a, c) => Math.max(a, c.count || 0), 0);

  if (loading) {
    return <div>
      {[1, 2].map(x => <React.Fragment key={x}>
        <Skeleton as="div" width="60%" style={{ marginBottom: 12 }} />
        <Skeleton as="div" style={{ marginBottom: 12 }} />
      </ React.Fragment>)}
    </div>
  }

  return <div style={{ overflow: 'auto' }}>
    <Table>
      {columnTitle && <thead css={css`
      th {
        text-align: start;
        font-size: 0.95em;
        font-weight: 400;
        padding: 8px 0;
      }
    `}>
        <tr>
          <th>{columnTitle}</th>
          <th>{columnCount}</th>
          <th></th>
        </tr>
      </thead>}
      <tbody css={css`
        tr {
          td {
            vertical-align: initial;
          }
          td:last-of-type {
            width: 80px;
          }
        }
        `}>
        {results.map((e, i) => {
          const perentageOfTotal = e.count / total;
          return <tr key={e.key}>
            <td style={interactive ? {cursor: 'pointer'} : {}}>
              {e.filter && <div onClick={() => {
                if (interactive) onClick({ filter: e.filter })
              }
              }>{e.title}</div>}
              {!e.filter && <div>{e.title}</div>}
              <div css={css`color: var(--color400); font-size: 13px; margin-top: 4px;`}>{e.description}</div>
            </td>
            <td css={css`text-align: end;`}><FormattedNumber value={e.count} /></td>
            <td>
              <Tooltip title={`${formatAsPercentage(perentageOfTotal)}% of total`} placement="auto">
                <Progress color="var(--primary)" percent={100 * e.count / maxCount} style={{ height: '1em', marginLeft: 'auto' }} />
              </Tooltip>
            </td>
          </tr>
        })}
      </tbody>
    </Table>
  </div>
};

export function GroupBy({ facetResults, transform, ...props }) {
  const { data, results, loading, error, next, prev, first, isLastPage, isFirstPage, total, distinct } = facetResults;
  const mappedResults = transform ? transform(data) : results;
  return <>
    <div css={css`font-size: 13px; color: #888; margin-bottom: 8px;`}>
      {loading && <Skeleton as="div" width="100px" />}
      {!loading && distinct > 0 && <><FormattedMessage id="counts.nResults" values={{total: distinct}} /></>}
    </div>
    <GroupByTable results={mappedResults} total={total} {...props} loading={loading} />
  </>
}

export function Pagging({ facetResults, ...props }) {
  const { next, prev, isLastPage, isFirstPage } = facetResults;
  if (isFirstPage && isLastPage) return null;
  return <div css={css`margin-left: auto; font-size: 12px;`}>
    {!(isLastPage && isFirstPage) && <Button look="ghost" onClick={prev} css={css`margin-right: 8px; `} disabled={isFirstPage}><FormattedMessage id="pagination.previous" /></Button>}
    {!isLastPage && <Button look="ghost" onClick={next}><FormattedMessage id="pagination.next" /></Button>}
  </div>
}

export function useFacets({ predicate, otherVariables = {}, keys, translationTemplate, query, size = 10 }) {
  const [from = 0, setFrom] = useState(0);
  const intl = useIntl();
  const { data, error, loading, load } = useQuery(query, { lazyLoad: true, queue: 'dashboard' });

  useDeepCompareEffect(() => {
    load({
      keepDataWhileLoading: true,
      variables: {
        predicate,
        ...otherVariables,
        from,
        size,
      },
      queue: { name: 'dashboard' }
    });
  }, [predicate, query, from, size]);

  useDeepCompareEffect(() => {
    setFrom(0);
  }, [predicate]);

  const next = useCallback(() => {
    setFrom(Math.max(0, from + size));
  });

  const prev = useCallback(() => {
    setFrom(Math.max(0, from - size));
  });

  const first = useCallback(() => {
    setFrom(0);
  });

  let buckets = Array.isArray(data?.search?.facet?.results) ? data?.search?.facet?.results : data?.search?.facet?.results?.buckets;

  let results = buckets?.map(x => {
    return {
      ...x,
      key: x?.key,
      title: x?.entity?.title || x?.key,
      count: x?.count ?? x?.doc_count,
      description: x?.entity?.description
    }
  });

  // If an explicit list of keys is provided, then use that order and fill missing results with count=0
  if (keys && Array.isArray(keys)) {
    results = keys.map(key => {
      const result = results ? results.find(x => x.key.toString() === key.toString()) : undefined;
      if (result) {
        return result;
      }
      return {
        key,
        title: key,
        count: 0,
        description: null
      }
    });
  }

  // if a translationTemplate of the form "something.else.{key}" is provided, then use that to translate the title
  if (translationTemplate && results?.length > 0) {
    results = results.map(x => {
      return {
        ...x,
        title: intl.formatMessage({ id: translationTemplate.replace('{key}', x.key) })
      }
    });
  }

  const distinct = data?.search?.cardinality?.total ?? buckets?.length ?? 0;

  const total = data?.search?.documents?.total ?? 0;
  const isNotNull = data?.isNotNull?.documents?.total;
  // what is the sum of values in the current page. Sum the data?.search?.facet?.results
  const pageSum = results?.reduce((acc, x) => acc + x.count, 0) ?? 0;
  // what is the difference between the total and the sum of the current page
  const otherOrEmptyCount = total - pageSum;
  const otherCount = isNotNull ? isNotNull - pageSum : total - pageSum;
  // how many entries have no value
  const emptyCount = isNotNull ? total - isNotNull : undefined;

  return {
    data, results, loading, error,
    next, prev, first,
    isLastPage: distinct <= from + size,
    isFirstPage: from === 0,
    total,
    distinct,
    otherCount,
    emptyCount,
    isNotNull,
    pageSum,
    otherOrEmptyCount
  };
}