
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

export function CollectionPresentation({
  id,
  data,
  error,
  loading,
  ...props
}) {
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  console.log('url: ', url);
  console.log('path: ', path);
  console.log('path: ', path);
  console.log('join url: ', join(url, 'people'));
  console.log('join path: ', join(path, 'people'));

  if (loading) return <div>loading</div>
  const { collection, occurrenceSearch } = data;

  if (error || !collection) {
    // TODO a generic component for failures is needed
    return <div>Failed to retrieve item</div> 
  }

  const rootPredicate = {
    "type": "equals",
    "value": id,
    "key": "collectionKey"
  };
  
  const config = { 
    rootPredicate, 
    blacklistedFilters: ['collectionCode', 'collectionKey', 'institutionKey', 'institutionCode', 'hostKey', 'protocol', 'publishingCountryCode'], 
    occurrenceSearchTabs: ['TABLE', 'GALLERY', 'MAP'],
    highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  };
// console.log(data);
  return <>
    <div css={css.headerWrapper({ theme })}>
      <div css={css.proseWrapper({ theme })}>
        <Eyebrow prefix="Collection code" suffix={collection.code} />
        <h1>{collection.name}</h1>
        {collection.institution && <div>
          From <a href={`/institution/${collection.institution.key}`}>{collection.institution.name}</a>
        </div>}

        <div css={css.summary}>
          <div css={iconFeature({ theme })}>
            <MdLocationOn />
            <span><FormattedNumber value={occurrenceSearch.documents.total} /> specimens</span>
          </div>
          <div css={iconFeature({ theme })}>
            <MdStar />
            <span>{collection.taxonomicCoverage}</span>
          </div>
          {collection.contacts.length > 0 && <div css={iconFeature({ theme })}>
            <MdPeople />
            {collection.contacts.length < 5 && <span>
              {collection.contacts.map(c => `${c.firstName ? c.firstName : ''} ${c.lastName ? c.lastName : ''}`).join(' • ')}
              </span>
            }
            {collection.contacts.length >= 5 && <span>{collection.contacts.length} staff members</span>}
          </div>}
        </div>
        <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
          <RouterTab to={url} exact label="About"/>
          <RouterTab to={join(url, 'people')} label="People"/>
          <RouterTab to={join(url, 'specimens')} label="Digitized specimens"/>
        </TabList>
      </div>
    </div>


    <section>
      <Switch>
        <Route path={join(path, 'people')}>
        <div css={css.proseWrapper({ theme })}>
            <People {...{collection}}/>
          </div>
        </Route>
        <Route path={join(path, 'specimens')}>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </Route>
        <Route path={path}>
          <div css={css.proseWrapper({ theme })}>
            <About {...{collection}}/>
          </div>
        </Route>
      </Switch>
    </section>
  </>
};
