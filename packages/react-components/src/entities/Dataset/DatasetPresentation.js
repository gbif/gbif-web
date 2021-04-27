
import { jsx } from '@emotion/react';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Eyebrow } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { iconFeature } from '../../components/IconFeatures/styles';
import { Description as About } from './about/Description';
import { Activity } from './activity/Activity';
import { DownloadOptions } from './DownloadOptions';
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
import { join } from '../../utils/util';
import get from 'lodash/get';

import * as css from './styles';
import { MdLocationOn, MdPeople, MdLink, MdStar, MdFormatQuote } from 'react-icons/md';

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

  if (loading) return <div>loading</div>
  const { dataset, literatureSearch, occurrenceSearch } = data;

  if (error || !dataset) {
    // TODO a generic component for failures is needed
    return <div>Failed to retrieve item</div>
  }

  const highlightedAuthors = get(dataset, 'contributors', []).filter(c => c._highlighted);

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
        <Eyebrow prefix={<FormattedMessage id={`components.dataset.longType.${dataset.type}`} />} suffix={<FormattedMessage id="components.dataset.registeredDate" values={{ DATE: <FormattedDate value={dataset.created} year="numeric" month="long" day="2-digit" /> }} />} />
        <h1>{dataset.title}</h1>
        <div>
          From <a href={`/publisher/${dataset.publishingOrganizationKey}`}>{dataset.publishingOrganizationTitle}</a>
        </div>

        <div css={css.summary}>
          {highlightedAuthors.length > 0 && <div css={iconFeature({ theme })}>
            <MdPeople />
            <div>
              <ol css={css.bulletList}>{highlightedAuthors.map(p => <li key={p.key}>{p.firstName ? p.firstName + ' ' : ''}{p.lastName}</li>)}</ol>
            </div>
          </div>}

          <div css={css.iconFeatures()}>
            {dataset.homepage && <div css={iconFeature({ theme })}>
              <MdLink />
              <span><Hostname href={dataset.homepage} /></span>
            </div>}
            
            {occurrenceSearch.documents.total > 0 && <div css={iconFeature({ theme })}>
              <MdLocationOn />
              <span><FormattedNumber value={occurrenceSearch.documents.total} /> occurrences</span>
            </div>}
            
            {literatureSearch.count > 0 && <div css={iconFeature({ theme })}>
              <MdFormatQuote />
              <span><FormattedNumber value={literatureSearch.count} /> citations</span>
            </div>}
          </div>
          

          
        </div>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label="About" />
          {/* <RouterTab to={join(url, 'metrics')} label="Metrics"/> */}
          <RouterTab to={join(url, 'activity')} label="Activity" />
          <RouterTab to={join(url, 'specimens')} css={css.tab({ theme, noData: occurrenceSearch?.documents?.total === 0 })} label="Occurrences" />
          {/* <RouterTab to={join(url, 'taxonomy')} label="Taxonomy"/> */}
          <RouterTab to={join(url, 'download')} label="Download" />
        </TabList>
      </div>
    </div>


    <section>
      <Switch>
        <Route path={join(path, 'activity')}>
          <div css={css.proseWrapper({ theme })}>
            <Activity {...{ dataset }} />
          </div>
        </Route>
        <Route path={join(path, 'download')}>
          <div css={css.proseWrapper({ theme })}>
            <DownloadOptions {...{ dataset }} />
          </div>
        </Route>
        <Route path={join(path, 'specimens')}>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </Route>
        <Route path={path}>
          <div css={css.proseWrapper({ theme })}>
            <About {...{ data }} />
          </div>
        </Route>
      </Switch>
    </section>
  </>
};

function Hostname({href}) {
  try {
    const hostname = new URL(href).hostname;
    return <a href={href}>{hostname}</a>;
  } catch(err) {
    return <span>invalid</span>;
  }
}