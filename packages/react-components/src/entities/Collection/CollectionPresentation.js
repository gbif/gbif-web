
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
  defaultTab = 'people',
  ...props
}) {
  const [activeId, setTab] = useState(defaultTab);
  const theme = useContext(ThemeContext);

  const rootPredicate = {
    "type": "equals",
    "value": "1d1393bd-7edd-46fe-a224-ac8ff8e38402",
    "key": "collectionKey"
  };
  const config = { rootPredicate };
  return <>
    <Tabs activeId={activeId} onChange={id => setTab(id)}>
      <div css={css.headerWrapper({ theme })}>
        <div css={css.proseWrapper({ theme })}>
          <Eyebrow prefix="Collection code" suffix="SFH" />
          <h1>Lichen</h1>
          <div>
            From <a href="/sdf">University of California Santa Barbara, Cheadle Center for Biodiversity and Ecological Restoration</a>
          </div>

          <div css={css.summary}>
            <div css={iconFeature({ theme })}>
              <MdLocationOn />
              <span>71.266 specimens</span>
            </div>
            <div css={iconFeature({ theme })}>
              <MdStar />
              <span>Major groups Magnoliopsida • Liliopsida</span>
            </div>
            <div css={iconFeature({ theme })}>
              <MdPeople />
              <span>Jane Franklin • Viggo Mortensen</span>
            </div>
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
            <About />
          </div>
        </TabPanel>
        <TabPanel tabId='people'>
        <div css={css.proseWrapper({ theme })}>
            <People />
          </div>
        </TabPanel>
        <TabPanel tabId='specimens'>
          <OccurrenceSearch config={config} style={{ margin: 'auto', maxWidth: 1000, minHeight: 'calc(90vh)' }}></OccurrenceSearch>;
        </TabPanel>
      </section>
    </Tabs>
  </>
};
