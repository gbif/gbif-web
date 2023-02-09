
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Eyebrow, Button, Tooltip, ResourceLink } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';
// import { iconFeature } from '../../components/IconFeatures/styles';
import { Description as About } from './about/Description';
import { Collections } from './collections/Collections';
import { FormattedMessage } from 'react-intl';
import { join } from '../../utils/util';
import env from 'Env';
import useBelow from '../../utils/useBelow';

import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit } from '../shared/header';
import { PageError, Page404, PageLoader } from '../shared';

import { GrGithub as Github } from 'react-icons/gr';
import { MdLink, MdOutlineScreenSearchDesktop as CatalogIcon } from 'react-icons/md';

import { Switch, Route, useRouteMatch } from 'react-router-dom';

const { TabList, RouterTab, Tab } = Tabs;

export function InstitutionPresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  const hideSideBar = useBelow(1100);
  let { path, url } = useRouteMatch();

  if (error) {
    if (error?.errorPaths?.institution?.status === 404) {
      return <>
        <DataHeader searchType="institutionSearch" messageId="catalogues.institutions" />
        <Page404 />
      </>
    } else {
      return <PageError />
    }
  }

  if (loading || !data) return <PageLoader />
  const { institution, occurrenceSearch } = data;

  if (error || !institution) {
    // TODO a generic component for failures is needed
    return <>
      <DataHeader searchType="institutionSearch" messageId="catalogues.institutions" />
      <Page404 />
    </>
  }

  const rootPredicate = {
    "type": "equals",
    "value": id,
    "key": "institutionKey"
  };

  const config = {
    rootPredicate,
    occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
    excludedFilters: ['occurrenceStatus', 'networkKey', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode', 'institutionCode', 'institutionKey', 'institutionKey'],
    highlightedFilters: ['taxonKey', 'verbatimScientificName', 'catalogNumber', 'recordedBy', 'identifiedBy'],
    defaultTableColumns: ['features', 'collectionKey', 'collectionCode', 'catalogNumber', 'country', 'year', 'recordedBy', 'identifiedBy'],
  };

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = institution?.address?.countryCode ? institution?.address : institution?.mailingAddress;

  const feedbackTemplate = `Please provide you feedback here, but leave content below for context

---
Relating to ${env.GBIF_REGISTRY}/institution/${institution.key}
  `;
  return <>
    <DataHeader searchType="institutionSearch" messageId="catalogues.institutions" />
    <HeaderWrapper>
      <Eyebrow prefix="Institution code" suffix={institution.code} />
      <Headline css={css`display: inline; margin-right: 12px;`} badge={institution.active ? null : 'Inactive'}>{institution.name}</Headline>
      <DeletedMessage date={institution.deleted} />
      {institution.replacedByInstitution && <ErrorMessage>
        <FormattedMessage id="phrases.replacedBy" values={{ newItem: <ResourceLink type="institutionKey" id={institution.replacedByInstitution.key}>{institution.replacedByInstitution.name}</ResourceLink> }} />
      </ErrorMessage>}

      <HeaderInfoWrapper>
        <HeaderInfoMain>
          <FeatureList>
            <Homepage href={institution.homepage} style={{ marginBottom: 8 }} />
            {contactInfo?.country && <Location countryCode={contactInfo?.country} city={contactInfo.city} />}
            <OccurrenceCount messageId="counts.nSpecimens" count={institution.numberSpecimens} zeroMessage="grscicoll.unknownSize"/>
            {hideSideBar && <GbifCount messageId="counts.nSpecimensInGbif" count={occurrenceSearch?.documents?.total} />}
          </FeatureList>
          {institution.catalogUrl && <FeatureList css={css`margin-top: 8px;`}>
            <GenericFeature>
              <CatalogIcon /><span><a href={institution.catalogUrl}>Data catalog</a></span>
            </GenericFeature>
          </FeatureList>}
        </HeaderInfoMain>
        <HeaderInfoEdit>
          <Tooltip title="No login required" placement="bottom">
            <Button as="a" href={`${env.GBIF_REGISTRY}/institution/${institution.key}`} look="primaryOutline">Edit</Button>
          </Tooltip>
          <Tooltip title="Leave a comment - requires a free Github account" placement="bottom">
            <a style={{ marginLeft: 8, fontSize: 24, color: "var(--primary)" }} target="_blank" href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(`NHC: ${institution.name}`)}&body=${encodeURIComponent(feedbackTemplate)}`}><Github /></a>
          </Tooltip>
        </HeaderInfoEdit>
      </HeaderInfoWrapper>
      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label="About" />
        {<RouterTab to={join(url, '/collections')} css={institution?.collections?.length === 0 ? css`color: var(--color300);` : null} label={<FormattedMessage id="counts.nCollections" values={{ total: institution?.collections?.length }} />} />}
        {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/specimens')} tooltip={<FormattedMessage id="grscicoll.specimensViaGbif" defaultMessage="Specimens via GBIF" />} label={<FormattedMessage id="grscicoll.specimens" defaultMessage="Specimens" />} css={occurrenceSearch?.documents?.total === 0 ? css`color: var(--color300);` : null} />}
        {occurrenceSearch?.documents?.total === 0 && institution.catalogUrl && <Tab tabId="0" label="Online catalog"><a css={css`text-decoration: none; color: inherit!important;`} href={institution.catalogUrl}>Explore catalog<MdLink /></a></Tab>}
      </TabList>
    </HeaderWrapper>


    <section>
      <Switch>
        <Route path={join(path, '/collections')}>
          <ContentWrapper>
            <Collections {...{ institution }} />
          </ContentWrapper>
        </Route>
        <Route path={join(path, '/specimens')}>
          <ContentWrapper>
            <OccurrenceSearch config={config} style={{ minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
          </ContentWrapper>
        </Route>
        <Route path={path}>
          <ContentWrapper>
            <About {...{ institution, occurrenceSearch }} />
          </ContentWrapper>
        </Route>
      </Switch>
    </section>
  </>
};
