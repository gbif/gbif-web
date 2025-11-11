import { jsx, css } from '@emotion/react';
import React from 'react';
import { Prose, Tabs, Eyebrow, ResourceLink, ResourceSearchLink } from '../../components';
import { About } from './about/About';
import { FormattedMessage, FormattedDate } from 'react-intl';
import { join } from '../../utils/util';
import useBelow from '../../utils/useBelow';
import env from '../../../.env.json';

import { Homepage, FeatureList, GenericFeature, OccurrenceCount } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain } from '../shared/header';
import { Page404, PageLoader } from '../shared';
import { MdPeople, MdLink, MdFormatQuote as CitationIcon } from 'react-icons/md';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { Citations } from './citations';
import { Metrics } from './metrics';
import DatasetSearch from '../../search/DatasetSearch/DatasetSearch';

const { TabList, RouterTab, Tab } = Tabs;
const { H1 } = Prose;
export function PublisherPresentation({
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
    if (error?.errorPaths?.publisher?.status === 404) {
      return <>
        <DataHeader />
        <Page404 />
      </>
    } else {
      throw new Error(error);
    }
  }

  if (loading || !data) return <PageLoader />

  const { publisher, literatureSearch, occurrenceSearch, hostedDatasets } = data;

  const datasetConfig = {
    rootFilter: {
      publishingOrg: publisher.key
    },
    excludedFilters: ['anyPublisherKey']
  };
  const hostedDatasetConfig = {
    rootFilter: {
      hostingOrg: publisher.key,
    },
    excludedFilters: ['hostingOrganizationKey']
  };

  return <div style={{...style, minHeight: '80vh', background: 'var(--background)'}} {...props}>
    <DataHeader
      availableCatalogues={disableCatalog ? [] : undefined}
      right={<>
        {/* At some point we should add faq and api access here */}
      </>}
    />

    <HeaderWrapper>
      <Eyebrow prefix={<FormattedMessage id={`publisher.header.publisher`} />} suffix={<FormattedMessage id="publisher.header.sinceDate" values={{ DATE: <FormattedDate value={publisher.created} year="numeric" month="long" day="2-digit" /> }} />} />
      <Headline css={css`display: inline; margin-right: 12px;`} badge={publisher.deleted ? 'Deleted' : null}>{publisher.title}</Headline>
      <DeletedMessage date={publisher.deleted} />

      {publisher.publishingOrganizationKey && <div style={{ marginTop: 8 }}>
        <FormattedMessage id="publisher.publishedBy" /> <ResourceLink type="publisherKey" id={publisher.publishingOrganizationKey}>{publisher.publishingOrganizationTitle}</ResourceLink>
      </div>}

      <HeaderInfoWrapper>
        <HeaderInfoMain>
          {publisher?.homepage?.[0] && <FeatureList style={{ marginTop: 8 }}>
            <Homepage href={publisher?.homepage?.[0]} />
          </FeatureList>}
          <FeatureList style={{ marginTop: 8 }}>
            {occurrenceSearch?.documents?.total > 0 && <OccurrenceCount messageId="counts.nOccurrences" count={occurrenceSearch?.documents?.total} />}
            <GenericFeature>
                <ResourceSearchLink type="datasetSearch" queryString={`publishingOrg=${publisher.key}`}>{publisher.numPublishedDatasets}  published datasets</ResourceSearchLink>
            </GenericFeature>
            {data?.hostedDatasets?.count > 0 && <GenericFeature>
              <ResourceSearchLink type="datasetSearch" queryString={`hostingOrg=${publisher.key}`}>{data?.hostedDatasets?.count} hosted datasets</ResourceSearchLink>
            </GenericFeature>}
            {literatureSearch?.documents?.total > 0 && <GenericFeature>
              <CitationIcon /><span>{literatureSearch?.documents?.total} citations</span>
            </GenericFeature>}
          </FeatureList>
        </HeaderInfoMain>
      </HeaderInfoWrapper>

      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label={<FormattedMessage id="phrases.about" />} />
        {publisher.project && <RouterTab to={join(url, 'project')} label={<FormattedMessage id="phrases.project" />} />}
        {literatureSearch.documents?.total > 0 && <RouterTab to={join(url, 'citations')} label={<FormattedMessage id="phrases.citations" />} />}
        {occurrenceSearch.documents?.total > 0 && <RouterTab to={join(url, 'metrics')} label={<FormattedMessage id="phrases.occurrenceMetrics" />} />}
        {/* {publisher.numPublishedDatasets > 0 && <RouterTab to={join(url, 'datasets')} label={<FormattedMessage id="phrases.datasets" />} />}
        {hostedDatasets.count > 0 && <RouterTab to={join(url, 'hosted-datasets')} label={<FormattedMessage id="phrases.hostedDatasets" />} />} */}
        {/* <RouterTab to={join(url, 'events')} css={styles.tab({ theme, noData: occurrenceSearch?.documents?.total === 0 })} label="Events" /> */}
        {/* <RouterTab to={join(url, 'taxonomy')} label="Taxonomy"/> */}
      </TabList>
    </HeaderWrapper>

    <section>
      <Switch>
        <Route path={join(path, 'citations')}>
          <ContentWrapper>
            <Citations {...{ publisher }} />
          </ContentWrapper>
        </Route>
        <Route path={join(path, 'metrics')}>
          <ContentWrapper>
            <Metrics {...{ publisher }} />
          </ContentWrapper>
        </Route>
        {/* <Route path={join(path, 'datasets')}>
          <ContentWrapper>
            <DatasetSearch config={datasetConfig} style={{ margin: 'auto', minHeight: '500px' }}></DatasetSearch>
          </ContentWrapper>
        </Route>
        <Route path={join(path, 'hosted-datasets')}>
          <ContentWrapper>
            <DatasetSearch config={hostedDatasetConfig} style={{ margin: 'auto', minHeight: '500px' }}></DatasetSearch>
          </ContentWrapper>
        </Route> */}
        <Route path={path}>
          <ContentWrapper>
            <About {...{ data }} insights={insights} />
          </ContentWrapper>
        </Route>
      </Switch>
    </section>
  </div>
};