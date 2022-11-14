
import { jsx, css } from '@emotion/react';
import React from 'react';
import useBelow from '../../../utils/useBelow';

export function DataTable({
  id,
  data,
  error,
  loading,
  ...props
}) {
  const hideSideBar = useBelow(1000);

  return <div>
    <table>
      <thead>
        <tr>
          <th>Agent</th>
          <th>Role</th>
          <th>When</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John R. Demboski</td>
          <td>Collected</td>
          <td>2007 June 12</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
};
