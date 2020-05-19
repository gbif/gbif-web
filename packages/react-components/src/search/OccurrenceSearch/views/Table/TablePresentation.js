import React, { useState } from 'react';
import { Button, Row, Col, DataTable, Th, Td, TBody } from '../../../../components';
import { MdFilterList } from "react-icons/md";
import get from 'lodash/get';
import taxonFilter from '../../filters/taxonFilter';
import { VocabularyFilterPopover } from '../../../../widgets/Filter/types/vocabulary/VocabularyFilter';

const getRows = ({ result }) => {
  const hits = result.hits.hits;
  const rows = hits.map(row => {
    const cells = ['gbifClassification.acceptedUsage.name', 'year', 'basisOfRecord', 'datasetTitle', 'publisherTitle', 'countryCode', 'gbifClassification.acceptedUsage.rank'].map(
      (field, i) => {
        // const FormatedName = formatters(field).component;
        // const Presentation = <FormatedName id={row._source[field]} />;
        // if (i === 0) return <Td key={field}><Action onSelect={() => console.log(row._id)}>{Presentation}</Action></Td>;
        // else return <Td key={field}>{Presentation}</Td>;
        const val = get(row._source, field);
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
    return <tr key={row._id}>{cells}</tr>;
  });
  return rows;
}

export const TablePresentation = ({ first, prev, next, size, from, result, loading }) => {
  const [fixedColumn, setFixed] = useState(true);
  const total = result.hits.total;

  const headers = [
    <Th key='scientificName' width='wide' locked={fixedColumn} toggle={() => setFixed(!fixedColumn)}>
      <Row>
        <Col grow={false}>scientificName</Col>
        <Col>
          <taxonFilter.Popover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </taxonFilter.Popover>
        </Col>
      </Row>
    </Th>,
    <Th key='year'>
      year
    </Th>,
    <Th key='basisOfRecord' width='wide'>
      <Row>
        <Col grow={false}>Basis of record</Col>
        <Col>
          <VocabularyFilterPopover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </VocabularyFilterPopover>
        </Col>
      </Row>
    </Th>,
    <Th key='datasetTitle' width='wide'>
      <Row>
        <Col grow={false}>Basis of record</Col>
        <Col>
          <VocabularyFilterPopover modal placement="auto">
            <Button appearance="text" style={{ display: 'flex' }}>
              <MdFilterList />
            </Button>
          </VocabularyFilterPopover>
        </Col>
      </Row>
    </Th>,
    <Th key='publisherTitle' width='wide'>
      publisherTitle
    </Th>,
    <Th key='countryCode'>
      countryCode
    </Th>,
    <Th key='gbifTaxonRank'>
      rank
    </Th>
  ];

  return <div style={{
    flex: "1 1 100%",
    display: "flex",
    height: "100%",
    maxHeight: "100vh",
    flexDirection: "column",
  }}>
    <DataTable fixedColumn={fixedColumn} {...{ first, prev, next, size, from, total }} style={{flex: "1 1 auto", height: 100}}>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <TBody rowCount={size} columnCount={7} loading={loading}>
        {getRows({ result })}
      </TBody>
    </DataTable>
  </div>
  // return <div>
    // <DataTable fixedColumn={fixedColumn} {...{ first, prev, next, size, from, total }}>
    //   <thead>
    //     <tr>{headers}</tr>
    //   </thead>
    //   <TBody columnCount={7} loading={loading}>
    //     {getRows({ result })}
    //   </TBody>
    // </DataTable>
  // </div>
}
