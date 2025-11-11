import React, { useState, useContext } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import SearchContext from './SearchContext';
import useBelow from '../utils/useBelow';
import { Button, Row, Col, DataTable, Th, Td, TBody } from '../components';
import { ResultsHeader } from './ResultsHeader';
import { FilterContext } from '../widgets/Filter/state';
import { InlineFilterChip } from '../widgets/Filter/utils/FilterChip';

const fallbackTableConfig = {
  columns: [{
    trKey: 'Not specified',
    value: {
      key: 'key',
      labelHandle: 'key'
    }
  }]
};

export const ResultsTable = ({ first, prev, next, size, from, results, total, loading, downloadAsTsvUrl, defaultTableConfig = fallbackTableConfig, hideLock, style }) => {
  const currentFilterContext = useContext(FilterContext);
  const { filters, tableConfig = defaultTableConfig, labelMap } = useContext(SearchContext);
  const [fixedColumn, setFixed] = useState(true && !hideLock);
  const noColumnLock = useBelow(1000);

  const fixed = fixedColumn && !noColumnLock;
  const headers = tableConfig.columns.map((col, index) => {
    // const options = index === 0 && !hideLock ? {
    //   locked: fixed, 
    //   toggle: noColumnLock ? null : () => setFixed(!fixedColumn)
    // } : null;
    const FilterPopover = col.filterKey ? filters[col.filterKey]?.Popover : null;
    return <Th key={col.trKey} width={col.width} >
      <Row wrap="nowrap">
        <Col grow={false} style={{ whiteSpace: 'nowrap' }}><FormattedMessage id={col.trKey} /></Col>
        {FilterPopover && <Col>
          <FilterPopover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </FilterPopover>
        </Col>}
      </Row>
    </Th>
  });

  return <>
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
      ...style
    }}>
      <ResultsHeader loading={loading} total={total}>
        {downloadAsTsvUrl && <a href={downloadAsTsvUrl} style={{marginInlineStart: 8, color: 'inherit'}}><FormattedMessage id="phrases.downloadAsTsv" defaultMessage="Download as TSV" /></a>}
      </ResultsHeader>
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total, loading }} style={{ flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column' }}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <TBody rowCount={size} columnCount={7} loading={loading}>
          {getRows({ tableConfig, labelMap, currentFilterContext, results, filters })}
        </TBody>
      </DataTable>
    </div>
  </>
}

function isEmpty(e) {
  return e === null || typeof e === 'undefined' || (Array.isArray(e) && e.length === 0);
}

const getRows = ({ tableConfig, labelMap, currentFilterContext, results = [], filters }) => {
  const rows = results.map((row, index) => {
    const cells = tableConfig.columns.map(
      (field, i) => {
        const val = get(row, field.value.key);
        const formattedVal = getFieldValue({val, row, field, filters, labelMap, currentFilterContext});
        return <Td noWrap={field.noWrap} key={field.trKey} style={field.value.rightAlign ? { textAlign: 'right' } : {}}>{formattedVal}</Td>;
      }
    );
    return <tr key={row.key || row.id || index}>{cells}</tr>;
  });
  return rows;
}

function getFieldValue({ val, row, field, filters, currentFilterContext, labelMap }) {
  const hasFilter = filters[field?.filterKey];
  let formattedVal = val;
  if (Array.isArray(val)) {
    const content = val.map((v, i, list) => <span key={i}>{getFieldValue({val: v, row, field, filters, currentFilterContext, labelMap})}{i < list.length -1 && ', '}</span>);
    return content;
  }

  if (!val && field.value.hideFalsy === true) {
    formattedVal = '';
  } else if (field.value.formatter) {
    formattedVal = field.value.formatter(val, row, { filterContext: currentFilterContext, labelMap });
  } else if (field.value.labelHandle) {
    const Label = labelMap[field.value.labelHandle];
    formattedVal = Label ? <Label id={val} /> : val;
  }
  if (!isEmpty(val) && hasFilter && field?.cellFilter) {
    formattedVal = <InlineFilterChip filterName={field?.filterKey} values={[val]}>{formattedVal}</InlineFilterChip>
  }
  return formattedVal;
}