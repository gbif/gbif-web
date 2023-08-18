import { jsx, css } from '@emotion/react';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Prose, Tabs, Eyebrow, LicenseTag, Doi, Button, ResourceLink, ResourceSearchLink, Row, Col } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import EventSearch from '../../search/EventSearch/EventSearch';
import { iconFeature } from '../../components/IconFeatures/styles';
import { About } from './about/About';
import { Project } from './project/Project';
import { Activity } from './activity/Activity';
import { DownloadOptions } from './DownloadOptions';
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
import { join } from '../../utils/util';
import useBelow from '../../utils/useBelow';

import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit } from '../shared/header';
import { PageError, Page404, PageLoader } from '../shared';

import * as styles from './styles';
import { MdDownload, MdOutlineCode, MdOutlineHelpOutline, MdKeyboardArrowLeft, MdLocationOn, MdPeople, MdLink, MdPlaylistAddCheck, MdStar, MdFormatQuote } from 'react-icons/md';

import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

const { TabList, RouterTab } = Tabs;
const { H1 } = Prose;
export function DatasetPresentation({
  id,
  data,
  insights,
  error,
  loading,
  ...props
}) {
  const isBelowNarrow = useBelow(800);
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const hasTypeSearch = routeContext?.datasetSearch?.disabled !== true;

  if (error) {
    if (error?.errorPaths?.dataset?.status === 404) {
      return <>
        <DataHeader searchType="datasetSearch" messageId="catalogues.datasets" />
        <Page404 />
      </>
    } else {
      return <PageError />
    }
  }

  if (loading || !data) return <PageLoader />

  const { dataset, literatureSearch, occurrenceSearch, siteOccurrences, taxonSearch } = data;

  const rootPredicate = {
    "type": "equals",
    "value": id,
    "key": "datasetKey"
  };

  const config = {
    rootPredicate,
    excludedFilters: ['datasetCode', 'datasetKey', 'institutionKey', 'institutionCode', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode'],
    occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
    highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  };

  const eventConfig = {
    // rootFilter:{datasetKey: [dataset.key]}, 
    rootFilter: { type: 'equals', key: 'datasetKey', value: 'dr18391' },
    excludedFilters: ['datasetKey'],
    // highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus'],
    tabs: ['EVENTS']
  };

  return <>
    {hasTypeSearch && <DataHeader
      right={<div css={styles.headerIcons}>
        {!isBelowNarrow && <Doi id={dataset.doi} />}
        <Button look="text"><MdFormatQuote /></Button>
        <Button look="text"><MdOutlineCode /></Button>
        <Button look="text"><MdOutlineHelpOutline /></Button>
      </div>}
    />}

    <HeaderWrapper>
      <Eyebrow prefix={<FormattedMessage id={`dataset.longType.${dataset.type}`} />} suffix={<FormattedMessage id="dataset.registeredDate" values={{ DATE: <FormattedDate value={dataset.created} year="numeric" month="long" day="2-digit" /> }} />} />
      <Headline css={css`display: inline; margin-right: 12px;`} badge={dataset.deleted ? 'Deleted' : null}>{dataset.title}</Headline>
      <DeletedMessage date={dataset.deleted} />

      {/* It would be great if we could point from a deleted dataset to the version it has been replaced with. But duplicates only exist in the API the opposite direction. So for now I've disabled this */}
      {/* {dataset?.duplicateOfDataset && <ErrorMessage>
        <FormattedMessage id="phrases.replacedBy" values={{ newItem: <ResourceLink type="datasetKey" id={dataset?.duplicateOfDataset?.key}>{dataset?.duplicateOfDataset?.title}</ResourceLink> }} />
      </ErrorMessage>} */}

      {dataset.publishingOrganizationKey && <div style={{ marginTop: 8 }}>
        From <ResourceLink type="publisherKey" id={dataset.publishingOrganizationKey}>{dataset.publishingOrganizationTitle}</ResourceLink>
      </div>}

      <HeaderInfoWrapper>
        <HeaderInfoMain>
          <FeatureList style={{ marginTop: 8 }}>
            {dataset?.contactsCitation?.length > 0 && <GenericFeature>
              <MdPeople />
              {dataset?.contactsCitation.length < 10 && <span>
                {dataset?.contactsCitation.map(c => c.abbreviatedName).join(' • ')}
              </span>
              }
              {dataset?.contactsCitation.length >= 10 && <span>{dataset?.contactsCitation.length} authors</span>}
            </GenericFeature>}
            <Homepage href={dataset.homepage} />
            <LicenseTag value={dataset.license} />

            {/* {contactInfo?.country && <Location countryCode={contactInfo?.country} city={contactInfo.city} />} */}
            {/* <OccurrenceCount messageId="counts.nSpecimens" count={dataset.numberSpecimens} zeroMessage="grscicoll.unknownSize" />
            {hideSideBar && <GbifCount messageId="counts.nSpecimensInGbif" count={occurrenceSearch?.documents?.total} />} */}
          </FeatureList>
          <FeatureList css={css`margin-top: 8px;`}>
            {taxonSearch.count > 0 && <GenericFeature>
              <MdPlaylistAddCheck />
              <span><FormattedNumber value={taxonSearch.count} /> accepted names</span>
            </GenericFeature>}
          </FeatureList>

          {/* {collection.catalogUrl && <FeatureList css={css`margin-top: 8px;`}>
            <GenericFeature>
              <CatalogIcon /><span><a href={collection.catalogUrl}>Data catalog</a></span>
            </GenericFeature>
          </FeatureList>} */}
        </HeaderInfoMain>
      </HeaderInfoWrapper>

      {/* <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label="About" />
        {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/specimens')} tooltip={<FormattedMessage id="grscicoll.specimensViaGbif" defaultMessage="Specimens via GBIF" />} label={<FormattedMessage id="grscicoll.specimens" defaultMessage="Specimens" />} css={occurrenceSearch?.documents?.total === 0 ? css`color: var(--color300);` : null} />}
        {occurrenceSearch?.documents?.total === 0 && collection.catalogUrl && <Tab tabId="0" label="Online catalog"><a css={css`text-decoration: none; color: inherit!important;`} href={collection.catalogUrl}>Explore catalog<MdLink /></a></Tab>}
        {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/dashboard')} label={<FormattedMessage id="grscicoll.dashboard" defaultMessage="Dashboard" />} />}
      </TabList> */}
      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label="About" />
        {dataset.project && <RouterTab to={join(url, 'project')} label="Project" />}
        {/* <RouterTab to={join(url, 'metrics')} label="Metrics"/> */}
        {/* <RouterTab to={join(url, 'activity')} label="Activity" /> */}
        {literatureSearch.documents?.total > 0 && <RouterTab to={join(url, 'citations')} label="Citations" />}
        {/* <RouterTab to={join(url, 'specimens')} css={styles.tab({ theme, noData: occurrenceSearch?.documents?.total === 0 })} label="Occurrences" /> */}
        {/* <RouterTab to={join(url, 'events')} css={styles.tab({ theme, noData: occurrenceSearch?.documents?.total === 0 })} label="Events" /> */}
        {/* <RouterTab to={join(url, 'taxonomy')} label="Taxonomy"/> */}
        <RouterTab to={join(url, 'download')} label="Download" />
      </TabList>
    </HeaderWrapper>

    <section>
      <Switch>
        <Route path={join(path, 'citations')}>
          <div css={styles.proseWrapper({ theme })}>
            <Activity {...{ dataset }} />
          </div>
        </Route>
        <Route path={join(path, 'download')}>
          <div css={styles.proseWrapper({ theme })}>
            <DownloadOptions {...{ dataset }} />
          </div>
        </Route>
        <Route path={join(path, 'specimens')}>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>
        </Route>
        <Route path={join(path, 'events')}>
          <EventSearch config={eventConfig} tabs={['EVENTS']} style={{ margin: '12px auto', maxWidth: 1350, minHeight: 'calc(90vh)' }}></EventSearch>
        </Route>
        <Route path={join(path, 'project')}>
          <div css={styles.proseWrapper({ theme })}>
            <Project {...{ data }} />
          </div>
        </Route>
        <Route path={path}>
          <div css={styles.proseWrapper({ theme })}>
            <About {...{ data }} insights={insights} />
          </div>
        </Route>
      </Switch>
    </section>
  </>
};