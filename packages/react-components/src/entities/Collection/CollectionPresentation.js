
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Eyebrow, ResourceLink, Button, Tooltip } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { Description as About } from './about/Description';
// import { People } from './people/People';
import { FormattedMessage } from 'react-intl';
import { join } from '../../utils/util';

import { tab as tabStyle } from './styles';
import { MdLink, MdPeople, MdOutlineScreenSearchDesktop as CatalogIcon } from 'react-icons/md';
import { Dashboard } from './dashboard/Dashboard';

import { Switch, Route, useRouteMatch } from 'react-router-dom';



import { GrGithub as Github } from 'react-icons/gr';

import useBelow from '../../utils/useBelow';
import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit } from '../shared/header';
import { PageError, Page404, PageLoader } from '../shared';

import env from '../../../.env.json';
import RouteContext from '../../dataManagement/RouteContext';
const { TabList, RouterTab, Tab } = Tabs;

export function CollectionPresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  const hideSideBar = useBelow(1100);
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const hasCollectionSearch = routeContext?.collectionSearch?.disabled !== true;

  if (error) {
    if (error?.errorPaths?.collection?.status === 404) {
      return <>
        <DataHeader searchType="collectionSearch" messageId="catalogues.collections" />
        <Page404 />
      </>
    } else {
      return <PageError />
    }
  }

  if (loading || !data) return <PageLoader />
  const { collection, occurrenceSearch } = data;
  const recordedByCardinality = occurrenceSearch?.cardinality?.recordedBy;

  const rootPredicate = {
    "type": "equals",
    "value": id,
    "key": "collectionKey"
  };

  const config = {
    rootPredicate,
    occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
    excludedFilters: ['occurrenceStatus', 'networkKey', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode', 'institutionCode', 'institutionKey', 'institutionKey', 'collectionKey'],
    highlightedFilters: ['taxonKey', 'verbatimScientificName', 'catalogNumber', 'recordedBy', 'identifiedBy'],
    defaultTableColumns: ['features', 'catalogNumber', 'country', 'year', 'recordedBy', 'identifiedBy'],
  };

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = collection?.address?.countryCode ? collection?.address : collection?.mailingAddress;

  const contacts = collection?.contactPersons.filter(x => x.firstName);
  const hasNoPeople = !contacts.length && !recordedByCardinality;

  const feedbackTemplate = `Please provide you feedback here, but leave content below for context

---
Relating to ${env.GBIF_REGISTRY}/collection/${collection.key}
  `;

  return <>
    {hasCollectionSearch && <DataHeader searchType="collectionSearch" messageId="catalogues.collections" />}

    <HeaderWrapper>
      <Eyebrow prefix="Collection code" suffix={collection.code} />
      <Headline css={css`display: inline; margin-right: 12px;`} badge={collection.active ? null : 'Inactive'}>{collection.name}</Headline>
      <DeletedMessage date={collection.deleted} />
      {collection.replacedByCollection && <ErrorMessage>
        <FormattedMessage id="phrases.replacedBy" values={{ newItem: <ResourceLink type="collectionKey" id={collection?.replacedByCollection?.key}>{collection?.replacedByCollection?.name}</ResourceLink> }} />
      </ErrorMessage>}
      {collection.institution && <div style={{ marginTop: 8 }}>
        From <ResourceLink type="institutionKey" id={collection.institution.key}>{collection.institution.name}</ResourceLink>
      </div>}

      <HeaderInfoWrapper>
        <HeaderInfoMain>
          <FeatureList style={{ marginTop: 8 }}>
            {collection.contactPersons.length > 0 && <GenericFeature>
              <MdPeople />
              {contacts.length < 5 && <span>
                {contacts.map(c => `${c.firstName ? c.firstName : ''} ${c.lastName ? c.lastName : ''}`).join(' • ')}
              </span>
              }
              {contacts.length >= 5 && <span>{contacts.length} staff members</span>}
            </GenericFeature>}
            <Homepage href={collection.homepage} />
            {contactInfo?.country && <Location countryCode={contactInfo?.country} city={contactInfo.city} />}
            <OccurrenceCount messageId="counts.nSpecimens" count={collection.numberSpecimens} zeroMessage="grscicoll.unknownSize" />
            {hideSideBar && <GbifCount messageId="counts.nSpecimensInGbif" count={occurrenceSearch?.documents?.total} />}

            {/* {collection.taxonomicCoverage && <div css={iconFeature({ theme })}>
              <MdStar />
              <span>{collection.taxonomicCoverage}</span>
            </div>} */}

          </FeatureList>
          {collection.catalogUrl && <FeatureList css={css`margin-top: 8px;`}>
            <GenericFeature>
              <CatalogIcon /><span><a href={collection.catalogUrl}>Data catalog</a></span>
            </GenericFeature>
          </FeatureList>}
        </HeaderInfoMain>
        <HeaderInfoEdit>
          <Tooltip title="No login required" placement="bottom">
            <Button as="a" href={`${env.GBIF_REGISTRY}/collection/${collection.key}`} look="primaryOutline">Edit</Button>
          </Tooltip>
          <Tooltip title="Leave a comment - requires a free Github account" placement="bottom">
            <a style={{ marginLeft: 8, fontSize: 24, color: "var(--primary)" }} target="_blank" href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(`NHC: ${collection.name}`)}&body=${encodeURIComponent(feedbackTemplate)}`}><Github /></a>
          </Tooltip>
        </HeaderInfoEdit>
      </HeaderInfoWrapper>

      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label="About" />
        {/* <RouterTab to={join(url, 'people')} css={tabStyle({ theme, noData: hasNoPeople })} label="People" /> */}
        {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/specimens')} tooltip={<FormattedMessage id="grscicoll.specimensViaGbif" defaultMessage="Specimens via GBIF" />} label={<FormattedMessage id="grscicoll.specimens" defaultMessage="Specimens" />} css={occurrenceSearch?.documents?.total === 0 ? css`color: var(--color300);` : null} />}
        {occurrenceSearch?.documents?.total === 0 && collection.catalogUrl && <Tab tabId="0" label="Online catalog"><a css={css`text-decoration: none; color: inherit!important;`} href={collection.catalogUrl}>Explore catalog<MdLink /></a></Tab>}
        {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/dashboard')} label={<FormattedMessage id="grscicoll.dashboard" defaultMessage="Dashboard" />} />}
      </TabList>
    </HeaderWrapper>

    <section>
      <Switch>
        {/* <Route path={join(path, 'people')}>
          <ContentWrapper>
            <People {...{ collection, recordedByCardinality }} />
          </ContentWrapper>
        </Route> */}
        <Route path={join(path, 'dashboard')}>
          <ContentWrapper>
            <Dashboard {...{ collection, occurrenceSearch }} />
          </ContentWrapper>
        </Route>
        <Route path={join(path, 'specimens')}>
          <ContentWrapper>
            <OccurrenceSearch config={config} style={{ minHeight: 'calc(90vh)' }}></OccurrenceSearch>
          </ContentWrapper>
        </Route>
        <Route path={path}>
          <ContentWrapper>
            <About {...{ collection, occurrenceSearch }} />
          </ContentWrapper>
        </Route>
      </Switch>
    </section>
  </>
};
