import React, { useState, useContext } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import SearchContext from './SearchContext';
import { Button, Row, Col, DataTable, Th, Td, TBody } from '../components';
import { ResultsHeader } from './ResultsHeader';

const fallbackTableConfig = {
  columns: [{
    trKey: 'Not specified',
    value: {
      key: 'key',
      labelHandle: 'key'
    }
  }]
};

export const ResultsTable = ({ first, prev, next, size, from, results, total, loading, defaultTableConfig = fallbackTableConfig, hideLock }) => {
  const { filters, tableConfig = defaultTableConfig, labelMap } = useContext(SearchContext);
  const [fixedColumn, setFixed] = useState(true && !hideLock);

  const fixed = fixedColumn;
  const headerss = tableConfig.columns.map((col, index) => {
    const options = index === 0 && !hideLock ? {
      locked: fixed, 
      toggle: () => setFixed(!fixedColumn)
    } : null;
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

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column",
  }}>
    <ResultsHeader loading={loading} total={total} />
    <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total, loading }} style={{ flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column' }}>
      <thead>
        <tr>{headerss}</tr>
      </thead>
      <TBody rowCount={size} columnCount={7} loading={loading}>
        {getRows({ tableConfig, labelMap, results })}
      </TBody>
    </DataTable>
  </div>
}

const getRows = ({ tableConfig, labelMap, results = [] }) => {
  const rows = results.map((row, index) => {
    const cells = tableConfig.columns.map(
      (field, i) => {
        const val = get(row, field.value.key);
        let formattedVal = val;

        if (!val && field.value.hideFalsy === true) {
          formattedVal = '';
        } else if (field.value.formatter) {
          formattedVal = field.value.formatter(val, row);
        } else if (field.value.labelHandle) {
          const Label = labelMap[field.value.labelHandle];
          formattedVal = Label ? <Label id={val} /> : val;
        }

        return <Td noWrap={field.noWrap} key={field.trKey} style={field.value.rightAlign ? {textAlign: 'right'} : {}}>{formattedVal}</Td>;
      }
    );
    return <tr key={row.key || row.id || index}>{cells}</tr>;
  });
  return rows;
}