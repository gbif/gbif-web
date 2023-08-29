import { jsx, css } from '@emotion/react';
import React, { useCallback, useContext, useEffect } from 'react';
import { OccurrenceMap } from '../../../components';
import * as charts from '../../../widgets/dashboard';
import useBelow from '../../../utils/useBelow';
import RouteContext from '../../../dataManagement/RouteContext';
import { Card } from '../../shared';
import { MdInfo } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
export function Dashboard({
  data = {},
  loading,
  error,
  collection,
  occurrenceSearch,
  className,
  ...props
}) {
  const routeContext = useContext(RouteContext);
  const predicate = {
    type: "equals",
    key: "collectionKey",
    value: collection.key
  };
  const specimenSearchRoute = routeContext.collectionKeySpecimens.route.replace(':key', collection.key);
  return <div>
    <Card noPadding style={{ padding: 12, marginBottom: 12 }}>
      <FormattedMessage id="dashboard.metricsFromGbifData" />
    </Card>
    <DashBoardLayout>
      <charts.OccurrenceSummary predicate={predicate} />
      <charts.DataQuality predicate={predicate} />
      <charts.Year predicate={predicate} options={['TIME']} interactive={false} />
      <charts.Preparations predicate={predicate} visibilityThreshold={0} detailsRoute={specimenSearchRoute} defaultOption="PIE" />
      <charts.Taxa predicate={predicate} detailsRoute={specimenSearchRoute} />
      <charts.Iucn predicate={predicate} visibilityThreshold={0} detailsRoute={specimenSearchRoute} />
      <charts.IucnCounts predicate={predicate} visibilityThreshold={0} detailsRoute={specimenSearchRoute} />
      <charts.RecordedBy predicate={predicate} visibilityThreshold={0} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.IdentifiedBy predicate={predicate} visibilityThreshold={0} detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.Country predicate={predicate} visibilityThreshold={1} detailsRoute={specimenSearchRoute} options={['PIE', 'TABLE']}/>
      
      
      
      {/* <charts.CollectionCodes predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.InstitutionCodes predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.StateProvince predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      
      <charts.EstablishmentMeans predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="PIE" />
     
      <charts.Months predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="COLUMN" />
      <charts.Datasets predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.Publishers predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.HostingOrganizations predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.Collections predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.Institutions predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />
      <charts.Networks predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} defaultOption="TABLE" />

      <charts.OccurrenceIssue predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} />
      <charts.BasisOfRecord predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} />
      <charts.Licenses predicate={predicate} hideIfNoData detailsRoute={specimenSearchRoute} /> */}
      
      
    </DashBoardLayout>
  </div>
};

function DashBoardLayout({ children, predicate, queueUpdates = false, ...props }) {
  const isBelow800 = useBelow(800);

  // const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => <DashboardSection>{child}</DashboardSection>);
  const childrenArray = (Array.isArray(children) ? children : [children]).map((child, index) => React.cloneElement(child, {style: {marginBottom: 12}}));
  if (isBelow800) {
    return <div css={css`padding-bottom: 200px;`}>{childrenArray}</div>
  }

  return <div css={css`
    display: flex; margin: -7px; padding-bottom: 200px; flex-wrap: wrap;
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
