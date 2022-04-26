import { jsx } from '@emotion/react';
import React, { useContext, useCallback, useState, useEffect } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Prose, Tabs, Eyebrow, LicenseTag, DataHeader, Doi, Button, ResourceLink, ResourceSearchLink, Row, Col } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { iconFeature, countFeature } from '../../components/IconFeatures/styles';
import { About } from './about/About';
import { Project } from './project/Project';
import { Activity } from './activity/Activity';
import { DownloadOptions } from './DownloadOptions';
import { FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';
import { join } from '../../utils/util';
import useBelow from '../../utils/useBelow';
import { Headline } from '../shared/header';

import * as css from './styles';
import { MdDownload, MdOutlineCode, MdOutlineHelpOutline, MdKeyboardArrowLeft, MdLocationOn, MdPeople, MdLink, MdPlaylistAddCheck, MdStar, MdFormatQuote } from 'react-icons/md';

import { Switch, Route, useRouteMatch, Link } from 'react-router-dom';

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

  if (loading) return <div>loading</div>
  const { dataset, literatureSearch, occurrenceSearch, siteOccurrences, taxonSearch } = data;

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
    excludedFilters: ['datasetCode', 'datasetKey', 'institutionKey', 'institutionCode', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode'],
    occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
    highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  };

  return <>
    <DataHeader
      left={<ResourceSearchLink type="datasetSearch" discreet>
        <MdKeyboardArrowLeft />
        <FormattedMessage id='catalogues.datasets' />
      </ResourceSearchLink>}
      style={{ borderBottom: `1px solid ${theme.paperBorderColor}`, background: 'white' }}
      right={<div css={css.headerIcons}>
        {!isBelowNarrow && <Doi id={dataset.doi} />}
        <Button look="text"><MdFormatQuote /></Button>
        <Button look="text"><MdOutlineCode /></Button>
        <Button look="text"><MdOutlineHelpOutline /></Button>
      </div>}>
    </DataHeader>
    <div css={css.headerWrapper({ theme })}>
      <div css={css.proseWrapper({ theme })}>
        <Eyebrow prefix={<FormattedMessage id={`dataset.longType.${dataset.type}`} />} suffix={<FormattedMessage id="dataset.registeredDate" values={{ DATE: <FormattedDate value={dataset.created} year="numeric" month="long" day="2-digit" /> }} />} />
        <div css={css.headerFlex}>
          <div css={css.headerContent}>
            {/* <Eyebrow prefix={<FormattedMessage id={`dataset.longType.${dataset.type}`} />} suffix={<FormattedMessage id="dataset.registeredDate" values={{ DATE: <FormattedDate value={dataset.created} year="numeric" month="long" day="2-digit" /> }} />} /> */}
            <Headline>{dataset.title}</Headline>
            <Row wrap="nowrap">
              {/* {!isBelowNarrow && dataset.logoUrl && <Col css={css.headerLogo}>
                <img src={dataset.logoUrl} />
              </Col>} */}
              <Col grow={true}>
                {dataset?.contactsCitation.length > 0 && <div css={iconFeature({ theme })}>
                  <MdPeople />
                  <div>
                    <ol css={css.bulletList}>{dataset?.contactsCitation.map(p => <li key={p.key}>{p.abbreviatedName}</li>)}</ol>
                  </div>
                </div>}
                <div style={{ marginTop: '.5em' }}>
                  Published by <ResourceLink css={Prose.css.a(theme)} type="publisherKey" id={dataset.publishingOrganizationKey}>{dataset.publishingOrganizationTitle}</ResourceLink>
                </div>

                <div css={css.summary}>
                  <div css={css.iconFeatures()}>

                    <div css={iconFeature({ theme })}>
                      <LicenseTag value={dataset.license} />
                    </div>

                    {isBelowNarrow && <div css={iconFeature({ theme })}>
                      <Doi id={dataset.doi} />
                    </div>}

                    {dataset.homepage && <div css={iconFeature({ theme })}>
                      <MdLink />
                      <span><Hostname href={dataset.homepage} /></span>
                    </div>}

                    {occurrenceSearch.documents.total > 0 && <div css={iconFeature({ theme })}>
                      <MdLocationOn />
                      <span><FormattedNumber value={occurrenceSearch.documents.total} /> occurrences</span>
                    </div>}

                    {/* {siteOccurrences.documents.total > 0 && <div css={iconFeature({ theme })}>
                      <MdLocationOn />
                      <span><FormattedNumber value={siteOccurrences.documents.total} /> occurrences on this site</span>
                    </div>} */}

                        {/* {literatureSearch.documents?.count > 0 && <div css={countFeature({ theme })}>
                      <span>
                        <MdFormatQuote />
                        <FormattedNumber value={literatureSearch.documents.count} />
                      </span>
                      <span><Link to={join(url, 'citations')}>citations</Link></span>
                    </div>} */}

                    {taxonSearch.count > 0 && <div css={iconFeature({ theme })}>
                      <MdPlaylistAddCheck />
                      <span><FormattedNumber value={taxonSearch.count} /> accepted names</span>
                    </div>}

                    {/* <div css={countFeature({ theme })}>
                      <span>{dataset.license}</span>
                    </div> */}

                            {/* {occurrenceSearch.documents.total > 0 && <div css={countFeature({ theme })}>
                      <span><FormattedNumber value={occurrenceSearch.documents.total} /></span>
                      <span>occurrences</span>
                    </div>}
                    
                    {literatureSearch.count > 0 && <div css={countFeature({ theme })}>
                      <span><FormattedNumber value={literatureSearch.count} /></span>
                      <span>citations</span>
                    </div>}

                    {taxonSearch.count > 0 && <div css={countFeature({ theme })}>
                      <span><FormattedNumber value={taxonSearch.count} /></span>
                      <span>accepted names</span>
                    </div>} */}
                  </div>

                </div>
              </Col>
            </Row>
          </div>
        </div>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label="About" />
          {dataset.project && <RouterTab to={join(url, 'project')} label="Project" />}
          {/* <RouterTab to={join(url, 'metrics')} label="Metrics"/> */}
          {/* <RouterTab to={join(url, 'activity')} label="Activity" /> */}
          {literatureSearch.documents?.count > 0 && <RouterTab to={join(url, 'citations')} label="Citations" />}
          {/* <RouterTab to={join(url, 'specimens')} css={css.tab({ theme, noData: occurrenceSearch?.documents?.total === 0 })} label="Occurrences" /> */}
          {/* <RouterTab to={join(url, 'taxonomy')} label="Taxonomy"/> */}
          <RouterTab to={join(url, 'download')} label="Download" />
        </TabList>
      </div>
    </div>


    <section>
      <Switch>
        <Route path={join(path, 'citations')}>
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
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>
        </Route>
        <Route path={join(path, 'project')}>
          <div css={css.proseWrapper({ theme })}>
            <Project {...{ data }} />
          </div>
        </Route>
        <Route path={path}>
          <div css={css.proseWrapper({ theme })}>
            <About {...{ data }} insights={insights} />
          </div>
        </Route>
      </Switch>
    </section>
  </>
};

function Hostname({ href }) {
  try {
    const hostname = new URL(href).hostname;
    return <a href={href} css={css.discreetLink}>{hostname}</a>;
  } catch (err) {
    return <span>invalid</span>;
  }
}