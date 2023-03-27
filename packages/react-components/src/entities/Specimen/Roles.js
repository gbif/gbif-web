import { jsx, css } from '@emotion/react';
import React from 'react';
import { DataTable as Table, Th, Td, TBody } from '../../components';
import { Term, Value } from '../../components/Properties/Properties';
import { Card, CardHeader2 } from '../shared';

export function RolesCard({
  roles,
  setSection,
  name = 'roles',
  ...props
}) {
  if (!roles) return null;
  if (roles?.length === 0) {
    setSection(name, false);
    return null;
  }
  setSection(name, true);
  return <Card padded={false} {...props}>
    <div css={css`padding: 12px 24px;`}>
      <CardHeader2>Roles</CardHeader2>
    </div>
    <Roles roles={roles} />
  </Card>
};

export function Roles({
  roles,
  ...props
}) {
  if (!roles || roles.length === 0) return null;
  const items = roles.sort((a, b) => (a.agentRoleOrder ?? 0) - (b.agentRoleOrder ?? 0));
  
  const hasType = items.some(x => x.agentByAgentRoleAgentId?.agentType);
  const hasStart = items.some(x => x.agentRoleBegan);
  const hasEnd = items.some(x => x.agentRoleEnded);

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
          <Th>Role</Th>
          <Th>Name</Th>
          {hasType && <Th>Type</Th>}
          {hasStart && <Th>Start</Th>}
          {hasEnd && <Th>End</Th>}
        </tr>
      </thead>
      <TBody>
        {items.map(x => {
          return <tr key={x.agentRoleAgentId}>
            <Td>{x.agentRoleRole}</Td>
            <Td>{x.agentByAgentRoleAgentId?.preferredAgentName}</Td>
            {hasType && <Td>{x.agentByAgentRoleAgentId?.agentType}</Td>}
            {hasStart && <Td>{x.agentRoleBegan}</Td>}
            {hasEnd && <Td>{x.agentRoleEnded}</Td>}
          </tr>
        })}
      </TBody>
    </Table>
  </div>
};