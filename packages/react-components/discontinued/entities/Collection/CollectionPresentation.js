
import { jsx, css } from '@emotion/react';
import React, { useContext, useEffect, useState } from 'react';
import { Tabs, Eyebrow, ResourceLink, Button, Tooltip } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { Description as About } from './about/Description';
// import { People } from './people/People';
import { FormattedMessage } from 'react-intl';
import { join } from '../../utils/util';
import { MdLink, MdPeople, MdOutlineScreenSearchDesktop as CatalogIcon } from 'react-icons/md';
import { Dashboard } from './dashboard/Dashboard';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { GrGithub as Github } from 'react-icons/gr';
import useBelow from '../../utils/useBelow';
import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature, GbifCount } from '../../components/IconFeatures/IconFeatures';
import { DataHeader, HeaderWrapper, ContentWrapper, Headline, DeletedMessage, ErrorMessage, HeaderInfoWrapper, HeaderInfoMain, HeaderInfoEdit } from '../shared/header';
import { Page404, PageLoader } from '../shared';

import env from '../../../.env.json';
import SiteContext from '../../dataManagement/SiteContext';
import { FeaturedImageContent } from '../Institution/about/Description';
const { TabList, RouterTab, Tab } = Tabs;

export function CollectionPresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  const hideSideBar = useBelow(1100);
  const useInlineImage = useBelow(700);
  const { collection: collectionContext } = useContext(SiteContext);
  let { url, path } = useRouteMatch();

  const rootPredicate = {
    "type": "equals",
    "value": id,
    "key": "collectionKey"
  };

  const configState = {
    rootPredicate,
    occurrenceSearchTabs: ['TABLE'],
    excludedFilters: ['occurrenceStatus', 'networkKey', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode', 'institutionCode', 'institutionKey', 'institutionKey', 'collectionKey'],
    highlightedFilters: ['taxonKey', 'verbatimScientificName', 'catalogNumber', 'recordedBy', 'identifiedBy'],
    defaultTableColumns: ['features', 'catalogNumber', 'country', 'year', 'recordedBy', 'identifiedBy'],
  };
  const [config, setConfig] = useState(configState);

  // once we get the slow query back with information about how many records have coordinates, iages and is in a cluster, then we can decide what tabs to show
  useEffect(() => {
    let occurrenceSearchTabs = [];
    if (data?.withCoordinates?.documents?.total > 0) occurrenceSearchTabs.push('MAP');
    if (data?.withImages?.documents?.total > 0) occurrenceSearchTabs.push('GALLERY');
    if (data?.withClusters?.documents?.total > 0) occurrenceSearchTabs.push('CLUSTERS');
    // and then take the intersection with the available occurrence tabs defined in the site context. 
    if (collectionContext?.availableOccurrenceSearchTabs) {
      try {
        occurrenceSearchTabs = occurrenceSearchTabs.filter(x => collectionContext?.availableOccurrenceSearchTabs?.includes(x));
      } catch (err) {
        // ignore error in user config
        console.error(err);
      }
    }
    // insert TABLE as first tab
    occurrenceSearchTabs.unshift('TABLE');
    setConfig({ ...config, occurrenceSearchTabs })
  }, [data?.withImages]);


  if (error) {
    if (error?.errorPaths?.collection?.status === 404) {
      return <>
        <DataHeader />
        <Page404 />
      </>
    } else {
      throw new Error(error);
    }
  }

  if (loading || !data) return <PageLoader />
  const { collection, occurrenceSearch } = data;
  // const recordedByCardinality = occurrenceSearch?.cardinality?.recordedBy;

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = collection?.address?.country ? collection?.address : collection?.mailingAddress;

  const contacts = collection?.contactPersons.filter(x => x.firstName);
  // const hasNoPeople = !contacts.length && !recordedByCardinality;

  const feedbackTemplate = `Please provide you feedback here, but leave content below for context

---
Relating to ${env.GBIF_REGISTRY}/collection/${collection.key}
  `;

  return <>
    <DataHeader showEmpty />

    <HeaderWrapper>
      <div css={css`display: flex;`}>
        <div css={css`flex: 0 0 auto; margin-inline-end: 24px;`}>
          {!useInlineImage && collection.featuredImageUrl && <div css={css`position: relative; overflow: hidden; border-radius: 10px; width: ${hideSideBar ? '150px' : '500px'}; background: #f5f5f5;`}>
            <FeaturedImageContent featuredImageUrl={collection.featuredImageUrl} featuredImageLicense={collection.featuredImageLicense} />
          </div>}
        </div>
        <div css={css`flex: 1 1 auto;`}>
          <Eyebrow prefix={<FormattedMessage id="grscicoll.collectionCode" />} suffix={collection.code} />
          <Headline css={css`display: inline; margin-right: 12px;`} badge={collection.active ? null : 'Inactive'}>{collection.name}</Headline>
          <DeletedMessage date={collection.deleted} />
          {collection.replacedByCollection && <ErrorMessage>
            <FormattedMessage id="phrases.replacedBy" values={{ newItem: <ResourceLink type="collectionKey" id={collection?.replacedByCollection?.key}>{collection?.replacedByCollection?.name}</ResourceLink> }} />
          </ErrorMessage>}
          {collection.institution && <div style={{ marginTop: 8 }}>
            <FormattedMessage id="grscicoll.fromInstitution" values={{ institution: <ResourceLink type="institutionKey" id={collection.institution.key}>{collection.institution.name}</ResourceLink> }} />
          </div>}

          <HeaderInfoWrapper>
            <HeaderInfoMain>
              <FeatureList style={{ marginTop: 8 }}>
                {collection.contactPersons.length > 0 && <GenericFeature>
                  <MdPeople />
                  <span>
                    <a href="#contact">
                      {contacts.length < 5 && <span>
                        {contacts.map(c => `${c.firstName ? `${c.firstName} ` : ''}${c.lastName ? c.lastName : ''}`).join(' • ')}
                      </span>
                      }
                      {contacts.length >= 5 && <span><FormattedMessage id="counts.nStaffMembers" values={{ total: contacts.length }} /></span>}
                    </a>
                  </span>
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
                  <CatalogIcon /><span><a href={collection.catalogUrl}>
                    <FormattedMessage id="grscicoll.dataCatalog" defaultMessage="Data catalog" />
                  </a></span>
                </GenericFeature>
              </FeatureList>}
            </HeaderInfoMain>
            <HeaderInfoEdit>
              <Tooltip title={<FormattedMessage id="grscicoll.editHelpText" defaultMessage="No login required" />} placement="bottom">
                <Button as="a" href={`${env.GBIF_REGISTRY}/collection/${collection.key}`} look="primaryOutline"><FormattedMessage id="grscicoll.edit" defaultMessage="Edit" /></Button>
              </Tooltip>
              <Tooltip title={<FormattedMessage id="grscicoll.githubHelpText" defaultMessage="Github" />} placement="bottom">
                <a style={{ marginLeft: 8, fontSize: 24, color: "var(--primary)" }} target="_blank" href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(`NHC: ${collection.name}`)}&body=${encodeURIComponent(feedbackTemplate)}`}><Github /></a>
              </Tooltip>
            </HeaderInfoEdit>
          </HeaderInfoWrapper>
        </div>
      </div>

      <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
        <RouterTab to={url} exact label={<FormattedMessage id="grscicoll.tabs.about" defaultMessage="About" />} />
        {/* <RouterTab to={join(url, 'people')} css={tabStyle({ theme, noData: hasNoPeople })} label="People" /> */}
        {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/specimens')} tooltip={<FormattedMessage id="grscicoll.specimensViaGbif" defaultMessage="Specimens via GBIF" />} label={<FormattedMessage id="grscicoll.specimens" defaultMessage="Specimens" />} css={occurrenceSearch?.documents?.total === 0 ? css`color: var(--color300);` : null} />}
        {occurrenceSearch?.documents?.total === 0 && collection.catalogUrl && <Tab tabId="0"><a css={css`text-decoration: none; color: inherit!important;`} href={collection.catalogUrl}><FormattedMessage id="grscicoll.tabs.explore" defaultMessage="Explore" /> <MdLink /></a></Tab>}
        {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/dashboard')} label={<FormattedMessage id="grscicoll.dashboard" defaultMessage="Dashboard" />} />}
      </TabList>
    </HeaderWrapper >

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
            <About {...{ collection, occurrenceSearch }} useInlineImage={useInlineImage} />
          </ContentWrapper>
        </Route>
      </Switch>
    </section>
  </>
};
