import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import { Classification, Tag, Tabs, Tooltip } from '../../components';
import {
  Homepage,
  FeatureList,
  GenericFeature,
} from '../../components/IconFeatures/IconFeatures';
import { join } from '../../utils/util';
import env from '../../../.env.json';

import {
  DataHeader,
  HeaderWrapper,
  ContentWrapper,
  Headline,
  HeaderInfoWrapper,
  HeaderInfoMain,
  HeaderInfoEdit,
} from '../shared/header';
import { PageError, Page404, PageLoader } from '../shared';
import About from './about';

import { GrGithub as Github } from 'react-icons/gr';

import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { MdPerson } from 'react-icons/md';

const { TabList, RouterTab, Tab } = Tabs;

export function TaxonPresentation({ id, data, error, loading, ...props }) {
  let { path, url } = useRouteMatch();

  if (error) {
    if (error?.errorPaths?.institution?.status === 404) {
      return (
        <>
          <DataHeader searchType='taxonSearch' messageId='catalogues.taxa' />
          <Page404 />
        </>
      );
    } else {
      return <PageError />;
    }
  }

  if (loading || !data) return <PageLoader />;
  const { institution, taxon } = data;

  if (error || !taxon) {
    // TODO a generic component for failures is needed
    return (
      <>
        <DataHeader searchType='taxonSearch' messageId='catalogues.taxa' />
        <Page404 />
      </>
    );
  }

  const feedbackTemplate = `Please provide you feedback here, but leave content below for context

---
Relating to ${location.href}
  `;
  return (
    <>
      <DataHeader searchType='taxonSearch' messageId='catalogues.taxa' />
      <HeaderWrapper>
        {/* <Eyebrow prefix='Taxon code' suffix='Something here' /> */}
        <Classification style={{ marginBottom: 16 }}>
          {['order', 'family', 'genus'].map((rank) =>
            taxon[rank] ? (
              <span style={{ color: '#aaa', fontSize: 14 }}>{taxon[rank]}</span>
            ) : null
          )}
        </Classification>
        <Headline
          css={css`
            display: inline;
            margin-right: 12px;
          `}
        >
          {taxon.scientificName}
        </Headline>
        <div style={{ marginTop: 12 }}>
          {taxon.vernacularName && (
            <span style={{ marginRight: 12 }}>{taxon.vernacularName}</span>
          )}
          <Tag type='info'>{taxon.rank}</Tag>
        </div>
        <HeaderInfoWrapper>
          <HeaderInfoMain>
            <FeatureList>
              {taxon.authorship && (
                <GenericFeature>
                  <MdPerson />
                  <span>{taxon.authorship}</span>
                </GenericFeature>
              )}
              <Homepage href={id} style={{ marginBottom: 8 }} />
            </FeatureList>
          </HeaderInfoMain>
          <HeaderInfoEdit>
            <Tooltip
              title='Leave a comment - requires a free Github account'
              placement='bottom'
            >
              <a
                style={{ marginLeft: 8, fontSize: 24, color: 'var(--primary)' }}
                target='_blank'
                href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(
                  `Taxon Page: ${id}`
                )}&body=${encodeURIComponent(feedbackTemplate)}`}
              >
                <Github />
              </a>
            </Tooltip>
          </HeaderInfoEdit>
        </HeaderInfoWrapper>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label='About' />
          <RouterTab to={join(url, '/test')} label='Test' />
        </TabList>
      </HeaderWrapper>

      <section>
        <Switch>
          <Route path={join(path, '/test')}>
            <ContentWrapper>
              <div>Testing</div>
            </ContentWrapper>
          </Route>
          <Route path={path}>
            <ContentWrapper>
              <About taxon={taxon} />
            </ContentWrapper>
          </Route>
        </Switch>
      </section>
    </>
  );
}
