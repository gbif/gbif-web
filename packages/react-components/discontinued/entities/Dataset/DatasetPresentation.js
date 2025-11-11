import { jsx, css } from '@emotion/react';
import React from 'react';
import { Tabs, Eyebrow, LicenseTag, Doi, ResourceLink, Tooltip, Button } from '../../components';
import { About } from './about/About';
import { Project } from './project/Project';
import { Activity } from './activity/Activity';
import { DownloadOptions } from './DownloadOptions';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { join } from '../../utils/util';
import env from '../../../.env.json';

import { Homepage, FeatureList, GenericFeature } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, HeaderInfoWrapper, HeaderInfoMain } from '../shared/header';
import { Page404, PageLoader } from '../shared';

import { MdPeople, MdLink, MdFormatQuote, MdOutlineCode, MdOutlineHelpOutline } from 'react-icons/md';
import { Switch, Route, useRouteMatch } from 'react-router-dom';

const { TabList, RouterTab, Tab } = Tabs;
export function DatasetPresentation({
  id,
  data,
  insights,
  error,
  loading,
  disableCatalog,
  style = {},
  ...props
}) {
  let { url, path } = useRouteMatch();

  if (error) {
    if (error?.errorPaths?.dataset?.status === 404) {
      return <>
        <DataHeader />
        <Page404 />
      </>
    } else {
      throw new Error(error);
    }
  }

  if (loading || !data) return <PageLoader />

  const { dataset, literatureSearch } = data;

  // const config = {
  //   rootPredicate: {
  //     "type": "equals",
  //     "value": id,
  //     "key": "datasetKey"
  //   },
  //   excludedFilters: ['datasetCode', 'datasetKey', 'institutionKey', 'institutionCode', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode'],
  //   occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
  //   highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  // };

  return <div style={{ ...style, minHeight: '80vh', background: 'var(--background)' }} {...props}>
    <DataHeader
      availableCatalogues={disableCatalog ? [] : undefined}
      right={<>
        <Doi id={dataset.doi} />
        {/* The idea is that these should provide information on how to cite, how to access by API and a general help about this page */}
        {/* <Button look="text"><MdFormatQuote /></Button>
        <Button look="text"><MdOutlineCode /></Button>
        <Button look="text"><MdOutlineHelpOutline /></Button> */}
      </>}
    />

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
                {dataset?.contactsCitation.map(c => `${c.firstName ? `${c.firstName} ` : ''}${c.lastName ? c.lastName : ''}`).join(' • ')}
              </span>
              }
              {dataset?.contactsCitation.length >= 10 && <span>{dataset?.contactsCitation.length} authors</span>}
            </GenericFeature>}
            <Homepage href={dataset.homepage} />
            <GenericFeature>
              <LicenseTag value={dataset.license} />
            </GenericFeature>
          </FeatureList>
        </HeaderInfoMain>
      </HeaderInfoWrapper>
      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label={<FormattedMessage id="phrases.about" />} />
        {dataset.project && <RouterTab to={join(url, 'project')} label={<FormattedMessage id="phrases.project" />} />}
        {literatureSearch.documents?.total > 0 && <RouterTab to={join(url, 'citations')} label={<FormattedMessage id="phrases.citations" />} />}
        {dataset?.checklistBankDataset?.key && <Tab tabId="0" label="Checklist Bank"><Tooltip title={<FormattedMessage id="dataset.exploreInChecklistBank" defaultMessage="Explore taxonomy via Checklist Bank" />} placement="bottom"><a css={css`text-decoration: none; color: inherit!important;`} href={`${env.CHECKLIST_BANK_WEBSITE}/dataset/gbif-${dataset.key}/classification`}>Taxonomy<MdLink /></a></Tooltip></Tab>}
        <RouterTab to={join(url, 'download')} label={<FormattedMessage id="phrases.download" />} />
      </TabList>
    </HeaderWrapper>

    <section>
      <Switch>
        <Route path={join(path, 'citations')}>
          <ContentWrapper>
            <Activity {...{ dataset }} />
          </ContentWrapper>
        </Route>
        <Route path={join(path, 'download')}>
          <ContentWrapper>
            <DownloadOptions {...{ data }} />
          </ContentWrapper>
        </Route>
        {/* <Route path={join(path, 'specimens')}>
          <ContentWrapper>
            <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>
          </ContentWrapper>
        </Route> */}
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