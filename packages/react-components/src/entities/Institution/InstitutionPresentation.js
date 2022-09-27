
import { jsx, css } from '@emotion/react';
import React, { useContext } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
import { Tabs, Eyebrow, DataHeader, ResourceSearchLink, Button, Tooltip, ResourceLink } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { OccurrenceCount, Homepage, FeatureList, Location, GenericFeature } from '../../components/IconFeatures/IconFeatures';
// import { iconFeature } from '../../components/IconFeatures/styles';
import { Description as About } from './about/Description';
import { Collections } from './collections/Collections';
import { FormattedMessage } from 'react-intl';
import { join } from '../../utils/util';
import env from '../../../.env.json';

import * as styles from './styles';
import { MdChevronLeft } from 'react-icons/md';
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
  let { path, url } = useRouteMatch();
  const theme = useContext(ThemeContext);

  if (loading) return <div>loading</div>
  const { institution, occurrenceSearch } = data;

  if (error || !institution) {
    // TODO a generic component for failures is needed
    return <div>Failed to retrieve item</div>
  }

  const rootPredicate = {
    "type": "equals",
    "value": id,
    "key": "institutionKey"
  };

  const config = {
    rootPredicate,
    excludedFilters: ['institutionCode', 'institutionKey', 'institutionKey', 'institutionCode', 'hostingOrganizationKey', 'protocol', 'publishingCountryCode'],
    occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
    highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  };

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = institution?.address?.countryCode ? institution?.address : institution?.mailingAddress;

  const primaryContacts = institution.contactPersons.filter(x => x.primary);
  const feedbackTemplate = `Please provide you feedback here, but leave content below for context

---
Relating to ${env.GBIF_REGISTRY}/institution/${institution.key}
  `;
  return <>
    <DataHeader
      style={{ borderBottom: '1px solid #ddd', background: 'white' }}
      left={<ResourceSearchLink type="institutionSearch" discreet style={{ display: 'flex', alignItems: 'center' }}>
        <MdChevronLeft /> <FormattedMessage id='catalogues.institutions' />
      </ResourceSearchLink>}
    />
    <div css={styles.headerWrapper({ theme })}>
      <div css={styles.proseWrapper({ theme })}>
        <Eyebrow prefix="Institution code" suffix={institution.code} />
        <h1>{institution.name}</h1>
        {institution.deleted && <div style={{color: 'tomato'}}>This record was deleted on {institution.deleted}</div>}
        {institution.replacedByInstitution && <div style={{color: 'tomato'}}>It was replaced by <ResourceLink type="institutionKey" id={institution.replacedBy}>{institution.replacedByInstitution.name}</ResourceLink></div>}
        {/* {primaryContacts.length > 0 && primaryContacts.length < 5 && <div css={iconFeature({ theme })}>
          <MdPeople />
          <div>
            {primaryContacts.map(c => `${c.firstName ? c.firstName : ''} ${c.lastName ? c.lastName : ''}`).join(' • ')}
          </div>
        </div>} */}
        
        <div css={styles.summary}>
          <div css={styles.summary_primary}>
            <FeatureList>
              <Homepage href={institution.homepage || institution.catalogUrl} style={{ marginBottom: 8 }} />
              {contactInfo?.country && <Location countryCode={contactInfo?.country} city={contactInfo.city} />}
              {institution.numberSpecimens > 0 && <OccurrenceCount messageId="counts.nSpecimens" count={institution.numberSpecimens} />}
              {/* {<GbifCount messageId="counts.nSpecimensInGbif" count={occurrenceSearch?.documents?.total} />} */}
            </FeatureList>
            <FeatureList css={css`margin-top: 8px;`}>
              {/* {institution.numberSpecimens > 0 && <OccurrenceCount messageId="counts.nSpecimens" count={institution.numberSpecimens} />}
              <CollectionsCount count={institution.collections?.length} /> */}
              <GenericFeature>
                <CatalogIcon /><span><a href={institution.catalogUrl}>Data catalog</a></span>
              </GenericFeature>
            </FeatureList>
          </div>
          <div css={styles.summary_secondary}>
            <Tooltip title="No login required" placement="bottom">
              <Button as="a" href={`${env.GBIF_REGISTRY}/institution/${institution.key}`} look="primaryOutline">Edit</Button>
            </Tooltip>
            <Tooltip title="Leave a comment - requires a free Github account" placement="bottom">
              <a style={{ marginLeft: 8, fontSize: 24, color: "var(--primary)" }} target="_blank" href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(`NHC: ${institution.name}`)}&body=${encodeURIComponent(feedbackTemplate)}`}><Github /></a>
            </Tooltip>
          </div>
        </div>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label="About" />
          {<RouterTab to={join(url, '/collections')} css={institution?.collections?.length === 0 ? css`color: var(--color300);` : null} label={<FormattedMessage id="counts.nCollections" values={{ total: institution?.collections?.length }} />} />}
          {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/specimens')} label="Specimens in GBIF" />}
          {occurrenceSearch?.documents?.total === 0 && institution.catalogUrl && <Tab tabId="0" label="Online catalog"><a css={css`text-decoration: none; color: inherit!important;`} href={institution.catalogUrl}>Explore catalog<MdLink /></a></Tab>}
        </TabList>
      </div>
    </div>


    <section>
      <Switch>
        <Route path={join(path, '/collections')}>
          <div css={styles.proseWrapper({ theme })}>
            <Collections {...{ institution }} />
          </div>
        </Route>
        <Route path={join(path, '/specimens')}>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1224, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </Route>
        <Route path={path}>
          <div css={styles.proseWrapper({ theme })}>
            <About {...{ institution, occurrenceSearch }} />
          </div>
        </Route>
      </Switch>
    </section>
  </>
};
