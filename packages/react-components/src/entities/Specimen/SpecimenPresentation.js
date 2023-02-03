import { jsx, css } from '@emotion/react';
import React from 'react';
import { GrGithub as Github } from 'react-icons/gr';
import { MdEdit } from 'react-icons/md';
import { RxMagnifyingGlass } from 'react-icons/rx';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { join } from '../../utils/util';

// Local Components
import { Tag, Tabs, Tooltip, Eyebrow } from '../../components';
import {
  Homepage,
  FeatureList,
  GenericFeature,
} from '../../components/IconFeatures/IconFeatures';
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

// Tab pages
import About from './about';
import Specimens from './specimens';

const { TabList, RouterTab, Tab } = Tabs;

export function SpecimenPresentation({ id, data, error, loading, config }) {
  let { path, url } = useRouteMatch();

  if (loading || !data) return <PageLoader />;
  const [ specimen ] = data?.results?.documents?.results[0]?.occurrences?.results;

  if (error || !specimen) {
    // TODO a generic component for failures is needed
    return (
      <>
        <DataHeader searchType='specimenSearch' messageId='catalogues.specimens' />
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
      <DataHeader searchType='specimenSearch' messageId='catalogues.specimens' />
      <HeaderWrapper>
        <Eyebrow prefix='Institution code' suffix={specimen.institutionCode} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Headline
              css={css`
                display: inline;
                margin-right: 12px;
              `}
            >
              {id}
            </Headline>
            {/* <div style={{ marginTop: 12 }}>
              {taxon.vernacularName && (
                <span style={{ marginRight: 12 }}>{taxon.vernacularName}</span>
              )}
              <Tag type='info'>{taxon.rank}</Tag>
            </div> */}
          </div>
        </div>
        <HeaderInfoWrapper>
          <HeaderInfoMain>
            <FeatureList>
              {specimen.recordedBy && (
                <GenericFeature>
                  <MdEdit />
                  <span>{specimen.recordedBy.join(', ')}</span>
                </GenericFeature>
              )}
              {specimen.identifiedBy && (
                <GenericFeature>
                  <RxMagnifyingGlass />
                  <span>{specimen.identifiedBy.join(', ')}</span>
                </GenericFeature>
              )}
              {/* <Homepage href={id} style={{ marginBottom: 8 }} /> */}
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
                  `Specimen Page: ${id}`
                )}&body=${encodeURIComponent(feedbackTemplate)}`}
              >
                <Github />
              </a>
            </Tooltip>
          </HeaderInfoEdit>
        </HeaderInfoWrapper>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label='About' />
          <RouterTab to={join(url, '/trials')} label='Trials' />
        </TabList>
      </HeaderWrapper>

      <section>
        <Switch>
          <Route path={join(path, '/trials')}>
            <ContentWrapper>
              <Specimens id={id} config={config} />
            </ContentWrapper>
          </Route>
          <Route path={path}>
            <ContentWrapper>
              {/* <About specimen={specimen} /> */}
            </ContentWrapper>
          </Route>
        </Switch>
      </section>
    </>
  );
}
