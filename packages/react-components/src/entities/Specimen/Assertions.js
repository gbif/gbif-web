import { jsx, css } from '@emotion/react';
import React from 'react';
import { DataTable as Table, Th, Td, TBody } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';

export function Assertions({
  specimen,
  ...props
}) {
  if (!specimen) return null;
  return <Card padded={false} css={css`margin-bottom: 24px;`}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Assertions</CardHeader2>
    </div>
    <div>
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
            <Th>Type</Th>
            <Th>Value</Th>
            <Th>Protocol</Th>
            <Th>Remarks</Th>
            <Th>Agent</Th>
            <Th>Date</Th>
          </tr>
        </thead>
        <TBody>
          {specimen.assertions.map(x => {
            return <tr>
              <Td>{x.assertionType}</Td>
              <Td>{x.assertionValueNumeric ?? assertionValue}</Td>
              <Td>{x.assertionProtocol}</Td>
              <Td>{x.assertionRemarks}</Td>
              <Td>{x.assertionByAgentName}</Td>
              <Td>{x.assertionMadeDate}</Td>
            </tr>
          })}
        </TBody>
      </Table>
    </div>
  </Card>
};

