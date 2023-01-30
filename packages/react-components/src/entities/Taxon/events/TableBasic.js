import React, { useState } from 'react';
import { DataTable, Th, Td, TBody } from '../../../components/DataTable';
import { Button } from '../../../components';

const Demo = () => {
  const getRows = () => {
    const rows = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    ].map((row) => {
      const cells = [
        'year',
        'basisOfRecord',
        'datasetTitle',
        'publisherTitle',
        'countryCode',
        'gbifTaxonRank',
      ].map((field, i) => {
        if (i === 0) {
          return (
            <Td key={field}>
              <Button appearance='text' onClick={() => console.log(row)}>
                {field}_{row}
              </Button>
            </Td>
          );
        } else {
          return (
            <Td key={field}>
              {field}_{row}
            </Td>
          );
        }
      });
      return (
        <tr key={row} onClick={() => console.log(row)}>
          {cells}
        </tr>
      );
    });
    return rows;
  };

  const headers = [
    <Th key='year'>year</Th>,
    <Th key='basisOfRecord' width='wide'>
      basisOfRecord
    </Th>,
    <Th key='datasetTitle' width='wide'>
      datasetTitle
    </Th>,
    <Th key='publisherTitle' width='wide'>
      publisherTitle
    </Th>,
    <Th key='countryCode'>countryCode</Th>,
    <Th key='gbifTaxonRank'>rank</Th>,
  ];

  const first = () => {};
  const prev = () => {};
  const next = () => {};
  const size = 10;
  const from = 20;
  const total = 1000;
  return (
    <DataTable
      fixedColumn={true}
      {...{ first, prev, next, size, from, total }}
      style={{ height: 400 }}
    >
      <thead>
        <tr>{headers}</tr>
      </thead>
      <TBody columnCount={6} loading>
        {getRows()}
      </TBody>
    </DataTable>
  );
};

export default Demo;
