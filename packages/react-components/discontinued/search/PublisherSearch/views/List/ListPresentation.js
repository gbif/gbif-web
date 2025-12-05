import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
// import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { Button, Row, Col, DataTable, Th, Td, TBody, DetailsDrawer } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';
// import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import { useQueryParam, NumberParam } from 'use-query-params';

import * as css from './styles';

export const ListPresentation = ({ first, prev, next, size, from, data, total, loading }) => {  
  const { labelMap } = useContext(OccurrenceContext);

  return <>
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <ViewHeader loading={loading} total={total}/>
      {getRows({ labelMap, data, setActiveKey, dialog })}
    </div>
  </>
}

const getRows = ({ labelMap, data, setActiveKey, dialog }) => {
  const results = data?.occurrenceSearch?.documents?.results || [];
  const rows = results.map((row, index) => {
    const cards = tableConfig.columns.map(
      (field, i) => {
        <div>test</div>
      }
    );
  });
  return rows;
}