
import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect } from 'react';
import { MdInfo } from 'react-icons/md'
import ThemeContext from '../../style/themes/ThemeContext';
// import * as css from './styles';
import { Row, Col, Tabs, Eyebrow } from '../../components';
import OccurrenceSearch from '../../search/OccurrenceSearch/OccurrenceSearch';
import { iconFeature } from '../../components/IconFeatures/styles';
import { Description as About } from './about/Description';
import { People } from './people/People';

import * as css from './styles';
import { MdGridOn, MdLocationOn, MdPeople, MdInsertDriveFile, MdLabel, MdImage, MdPhotoLibrary, MdStar } from 'react-icons/md';

const { TabList, Tab, TabPanel } = Tabs;

export function CollectionPresentation({
  id,
  data,
  error,
  loading,
  defaultTab = 'people',
  ...props
}) {
  const [activeId, setTab] = useState(defaultTab);
  const theme = useContext(ThemeContext);

  if (loading) return <div>loading</div>
  const { collection, occurrenceSearch } = data;

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
    <Tabs activeId={activeId} onChange={id => setTab(id)}>
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
              <span>{occurrenceSearch.documents.total} specimens</span>
            </div>
            <div css={iconFeature({ theme })}>
              <MdStar />
              <span>{collection.taxonomicCoverage}</span>
            </div>
            {collection.contacts.length > 0 && <div css={iconFeature({ theme })}>
              <MdPeople />
              {collection.contacts.length < 5 && <span>{collection.contacts.map(c => `${c.firstName} ${c.lastName}`).join(' • ')}</span>}
              {collection.contacts.length >= 5 && <span>{collection.contacts.length} staff members</span>}
            </div>}
          </div>
          <TabList style={{ marginTop: '12px', borderTop: '1px solid #ddd' }}>
            <Tab tabId="about">
              About
            </Tab>
            <Tab tabId="people">
              People
            </Tab>
            <Tab tabId="specimens">
              Digitized specimens
            </Tab>
          </TabList>
        </div>
      </div>


      <section>
        <TabPanel tabId='about'>
          <div css={css.proseWrapper({ theme })}>
            <About {...{collection}}/>
          </div>
        </TabPanel>
        <TabPanel tabId='people'>
        <div css={css.proseWrapper({ theme })}>
            <People {...{collection}}/>
          </div>
        </TabPanel>
        <TabPanel tabId='specimens'>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </TabPanel>
      </section>
    </Tabs>
  </>
};
