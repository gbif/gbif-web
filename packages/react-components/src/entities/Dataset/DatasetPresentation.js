import { jsx, css } from '@emotion/react';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Prose, Tabs, Eyebrow, LicenseTag, Doi, Button, ResourceLink, ResourceSearchLink, Row, Col, Tooltip } from '../../components';
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
import env from '../../../.env.json';

import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit } from '../shared/header';
import { PageError, Page404, PageLoader } from '../shared';

import * as styles from './styles';
import { MdDownload, MdOutlineCode, MdOutlineHelpOutline, MdKeyboardArrowLeft, MdLocationOn, MdPeople, MdLink, MdPlaylistAddCheck, MdStar, MdFormatQuote } from 'react-icons/md';

import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

const { TabList, RouterTab, Tab } = Tabs;
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

  const { dataset, literatureSearch, occurrenceSearch, siteOccurrences } = data;

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

  return <div style={{minHeight: '80vh'}}>
    {hasTypeSearch && <DataHeader
      right={<div css={styles.headerIcons}>
        <Doi id={dataset.doi} />

        {/* The idea is that these should provide information on how to cite, how to access by API and a general help about this page */}
        {/* <Button look="text"><MdFormatQuote /></Button>
        <Button look="text"><MdOutlineCode /></Button>
        <Button look="text"><MdOutlineHelpOutline /></Button> */}

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
        <FormattedMessage id="dataset.publishedBy" /> <ResourceLink type="publisherKey" id={dataset.publishingOrganizationKey}>{dataset.publishingOrganizationTitle}</ResourceLink>
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
            <GenericFeature>
              <LicenseTag value={dataset.license} />
            </GenericFeature>

            {/* {contactInfo?.country && <Location countryCode={contactInfo?.country} city={contactInfo.city} />} */}
            {/* <OccurrenceCount messageId="counts.nSpecimens" count={dataset.numberSpecimens} zeroMessage="grscicoll.unknownSize" />
            {hideSideBar && <GbifCount messageId="counts.nSpecimensInGbif" count={occurrenceSearch?.documents?.total} />} */}
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
        <RouterTab to={url} exact label={<FormattedMessage id="phrases.about" />} />
        {dataset.project && <RouterTab to={join(url, 'project')} label={<FormattedMessage id="phrases.project" />} />}
        {/* <RouterTab to={join(url, 'metrics')} label="Metrics"/> */}
        {/* <RouterTab to={join(url, 'activity')} label="Activity" /> */}
        {literatureSearch.documents?.total > 0 && <RouterTab to={join(url, 'citations')} label={<FormattedMessage id="phrases.citations" />} />}
        {dataset?.checklistBankDataset?.key && <Tab tabId="0" label="Checklist Bank"><Tooltip title={<FormattedMessage id="dataset.exploreInChecklistBank" defaultMessage="Explore taxonomy via Checklist Bank" />} placement="bottom"><a css={css`text-decoration: none; color: inherit!important;`} href={`${env.CHECKLIST_BANK_WEBSITE}/dataset/gbif-${dataset.key}/classification`}>Taxonomy<MdLink /></a></Tooltip></Tab>}
        {/* <RouterTab to={join(url, 'specimens')} css={styles.tab({ theme, noData: occurrenceSearch?.documents?.total === 0 })} label="Occurrences" /> */}
        {/* <RouterTab to={join(url, 'events')} css={styles.tab({ theme, noData: occurrenceSearch?.documents?.total === 0 })} label="Events" /> */}
        {/* <RouterTab to={join(url, 'taxonomy')} label="Taxonomy"/> */}
        <RouterTab to={join(url, 'download')} label={<FormattedMessage id="phrases.download" />} />
      </TabList>
    </HeaderWrapper>

    <section>
      <Switch>
        <Route path={join(path, 'citations')}>
          {/* <div css={styles.proseWrapper({ theme })}> */}
          <ContentWrapper>
            <Activity {...{ dataset }} />
          </ContentWrapper>
          {/* </div> */}
        </Route>
        <Route path={join(path, 'download')}>
          <ContentWrapper>
            <DownloadOptions {...{ data }} />
          </ContentWrapper>
        </Route>
        <Route path={join(path, 'specimens')}>
          <ContentWrapper>
            <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>
          </ContentWrapper>
        </Route>
        <Route path={join(path, 'events')}>
          <ContentWrapper>
            <EventSearch config={eventConfig} tabs={['EVENTS']} style={{ margin: '12px auto', maxWidth: 1350, minHeight: 'calc(90vh)' }}></EventSearch>
          </ContentWrapper>
        </Route>
        <Route path={join(path, 'project')}>
          <ContentWrapper>
            <Project {...{ data }} />
          </ContentWrapper>
        </Route>
        <Route path={path}>
          <ContentWrapper>
            <About {...{ data }} insights={insights} />
          </ContentWrapper>
        </Route>
      </Switch>
    </section>
  </div>
};