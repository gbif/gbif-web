import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import useBelow from '../../../../utils/useBelow';
import get from 'lodash/get';
// import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { Button, Row, Col, DataTable, Th, Td, TBody, DetailsDrawer } from '../../../../components';
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

export const TablePresentation = ({ first, prev, next, size, from, data, total, loading, columns = [] }) => {
  // const [activeKey, setActiveKey] = useUrlState({ param: 'entity' });
  const [activeKey, setActiveKey] = useQueryParam('entity', NumberParam);
  const noColumnLock = useBelow(1000);
  const { filters, labelMap } = useContext(OccurrenceContext);
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
  const headerss = columns.map((col, index) => {
    const options = index === 0 ? { locked: fixed, toggle: noColumnLock ? null: () => setFixed(!fixedColumn) } : null;
    const FilterPopover = col.filterKey ? filters[col.filterKey]?.Popover : null;
    return <Th key={col.trKey} width={col.width} {...options}>
      <Row wrap="nowrap">
        <Col grow={false} style={{whiteSpace: 'nowrap'}}><FormattedMessage id={col.trKey}/></Col>
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
    }}>
      <ViewHeader loading={loading} total={total}/>
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total, loading }} css={css.table()} >
        <thead>
          <tr>{headerss}</tr>
        </thead>
        <TBody rowCount={size} columnCount={7} loading={loading}>
          {getRows({ columns, labelMap, data, setActiveKey, dialog, filters })}
        </TBody>
      </DataTable>
    </div>
  </>
}

const getRows = ({ columns, labelMap, data, setActiveKey, dialog, filters }) => {
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

        let formattedVal = val;
        if (!val && field.value.hideFalsy === true) {
          formattedVal = '';
        } else if (field.value.formatter) {
          formattedVal = field.value.formatter(val, row, {openInSideBar});
        } else if (field.value.labelHandle) {
          const Label = labelMap[field.value.labelHandle];
          formattedVal = <Label id={val} />
        }
        if (!isEmpty(val) &&  hasFilter && field?.cellFilter) {
          let filterValue = [get(row, field.cellFilter, val)];
          if (typeof field.cellFilter === 'function') {
            filterValue = field.cellFilter({row, val})
          }
          formattedVal = <InlineFilterChip filterName={field?.filterKey} values={filterValue}>{formattedVal}</InlineFilterChip>
        }

        return <Td key={field.trKey} noWrap={field.noWrap}>{formattedVal}</Td>;
        // if (i === 0) {
        //   return <Td key={field}>
        //     <TextButton onClick={() => console.log(row)}>{val}</TextButton>
        //   </Td>
        // } else {
        //   return <Td key={field}>{val}</Td>;
        // }
      }
    );
    return <tr key={row.key} onClick={openInSideBar} style={{cursor: 'pointer'}}>{cells}</tr>;
  });
  return rows;
}