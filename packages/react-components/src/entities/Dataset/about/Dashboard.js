import React from 'react';
import * as charts from '../../../widgets/dashboard';
import DashBoardLayout from '../../../widgets/dashboard/DashboardLayout';

export function Dashboard({
  data = {},
  loading,
  error,
  dataset,
  className,
  ...props
}) {
  const predicate = {
    type: "equals",
    key: "datasetKey",
    value: dataset.key
  };
  return <div style={{overflow: 'hidden'}}>
    <DashBoardLayout>
      <charts.OccurrenceSummary predicate={predicate} />
      <charts.DataQuality predicate={predicate} />
      <charts.EventDate predicate={predicate} visibilityThreshold={1} options={['TIME']} interactive={false} />
      <charts.Months predicate={predicate} defaultOption="COLUMN" visibilityThreshold={0} interactive={false} />
      <charts.Taxa predicate={predicate} interactive={false}/>
      <charts.Iucn predicate={predicate} visibilityThreshold={0}  interactive={false}/>
      <charts.IucnCounts predicate={predicate} visibilityThreshold={1}  interactive={false}/>
      <charts.RecordedBy predicate={predicate} visibilityThreshold={0}  defaultOption="TABLE" interactive={false}/>
      <charts.Country predicate={predicate} visibilityThreshold={1}  options={['TABLE', 'PIE']} interactive={false}/>
      <charts.OccurrenceIssue predicate={predicate} visibilityThreshold={0} interactive={false} />
    </DashBoardLayout>
  </div>
};
