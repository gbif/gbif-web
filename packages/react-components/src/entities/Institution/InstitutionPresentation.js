
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
// import * as css from './styles';
import { Tabs, Eyebrow } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { iconFeature } from '../../components/IconFeatures/styles';
import { Description as About } from './about/Description';
import { People } from './people/People';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { join } from '../../utils/util';

import * as css from './styles';
import { MdLocationOn, MdPeople, MdStar } from 'react-icons/md';

import { Switch, Route, useRouteMatch } from 'react-router-dom';

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
// console.log(data);
  return <>
    <div css={css.headerWrapper({ theme })}>
      <div css={css.proseWrapper({ theme })}>
        <Eyebrow prefix="Institution code" suffix={institution.code} />
        <h1>{institution.name}</h1>

        <div css={css.summary}>
          <div css={iconFeature({ theme })}>
            <MdLocationOn />
            <span><FormattedNumber value={occurrenceSearch.documents.total} /> specimens</span>
          </div>
          {institution.contacts.length > 0 && <div css={iconFeature({ theme })}>
            <MdPeople />
            {institution.contacts.length < 5 && <span>
              {institution.contacts.map(c => `${c.firstName ? c.firstName : ''} ${c.lastName ? c.lastName : ''}`).join(' • ')}
              </span>
            }
            {institution.contacts.length >= 5 && <span>{institution.contacts.length} staff members</span>}
          </div>}
        </div>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label="About"/>
          <RouterTab to={join(url, '/people')} label="People"/>
          <RouterTab to={join(url, '/specimens')} label="Digitized specimens"/>
        </TabList>
      </div>
    </div>


    <section>
      <Switch>
        <Route path={join(path, '/people')}>
        <div css={css.proseWrapper({ theme })}>
            <People {...{institution}}/>
          </div>
        </Route>
        <Route path={join(path, '/specimens')}>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </Route>
        <Route path={path}>
          <div css={css.proseWrapper({ theme })}>
            <About {...{institution}}/>
          </div>
        </Route>
      </Switch>
    </section>
  </>
};
