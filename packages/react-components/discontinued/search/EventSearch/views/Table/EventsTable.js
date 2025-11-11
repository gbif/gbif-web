import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import SearchContext from '../../../SearchContext';
import { Button, Row, Col, DataTable, Th, Td, TBody, DetailsDrawer } from '../../../../components';
import { ResultsHeader } from '../../../ResultsHeader';
import { useDialogState } from "reakit/Dialog";
import { useUpdateEffect } from "react-use";
import { EventSidebar } from "../../../../entities/EventSidebar/EventSidebar";
import env from '../../../../../.env.json';
import { FilterContext } from "../../../../widgets/Filter/state";
import { useGraphQLContext } from "../../../../dataManagement/api/GraphQLContext";
import {InlineFilterChip} from "../../../../widgets/Filter/utils/FilterChip";

const fallbackTableConfig = {
  columns: [{
    trKey: 'Not specified',
    value: {
      key: 'key',
      labelHandle: 'key'
    }
  }]
};

function isEmpty(e) {
  return e === null || typeof e === 'undefined' || (Array.isArray(e) && e.length === 0);
}

export const EventsTable = ({ query, first, prev, next, size, from, results, total, loading, defaultTableConfig = fallbackTableConfig, hideLock }) => {
  const currentFilterContext = useContext(FilterContext);
  const { filters, tableConfig = defaultTableConfig, labelMap } = useContext(SearchContext);
  const [fixedColumn, setFixed] = useState(true && !hideLock);
  const fixed = fixedColumn;
  const EVENT_SEARCH_URL = env.EVENT_SEARCH_URL;

  // used for the currently selected event
  const [activeEventID, setActiveEventID] = useState(false);
  const [activeDatasetKey, setActiveDatasetKey] = useState(false);

  const dialog = useDialogState({ animated: true, modal: false });

  // current result set
  const items = results || [];

  const {details, setQuery} = useGraphQLContext();
  useEffect(() => {
    setQuery({ query, size, from });
  }, [query, size, from]);

  useEffect(() => {
    if (activeEventID && activeDatasetKey) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [activeEventID, activeDatasetKey]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveEventID(null);
      setActiveDatasetKey(null);
    }
  }, [dialog.visible]);

  function setActiveEvent(eventID, datasetKey) {
    setActiveEventID(eventID);
    setActiveDatasetKey(datasetKey)
  }

  function addToSearch (eventID) {
    currentFilterContext.setField('eventHierarchy', [eventID], true);
    setActiveEventID(null);
    setActiveDatasetKey(null);
  }

  function addEventTypeToSearch (eventID, eventType) {
    currentFilterContext.setField('eventHierarchy', [eventID], true);
    currentFilterContext.setField('eventType', [eventType], true);
    setActiveEventID(null);
    setActiveDatasetKey(null);
  }

  const nextItem = useCallback(() => {
    const activeIndex = items.findIndex(x => x.eventID === activeEventID);
    const next = Math.min(items.length - 1, activeIndex + 1);
    if (items[next]) {
      setActiveEventID(items[next].eventID);
      setActiveDatasetKey(items[next].datasetKey);
    }
  }, [activeEventID, activeDatasetKey, items]);

  const previousItem = useCallback(() => {
    const activeIndex = items.findIndex(x => x.key === activeEventID);
    const prev = Math.max(0, activeIndex - 1);
    if (items[prev]) {
      setActiveEventID(items[prev].eventID);
      setActiveDatasetKey(items[prev].datasetKey);
    }
  }, [activeEventID, activeDatasetKey, items]);

  const headers = tableConfig.columns.map((col, index) => {
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
    {dialog.visible && <DetailsDrawer href={`${EVENT_SEARCH_URL}${activeEventID}`}
      dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <EventSidebar
        eventID={activeEventID}
        datasetKey={activeDatasetKey}
        defaultTab='details'
        style={{ maxWidth: '100%', width: 700, height: '100%' }}
        onCloseRequest={() => dialog.setVisible(false)}
        setActiveEvent={setActiveEvent}
        addToSearch={addToSearch}
        addEventTypeToSearch={addEventTypeToSearch}
      />
    </DetailsDrawer>}
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <ResultsHeader loading={loading} total={total} />
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total, loading }} style={{ flex: "1 1 auto", height: 100, display: 'flex', flexDirection: 'column' }}>
        <thead>
          <tr key={`EventsTableHeaders`}>{headers}</tr>
        </thead>
        <TBody rowCount={size} columnCount={13} loading={loading}>
          {getRows({ tableConfig, labelMap, results, setActiveEventID, setActiveDatasetKey, dialog, currentFilterContext, filters })}
        </TBody>
      </DataTable>
    </div>
  </>
}

const getRows = ({ tableConfig, labelMap, results = [], setActiveEventID, setActiveDatasetKey, dialog, currentFilterContext, filters }) => {
  const rows = results.map((row, index) => {
    const cells = tableConfig.columns.map(
      (field, i) => {
        const hasFilter = filters[field?.filterKey];
        const val = get(row, field.value.key);
        let formattedVal = val;

        if (!val && field.value.hideFalsy === true) {
          formattedVal = '';
        } else if (field.value.formatter) {
          formattedVal = field.value.formatter(val, row, { filterContext: currentFilterContext });
        } else if (field.value.labelHandle) {
          const Label = labelMap[field.value.labelHandle];
          formattedVal = Label ? <Label id={val} /> : val;
        }
        if (!isEmpty(val) &&  hasFilter && field?.cellFilter) {
          let filterValue = [get(row, field.cellFilter, val)];
          if (typeof field.cellFilter === 'function') {
            filterValue = field.cellFilter({row, val})
          }
          formattedVal = <InlineFilterChip filterName={field?.filterKey} values={filterValue}>{formattedVal}</InlineFilterChip>
        }

        return <Td noWrap={field.noWrap} key={field.trKey} style={field.value.rightAlign ? { textAlign: 'right' } : {}}>{formattedVal}</Td>;
      }
    );
    return <tr key={row.eventID} style={{cursor: 'pointer'}} onClick={() => {
      let selection = window.getSelection();
      if (selection.type !== "Range") {
        setActiveEventID(row.eventID);
        setActiveDatasetKey(row.datasetKey);
      }
    }
    }>{cells}</tr>;
  });
  return rows;
}