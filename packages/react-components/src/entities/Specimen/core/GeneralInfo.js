import { jsx, css } from '@emotion/react';
import React, { useState } from 'react';
import _ from 'lodash';
import useRelatedData from '../useRelatedData';
import { AssertionTable } from '../Assertions';
import { DataTable as Table, Th, Td, TBody } from '../../../components';
import { Roles } from '../Roles';

export function GeneralInfo({ id, type, ...props }) {
  const [occurrenceInfo, error, loading] = useRelatedData({ id, type });

  if (loading || !occurrenceInfo) return null;

  const hasData = occurrenceInfo?.assertions?.length > 0
    || occurrenceInfo?.identifiers?.length > 0
    || occurrenceInfo?.citations?.length > 0
    || occurrenceInfo?.roles?.length > 0;
  return <>
    {hasData && <div css={css`padding: 0 12px 12px 12px; background: var(--paperBackground800); border-top: 1px solid var(--paperBorderColor);`}>
      {occurrenceInfo?.assertions?.length > 0 && <>
        <Header>Occurrence assertions</Header>
        <AssertionTable assertions={occurrenceInfo.assertions} />
      </>}
      {occurrenceInfo?.roles?.length > 0 && <>
        <Header>Roles</Header>
        <Roles roles={occurrenceInfo.roles} />
      </>
      }
    </div>}
  </>
}

function Header({...props}) {
  return <h3 css={css`color: var(--color400); font-weight: normal; font-size: 14px; margin-bottom: 8px;`} {...props}/>
}