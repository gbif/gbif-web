
import { jsx } from '@emotion/react';
import React from 'react';
import * as charts from '../../../widgets/dashboard';
import DashBoardLayout from '../../../widgets/dashboard/DashboardLayout';

export function Metrics({
  publisher,
  className,
  ...props
}) {
  const predicate = {
    type: "equals",
    key: "publishingOrg",
    value: publisher.key
  };

  return <div>
    <div style={{ overflow: 'hidden' }}>
      <DashBoardLayout>
        <charts.OccurrenceSummary predicate={predicate} />
        <charts.DataQuality predicate={predicate} />
        <charts.EventDate predicate={predicate} visibilityThreshold={1} options={['TIME']} interactive={false} />
        <charts.Taxa predicate={predicate} interactive={false}/>
        <charts.Iucn predicate={predicate} visibilityThreshold={0}  interactive={false}/>
        <charts.IucnCounts predicate={predicate} visibilityThreshold={1}  interactive={false}/>
        <charts.Country predicate={predicate} visibilityThreshold={0}  options={['TABLE', 'PIE']} interactive={false}/>
        <charts.OccurrenceIssue predicate={predicate} visibilityThreshold={0} interactive={false} />
        <charts.Datasets predicate={predicate} visibilityThreshold={1} interactive={false} />
        <charts.InstitutionCodes predicate={predicate} visibilityThreshold={1} interactive={false} />
        <charts.Institutions predicate={predicate} visibilityThreshold={1} interactive={false} />
        <charts.CollectionCodes predicate={predicate} visibilityThreshold={1} interactive={false} />
        <charts.Collections predicate={predicate} visibilityThreshold={1} interactive={false} />
      </DashBoardLayout>
    </div>
  </div>
};
