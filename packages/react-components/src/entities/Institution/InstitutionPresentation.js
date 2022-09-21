
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
// import * as css from './styles';
import { Tabs, Eyebrow, DataHeader, ResourceSearchLink, Button, Tooltip } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { OccurrenceCount, Homepage, CollectionsCount, FeatureList, Location } from '../../components/IconFeatures/IconFeatures';
import { iconFeature } from '../../components/IconFeatures/styles';
import { Description as About } from './about/Description';
import { People } from './people/People';
import { Collections } from './collections/Collections';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { join } from '../../utils/util';
import env from '../../../.env.json';

import * as css from './styles';
import { MdChevronLeft, MdPeople, MdEdit } from 'react-icons/md';
import { GrGithub as Github } from 'react-icons/gr';

import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { encode } from 'js-base64';

const { TabList, RouterTab } = Tabs;

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
    <div css={css.headerWrapper({ theme })}>
      <div css={css.proseWrapper({ theme })}>
        <Eyebrow prefix="Institution code" suffix={institution.code} />
        <h1>{institution.name}</h1>

        <div css={css.summary}>
          <div css={css.summary_primary}>
            <FeatureList>
              <Homepage href={institution.homepage || institution.catalogUrl} style={{ marginBottom: 8 }} />
              <Location countryCode={contactInfo.country} city={contactInfo.city} />
              {institution.contacts.length > 0 && <div css={iconFeature({ theme })}>
                <MdPeople />
                {institution.contacts.length < 5 && <span>
                  {institution.contacts.map(c => `${c.firstName ? c.firstName : ''} ${c.lastName ? c.lastName : ''}`).join(' • ')}
                </span>
                }
                {institution.contacts.length >= 5 && <span>{institution.contacts.length} staff members</span>}
              </div>}
            </FeatureList>
            <FeatureList>
              {institution.numberSpecimens > 0 && <OccurrenceCount messageId="counts.nSpecimens" count={institution.numberSpecimens} />}
              <CollectionsCount count={institution.collections?.length} />
            </FeatureList>
          </div>
          <div css={css.summary_secondary}>
            <Tooltip title="No login required to leave suggestions" placement="bottom">
              <Button as="a" href={`${env.GBIF_REGISTRY}/institution/${institution.key}`} look="primaryOutline">Edit</Button>
            </Tooltip>
            <Tooltip title="Leave feedback via Github - requires a free account" placement="bottom">
              <a style={{ marginLeft: 8, fontSize: 24 }} target="_blank" href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(`NHC: ${institution.name}`)}&body=${encodeURIComponent(feedbackTemplate)}`}><Github /></a>
            </Tooltip>
          </div>
        </div>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label="About" />
          {institution?.collections?.length > 0 && <RouterTab to={join(url, '/collections')} label="Collections" />}
          {institution?.contacts?.length > 0 && <RouterTab to={join(url, '/people')} label="People" />}
          {occurrenceSearch?.documents?.total > 0 && <RouterTab to={join(url, '/specimens')} label="Digitized specimens" />}
        </TabList>
      </div>
    </div>


    <section>
      <Switch>
        <Route path={join(path, '/collections')}>
          <div css={css.proseWrapper({ theme })}>
            <Collections {...{ institution }} />
          </div>
        </Route>
        <Route path={join(path, '/people')}>
          <div css={css.proseWrapper({ theme })}>
            <People {...{ institution }} />
          </div>
        </Route>
        <Route path={join(path, '/specimens')}>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </Route>
        <Route path={path}>
          <div css={css.proseWrapper({ theme })}>
            <About {...{ institution, occurrenceSearch }} />
          </div>
        </Route>
      </Switch>
    </section>
  </>
};
