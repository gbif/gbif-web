import React, { useState, useContext } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import SearchContext from './SearchContext';
import { Button, Row, Col, DataTable, Th, Td, TBody } from '../components';
import { ResultsHeader } from './ResultsHeader';

export const ResultsList = ({ keyFn, cardComponent:Card, first, prev, next, size, from, results, total, loading }) => {
  const { labelMap } = useContext(SearchContext);

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column",
  }}>
    <ResultsHeader loading={loading} total={total} />
    {results && <div>
      {results.map((result, index) => <Card key={keyFn ? keyFn : index} {...{result, index, loading, labelMap}} />)}
    </div>}
    <Button onClick={prev}>prev</Button>
    <Button onClick={next}>next</Button>
  </div>
}
