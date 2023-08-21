import { jsx, css } from '@emotion/react';
import React from 'react';
import * as charts from '../../../widgets/dashboard';
import useBelow from '../../../utils/useBelow';

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
      <charts.Year predicate={predicate} visibilityThreshold={1} options={['TIME']} interactive={false} />
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

function DashBoardLayout({ children, predicate, queueUpdates = false, ...props }) {
  const isBelow800 = useBelow(800);

  // const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => <DashboardSection>{child}</DashboardSection>);
  const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => React.cloneElement(child, {style: {marginBottom: 12}}));
  if (isBelow800) {
    return <div>{childrenArray}</div>
  }

  return <div css={css`
    display: flex; margin: -7px; flex-wrap: wrap;
    > div {
      flex: 0 1 calc(50% - 12px); margin: 6px;
      overflow: hidden;
    }
  `}>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 === 0)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
    <div>
      {childrenArray
        .filter((x, i) => i % 2 !== 0)
        .map((x, i) => <React.Fragment key={i}>{x}</React.Fragment>)}
    </div>
  </div>

}
