import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MdFilterList } from "react-icons/md";
import get from 'lodash/get';
import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../config/OccurrenceContext';
import { Button, Row, Col, DataTable, Th, Td, TBody, DetailsDrawer } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";


export const TablePresentation = ({ first, prev, next, size, from, data, loading }) => {
  const currentFilterContext = useContext(FilterContext);
  const { filters } = useContext(OccurrenceContext);
  const [fixedColumn, setFixed] = useState(true);
  const total = data?.occurrenceSearch?.documents?.total;

  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true });

  const items = data?.occurrenceSearch?.documents?.results || [];

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);

  const fixed = fixedColumn;// && !dialog.visible;
  const headers = [
    <Th key='scientificName' width='wide' locked={fixed} toggle={() => setFixed(!fixedColumn)}>
      <Row>
        <Col grow={false}>scientificName</Col>
        <Col>
          <filters.taxonKey.Popover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
              {get(currentFilterContext.filter, 'must.taxonKey.length', '')}
            </Button>
          </filters.taxonKey.Popover>
        </Col>
      </Row>
    </Th>,
    <Th key='year'>
      <Row wrap="nowrap">
        <Col grow={false}>Year</Col>
        <Col>
          <filters.year.Popover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </filters.year.Popover>
        </Col>
      </Row>
    </Th>,
    <Th key='basisOfRecord' width='wide'>
      <Row>
        <Col grow={false}>Basis of record</Col>
        <Col>
          <filters.basisOfRecord.Popover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </filters.basisOfRecord.Popover>
        </Col>
      </Row>
    </Th>,
    <Th key='datasetTitle' width='wide'>
      <Row>
        <Col grow={false}>Dataset</Col>
        <Col>
          <filters.datasetKey.Popover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </filters.datasetKey.Popover>
        </Col>
      </Row>
    </Th>,
    <Th key='publisherTitle' width='wide'>
      <Row>
        <Col grow={false}>Publisher</Col>
        <Col>
          <filters.publisherKey.Popover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </filters.publisherKey.Popover>
        </Col>
      </Row>
    </Th>,
    <Th key='countryCode'>
      countryCode
    </Th>,
    <Th key='gbifTaxonRank'>
      rank
    </Th>
  ];

  return <>
    <DetailsDrawer dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.gbifId} defaultTab='details' style={{ width: 700, height: '100%' }} />
    </DetailsDrawer>
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <DataTable fixedColumn={fixed} {...{ first, prev, next, size, from, total, loading }} style={{ flex: "1 1 auto", height: 100 }}>
        <thead>
          <tr>{headers}</tr>
        </thead>
        <TBody rowCount={size} columnCount={7} loading={loading}>
          {getRows({ data, setActive, dialog })}
        </TBody>
      </DataTable>
    </div>
  </>
}

const getRows = ({ data, setActive, dialog }) => {
  const results = data?.occurrenceSearch?.documents?.results || [];
  const rows = results.map((row, index) => {
    const cells = ['gbifClassification.acceptedUsage.formattedName', 'year', 'basisOfRecord', 'datasetTitle', 'publisherTitle', 'countryCode', 'gbifClassification.acceptedUsage.rank'].map(
      (field, i) => {
        // const FormatedName = formatters(field).component;
        // const Presentation = <FormatedName id={row._source[field]} />;
        // if (i === 0) return <Td key={field}><Action onSelect={() => console.log(row._id)}>{Presentation}</Action></Td>;
        // else return <Td key={field}>{Presentation}</Td>;
        const val = get(row, field);

        if (field === 'gbifClassification.acceptedUsage.formattedName') {
          return <Td key={field}>
            <span dangerouslySetInnerHTML={{ __html: val }}></span>
          </Td>;
        }
        return <Td key={field}>{val}</Td>;
        // if (i === 0) {
        //   return <Td key={field}>
        //     <TextButton onClick={() => console.log(row)}>{val}</TextButton>
        //   </Td>
        // } else {
        //   return <Td key={field}>{val}</Td>;
        // }
      }
    );
    return <tr key={row.gbifId} onClick={() => { setActive(index); dialog.show(); }}>{cells}</tr>;
  });
  return rows;
}