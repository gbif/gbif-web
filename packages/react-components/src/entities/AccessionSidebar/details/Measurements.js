import React, { useState } from 'react';
import { DataTable, Properties, Row, TBody, Td, Th } from '../../../components';
import { Group } from './Groups';

const { Term: T, Value: V } = Properties;

export function Measurements({ event }) {
  const [fixedColumn, setFixed] = useState(true);
  console.log(event);
  if ((event?.measurementOrFacts || []).length === 0) return null;

  const hasField = (prop) => {
    return (
      event.measurementOrFacts.filter((mof) =>
        Boolean(mof[`measurement${prop}`])
      ).length > 0
    );
  };

  const extraFields = ['Method', 'Remarks', 'DeterminedDate'].filter((field) =>
    hasField(field)
  );
  const getRows = () => {
    const rows = event.measurementOrFacts.map((row) => {
      return (
        <tr key={row}>
          <Td key={`measurementType`}>{row.measurementType}</Td>
          <Td key={`measurementValue`}>
            {row.measurementValue}
            {row.measurementUnit}
          </Td>
          {extraFields.map((field) => (
            <Td key={`measurement${field}`}>{row[`measurement${field}`]}</Td>
          ))}
        </tr>
      );
    });
    return rows;
  };

  const headers = [
    <Th key='measurementType'>Measurement</Th>,
    <Th key='measurementValue'>value</Th>,
    ...extraFields.map((field) => <Th key={`measurement${field}`}>{field}</Th>),
  ];

  const first = () => {};
  const prev = () => {};
  const next = () => {};
  const size = 10;
  const from = 0;
  const total = event.measurementOrFacts.length;
  return (
    <>
      <Group label='eventDetails.groups.measurementsOrFacts'>
        <DataTable
          fixedColumn={fixedColumn}
          {...{ first, prev, next, size, from, total }}
          style={{ height: 300 }}
        >
          <thead>
            <tr>{headers}</tr>
          </thead>
          <TBody columnCount={2 + extraFields.length}>{getRows()}</TBody>
        </DataTable>
      </Group>
    </>
  );
}
