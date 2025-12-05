import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
import { MdFilterList, MdMoreVert } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import useBelow from '../../../../utils/useBelow';
import get from 'lodash/get';
// import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { Button, Row, Col, DataTable, Th, Td, TBody, DetailsDrawer, Tooltip, TextButton, Menu, MenuAction, Switch } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';
// import { useUrlState } from '../../../../dataManagement/state/useUrlState';
import { useQueryParam, NumberParam } from 'use-query-params';
import { InlineFilterChip } from '../../../../widgets/Filter/utils/FilterChip';

import * as css from './styles';

function isEmpty(e) {
  return e === null || typeof e === 'undefined' || (Array.isArray(e) && e.length === 0);
}

export const TablePresentation = ({ first, prev, next, size, from, data, total, loading, dataTableProps, style = {}, className, visibleColumns = [], availableColumns = [], toggleColumn }) => {
  // const [activeKey, setActiveKey] = useUrlState({ param: 'entity' });
  const [activeKey, setActiveKey] = useQueryParam('entity', NumberParam);
  const noColumnLock = useBelow(1000);
  const currentFilterContext = useContext(OccurrenceContext);
  const { filters, labelMap } = currentFilterContext;
  const [fixedColumn, setFixed] = useState(true);
  const dialog = useDialogState({ animated: true, modal: false });

  const items = data?.occurrenceSearch?.documents?.results || [];

  /*
  const {setActiveKey, activeKey} = useDetailDrawerState({name: 'entity', items});
  */
  useEffect(() => {
    if (activeKey) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [activeKey]);

  useUpdateEffect(() => {
    if (!dialog.visible) {
      setActiveKey();
    }
  }, [dialog.visible]);

  const nextItem = useCallback(() => {
    const activeIndex = items.findIndex(x => x.key === activeKey);
    const next = Math.min(items.length - 1, activeIndex + 1);
    if (items[next]) {
      setActiveKey(items[next].key);
    }
  }, [activeKey, items]);

  const previousItem = useCallback(() => {
    const activeIndex = items.findIndex(x => x.key === activeKey);
    const prev = Math.max(0, activeIndex - 1);
    if (items[prev]) {
      setActiveKey(items[prev].key);
    }
  }, [activeKey, items]);

  const fixed = fixedColumn && !noColumnLock;// && !dialog.visible;
  const visibleColumnNames = visibleColumns.map(x => x.name);

  const menuItems = menuState => {
    const items = availableColumns.map((col, index) => {
      const { trKey, name } = col;
      return <MenuAction>
        <label>
          <Switch disabled={index == 0} checked={visibleColumnNames.includes(name)} onChange={e => toggleColumn(name)} /> <FormattedMessage id={trKey} />
        </label>
      </MenuAction>
    });
    items.push(<MenuAction onClick={() => {toggleColumn(); menuState.hide();}}>
      Reset
    </MenuAction>)
    return items;
  }

  const headerss = visibleColumns.map((col, index) => {
    const options = index === 0 ? {
      locked: fixed,
      toggle: noColumnLock ? null : () => setFixed(!fixedColumn),
      prefix: <Menu
        aria-label="Settings"
        trigger={<TextButton as="span" look="textHoverLinkColor" style={{ display: 'inline-flex' }}>
          <MdMoreVert style={{ fontSize: '1.5em', marginRight: '.75em' }} onClick={(e) => {
            // e.stopPropagation();
          }} />
        </TextButton>}
        items={menuItems}
      />
    } : {};
    const FilterPopover = col.filterKey ? filters[col.filterKey]?.Popover : null;
    return <Th key={col.trKey} width={col.width} {...options}>
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
    {dialog.visible && <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeKey}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeKey} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)} />
    </DetailsDrawer>}
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
      ...style
    }} className={className}>
      <ViewHeader loading={loading} total={total} />
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total, loading }} css={css.table()} {...dataTableProps} >
        <thead>
          <tr>{headerss}</tr>
        </thead>
        <TBody rowCount={size} columnCount={7} loading={loading}>
          {getRows({ columns: visibleColumns, labelMap, data, currentFilterContext, setActiveKey, dialog, filters })}
        </TBody>
      </DataTable>
    </div>
  </>
}

const getRows = ({ columns, labelMap, data, currentFilterContext, setActiveKey, dialog, filters }) => {
  const results = data?.occurrenceSearch?.documents?.results || [];
  const rows = results.map((row, index) => {
    const openInSideBar = () => { setActiveKey(row.key); };
    const cells = columns.map(
      (field, i) => {
        const hasFilter = filters[field?.filterKey];
        // const FormatedName = formatters(field).component;
        // const Presentation = <FormatedName id={row._source[field]} />;
        // if (i === 0) return <Td key={field}><Action onSelect={() => console.log(row._id)}>{Presentation}</Action></Td>;
        // else return <Td key={field}>{Presentation}</Td>;
        const val = get(row, field.value.key);
        const formattedVal = getFieldValue({val, row, field, filters, labelMap, currentFilterContext});
        return <Td noWrap={field.noWrap} key={field.trKey} style={field.value.rightAlign ? { textAlign: 'right' } : {}}>{formattedVal}</Td>;
      }
    );
    return <tr key={row.key} onClick={openInSideBar} style={{ cursor: 'pointer' }}>{cells}</tr>;
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
    let filterValue = [val];
    if (typeof field.cellFilter === 'function') {
      filterValue = field.cellFilter({ row, val })
    }
    formattedVal = <InlineFilterChip filterName={field?.filterKey} values={filterValue}>{formattedVal}</InlineFilterChip>
  }
  return formattedVal;
}