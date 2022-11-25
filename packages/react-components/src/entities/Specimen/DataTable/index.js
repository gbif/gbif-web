
import { jsx, css } from '@emotion/react';
import React from 'react';
import useBelow from '../../../utils/useBelow';
import { DataTable as Table, Th, Td, TBody } from '../../../components';


export function DataTable({
  id,
  data,
  error,
  loading,
  ...props
}) {
  const hideSideBar = useBelow(1000);

  return <div>
    <Table css={css`
      table {
        font-size: 1em;
      }
      th {
        font-size: 85%;
      }
      td, th {
        border-right: none!important;
      }
      thead>tr>th {
        background: #f3f6f8;
      }
    `}>
      <thead>
        <tr>
          <Th>Agent</Th>
          <Th>Role</Th>
          <Th>When</Th>
          <Th>Remarks</Th>
        </tr>
      </thead>
      <TBody>
        <tr>
          <Td>John R. Demboski</Td>
          <Td>Collected</Td>
          <Td>2007 June 12</Td>
          <Td></Td>
        </tr>
        <tr>
          <Td>John R. Demboski</Td>
          <Td>Latest identification</Td>
          <Td>2007 June 12</Td>
          <Td></Td>
        </tr>
        <tr>
          <Td>Roberta Timons</Td>
          <Td>Georeferenced</Td>
          <Td>2007 June 12</Td>
          <Td></Td>
        </tr>
        <tr>
          <Td>John C. Hook</Td>
          <Td>Past identification</Td>
          <Td>2007 June 12</Td>
          <Td></Td>
        </tr>
        <tr>
          <Td>Deborah Jones</Td>
          <Td>Assertion <span style={{color: 'var(--color300)'}}>weight</span></Td>
          <Td>2007 June 12</Td>
          <Td></Td>
        </tr>
      </TBody>
    </Table>
  </div>
};
