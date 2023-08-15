import { jsx, css } from '@emotion/react';
import React, { useCallback, useContext, useEffect } from 'react';
import * as charts from '../../../../widgets/dashboard';
import useBelow from '../../../../utils/useBelow';
import RouteContext from '../../../../dataManagement/RouteContext';

export function Dashboard({
  predicate,
  ...props
}) {
  return <div>
    <DashBoardLayout>
      {/* <charts.Taxa predicate={predicate} /> */}
      <charts.Iucn predicate={predicate} />
      <charts.Synonyms predicate={predicate} />
      {/* <charts.IucnCounts predicate={predicate} /> */}
      
      {/* <charts.Country predicate={predicate} defaultOption="TABLE" />
      <charts.CollectionCodes predicate={predicate} defaultOption="TABLE" />
      <charts.InstitutionCodes predicate={predicate} defaultOption="TABLE" />
      <charts.StateProvince predicate={predicate} defaultOption="TABLE" />
      <charts.IdentifiedBy predicate={predicate} defaultOption="TABLE" />
      <charts.RecordedBy predicate={predicate} defaultOption="TABLE" />
      <charts.Preparations predicate={predicate} defaultOption="PIE" />
      <charts.EstablishmentMeans predicate={predicate} defaultOption="PIE" />
      <charts.Months predicate={predicate} defaultOption="COLUMN" /> */}

      {/* <charts.Preparations2 predicate={predicate} defaultOption="TABLE" /> */}

      {/* <Datasets predicate={predicate} defaultOption="TABLE" />
      <Publishers predicate={predicate} defaultOption="TABLE" />
      <HostingOrganizations predicate={predicate} defaultOption="TABLE" />
      <Collections predicate={predicate} defaultOption="TABLE" />
      <Institutions predicate={predicate} defaultOption="TABLE" />
      <Networks predicate={predicate} defaultOption="TABLE" /> */}

      {/* <OccurrenceIssue predicate={predicate} />
      <BasisOfRecord predicate={predicate} />
      <Licenses predicate={predicate} />
      <Months predicate={predicate} defaultOption="COLUMN" currentFilter={{
        must: {
          taxonKey: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        }
      }} />
      <OccurrenceSummary predicate={predicate} />
      <OccurrenceMap rootPredicate={predicate} />
      <DataQuality predicate={predicate} />
      <Preparations predicate={predicate} />
      <Taxa predicate={predicate} />
      <Iucn predicate={predicate} /> */}
    </DashBoardLayout>
  </div>
};

function DashboardSection({ children, ...props }) {
  return <div css={css`margin-bottom: 12px;`} {...props}>{children}</div>
}
function DashBoardLayout({ children, predicate, queueUpdates = false, ...props }) {
  const isBelow800 = useBelow(1000);

  const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => <DashboardSection>{child}</DashboardSection>);
  if (isBelow800) {
    return <div css={css`padding-bottom: 200px;`}>{childrenArray}</div>
  }

  return <div css={css`
    display: flex; margin: -6px; padding-bottom: 200px; flex-wrap: wrap;
    > div {
      flex: 0 1 calc(50% - 12px); margin: 6px;
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
