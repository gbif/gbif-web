import React, { useCallback } from 'react';
import { Button, DataTable, Th, Td, TBody } from '../../../components';

export const CollectorsPresentation = ({ first, prev, next, size, from, items=[], total, loading }) => {
  const more = useCallback(() => {
    console.log('load more');
  }, [items]);

  items = [
    {
      name: 'sdf', 
      collected: 123,
      identified: 3456,
      when: 'sdf - s234'
    },
    {
      name: 'sdf', 
      collected: 123,
      identified: 3456,
      when: 'sdf - s234'
    },
    {
      name: 'sdf', 
      collected: 123,
      identified: 3456,
      when: 'sdf - s234'
    }
  ];

  const columns = ['name', 'collected', 'identified', 'when'];
  const headerss = columns.map((col, index) => {
    return <Th key={col}>{col}</Th>
  });

  return <>
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <DataTable {...{ first, prev, next, size, from, total, loading }}>
        <thead>
          <tr>{headerss}</tr>
        </thead>
        <TBody rowCount={size} columnCount={7} loading={loading}>
          {getRows({ items, columns })}
        </TBody>
      </DataTable>
    </div>
  </>
}

const getRows = ({ items, columns }) => {
  const rows = items.map((row, index) => {
    const cells = columns.map(
      (field, i) => {
        return <Td key={field}>{row[field]}</Td>;
      }
    );
    return <tr key={row.key}>{cells}</tr>;
  });
  return rows;
}