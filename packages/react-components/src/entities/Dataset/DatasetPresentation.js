
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Eyebrow } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { iconFeature } from '../../components/IconFeatures/styles';
import { Description as About } from './about/Description';
import { Activity } from './activity/Activity';
import { DownloadOptions } from './DownloadOptions';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { join } from '../../utils/util';

import * as css from './styles';
import { MdLocationOn, MdPeople, MdStar } from 'react-icons/md';

import { Switch, Route, useRouteMatch } from 'react-router-dom';

const { TabList, RouterTab } = Tabs;

export function DatasetPresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  // useEffect(() => {
  //   window.location.href = "#content";
  // });

  if (loading) return <div>loading</div>
  const { dataset, occurrenceSearch } = data;
  const recordedByCardinality = occurrenceSearch?.cardinality?.recordedBy;

  if (error || !dataset) {
    // TODO a generic component for failures is needed
    return <div>Failed to retrieve item</div> 
  }

  const rootPredicate = {
    "type": "equals",
    "value": id,
    "key": "datasetKey"
  };
  
  const config = { 
    rootPredicate, 
    blacklistedFilters: ['datasetCode', 'datasetKey', 'institutionKey', 'institutionCode', 'hostKey', 'protocol', 'publishingCountryCode'], 
    occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
    highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  };
  
  return <>
    <div css={css.headerWrapper({ theme })}>
      <div css={css.proseWrapper({ theme })}>
        <Eyebrow prefix="Dataset" suffix={dataset.created} />
        <h1>{dataset.title}</h1>
        <div>
          From <a href={`/publisher/${dataset.publishingOrganizationKey}`}>{dataset.publishingOrganizationTitle}</a>
        </div>

        <div css={css.summary}>
          {occurrenceSearch.documents.total > 0 && <div css={iconFeature({ theme })}>
            <MdLocationOn />
            <span><FormattedNumber value={occurrenceSearch.documents.total} /> digitized specimens</span>
          </div>}
          {dataset.taxonomicCoverage && <div css={iconFeature({ theme })}>
            <MdStar />
            <span>{dataset.taxonomicCoverage}</span>
          </div>}
        </div>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label="About"/>
          {/* <RouterTab to={join(url, 'metrics')} label="Metrics"/> */}
          <RouterTab to={join(url, 'activity')} label="Activity"/>
          <RouterTab to={join(url, 'specimens')} css={css.tab({theme, noData: occurrenceSearch?.documents?.total === 0})} label="Occurrences"/>
          {/* <RouterTab to={join(url, 'taxonomy')} label="Taxonomy"/> */}
          <RouterTab to={join(url, 'download')} label="Download"/>
        </TabList>
      </div>
    </div>


    <section>
      <Switch>
        <Route path={join(path, 'activity')}>
          <div css={css.proseWrapper({ theme })}>
            <Activity {...{dataset}}/>
          </div>
        </Route>
        <Route path={join(path, 'download')}>
          <div css={css.proseWrapper({ theme })}>
            <DownloadOptions {...{dataset}}/>
          </div>
        </Route>
        <Route path={join(path, 'specimens')}>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </Route>
        <Route path={path}>
          <div css={css.proseWrapper({ theme })}>
            <About {...{data}}/>
          </div>
        </Route>
      </Switch>
    </section>
  </>
};
