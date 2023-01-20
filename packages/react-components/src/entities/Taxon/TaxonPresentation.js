import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import { Tabs, Tooltip } from '../../components';
import {
  Homepage,
  FeatureList,
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

  // if (error || !taxon) {
  if (error) {
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
Relating to ${env.GBIF_REGISTRY}/taxon/${id}
  `;
  return (
    <>
      <DataHeader searchType='taxonSearch' messageId='catalogues.taxa' />
      <HeaderWrapper>
        {/* <Eyebrow prefix='Taxon code' suffix='Something here' /> */}
        {/* CLASSIFICATION COMPONENT HERE */}
        <Headline
          css={css`
            display: inline;
            margin-right: 12px;
          `}
          // badge={institution?.active ? null : 'Inactive'} USE FOR TAXON RANK
        >
          {id}
        </Headline>
        <HeaderInfoWrapper>
          <HeaderInfoMain>
            <FeatureList>
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
              <About {...{ institution }} />
            </ContentWrapper>
          </Route>
        </Switch>
      </section>
    </>
  );
}
