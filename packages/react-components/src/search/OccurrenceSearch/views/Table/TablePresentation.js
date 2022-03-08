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

export const TablePresentation = ({ first, prev, next, size, from, data, total, loading, columns = [] }) => {
  // const [activeKey, setActiveKey] = useUrlState({ param: 'entity' });
  const [activeKey, setActiveKey] = useQueryParam('entity', NumberParam);
  
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

  const fixed = fixedColumn;// && !dialog.visible;
  const headerss = columns.map((col, index) => {
    const options = index === 0 ? { locked: fixed, toggle: () => setFixed(!fixedColumn) } : null;
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

  // const headers = [
  //   <Th key='scientificName' width='wide' locked={fixed} toggle={() => setFixed(!fixedColumn)}>
  //     <Row>
  //       <Col grow={false}>scientificName</Col>
  //       <Col>
  //         <filters.taxonKey.Popover modal placement="auto">
  //           <Button appearance="text" style={{ display: 'flex' }}>
  //             <MdFilterList />
  //             {get(currentFilterContext.filter, 'must.taxonKey.length', '')}
  //           </Button>
  //         </filters.taxonKey.Popover>
  //       </Col>
  //     </Row>
  //   </Th>,
  //   <Th key='year'>
  //     <Row wrap="nowrap">
  //       <Col grow={false}>Year</Col>
  //       <Col>
  //         <filters.year.Popover modal placement="auto">
  //           <Button appearance="text" style={{ display: 'flex' }}>
  //             <MdFilterList />
  //           </Button>
  //         </filters.year.Popover>
  //       </Col>
  //     </Row>
  //   </Th>,
  //   <Th key='basisOfRecord' width='wide'>
  //     <Row>
  //       <Col grow={false}>Basis of record</Col>
  //       <Col>
  //         <filters.basisOfRecord.Popover modal placement="auto">
  //           <Button appearance="text" style={{ display: 'flex' }}>
  //             <MdFilterList />
  //           </Button>
  //         </filters.basisOfRecord.Popover>
  //       </Col>
  //     </Row>
  //   </Th>,
  //   <Th key='datasetTitle' width='wide'>
  //     <Row>
  //       <Col grow={false}>Dataset</Col>
  //       <Col>
  //         <filters.datasetKey.Popover modal placement="auto">
  //           <Button appearance="text" style={{ display: 'flex' }}>
  //             <MdFilterList />
  //           </Button>
  //         </filters.datasetKey.Popover>
  //       </Col>
  //     </Row>
  //   </Th>,
  //   <Th key='publisherTitle' width='wide'>
  //     <Row>
  //       <Col grow={false}>Publisher</Col>
  //       <Col>
  //         <filters.publisherKey.Popover modal placement="auto">
  //           <Button appearance="text" style={{ display: 'flex' }}>
  //             <MdFilterList />
  //           </Button>
  //         </filters.publisherKey.Popover>
  //       </Col>
  //     </Row>
  //   </Th>,
  //   <Th key='countryCode'>
  //     countryCode
  //   </Th>,
  //   <Th key='gbifTaxonRank'>
  //     rank
  //   </Th>
  // ];

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
          {getRows({ columns, labelMap, data, setActiveKey, dialog })}
        </TBody>
      </DataTable>
    </div>
  </>
}

const getRows = ({ columns, labelMap, data, setActiveKey, dialog }) => {
  const results = data?.occurrenceSearch?.documents?.results || [];
  const rows = results.map((row, index) => {
    const cells = columns.map(
      (field, i) => {
        // const FormatedName = formatters(field).component;
        // const Presentation = <FormatedName id={row._source[field]} />;
        // if (i === 0) return <Td key={field}><Action onSelect={() => console.log(row._id)}>{Presentation}</Action></Td>;
        // else return <Td key={field}>{Presentation}</Td>;
        const val = get(row, field.value.key);

        let formattedVal = val;
        if (field.value.formatter) {
          formattedVal = field.value.formatter(val, row);
        } else if (field.value.labelHandle) {
          const Label = labelMap[field.value.labelHandle];
          formattedVal = <Label id={val} />
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
    return <tr key={row.key} onClick={() => { setActiveKey(row.key); }}>{cells}</tr>;
  });
  return rows;
}