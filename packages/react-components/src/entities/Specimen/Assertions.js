import { jsx, css } from '@emotion/react';
import React from 'react';
import { DataTable as Table, Th, Td, TBody, HyperText } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';

export function Assertions({
  specimen,
  ...props
}) {
  if (!specimen || specimen.assertions.length === 0) return null;
  // return <Card padded={false} css={css`margin-bottom: 24px;`} {...props}>
  //   <div css={css`padding: 12px 24px;`}>
  //     <CardHeader2 style={{color: '#ddd', fontSize: 18, margin: 0}}>No assertions</CardHeader2>
  //   </div>
  // </Card>
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Assertions</CardHeader2>
    </div>
    <AssertionTable assertions={specimen.assertions} />
  </Card>
};

export function AssertionTable({
  assertions,
  ...props
}) {
  if (!assertions || assertions.length === 0) return null;
  const hasProtocol = assertions.some(x => x.assertionProtocol);
  // const hasUnits = assertions.some(x => x.assertionUnit);
  const hasRemarks = assertions.some(x => x.assertionRemarks);
  const hasAgent = assertions.some(x => x.assertionByAgentName);
  const hasDate = assertions.some(x => x.assertionMadeDate);

  return <div>
    <Table css={css`
        .gb-dataTable-wrapper {
          max-height: 500px;
        }
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
          {/* {hasUnits && <Th>Units</Th>} */}
          {hasProtocol && <Th>Protocol</Th>}
          {hasRemarks && <Th>Remarks</Th>}
          {hasAgent && <Th>Agent</Th>}
          {hasDate && <Th>Date</Th>}
        </tr>
      </thead>
      <TBody>
        {assertions.map(x => {
          return <tr key={x.assertionId}>
            <Td>{x.assertionType}</Td>
            <Td>{x.assertionValueNumeric ?? x.assertionValue} {x.assertionUnit ?? ''}</Td>
            {/* {hasUnits && <Td>{x.assertionUnit}</Td>} */}
            {hasProtocol && <Td>{x.assertionProtocol}</Td>}
            {hasRemarks && <Td><HyperText text={x.assertionRemarks} inline /></Td>}
            {hasAgent && <Td>{x.assertionByAgentName}</Td>}
            {hasDate && <Td>{x.assertionMadeDate}</Td>}
          </tr>
        })}
      </TBody>
    </Table>
  </div>
};