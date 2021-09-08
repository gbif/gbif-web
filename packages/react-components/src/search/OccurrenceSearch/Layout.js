
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
import { FormattedMessage } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter, cssViews, cssFooter } from '../Layout.styles';
import { Tabs } from '../../components'
import Map from './views/Map';
import Table from './views/Table';
import Gallery from './views/Gallery';
import Datasets from './views/Datasets';
import Download from './views/Download';

import { FilterBar } from '../FilterBar';
import { useQueryParam, StringParam } from 'use-query-params';

const { TabList, Tab, TabPanel, TapSeperator } = Tabs;

const Layout = ({
  className = '',
  config,
  tabs = ['TABLE', 'GALLERY', 'MAP'],
  ...props
}) => {
  // const [activeView, setActiveView] = useUrlState({ param: 'view', defaultValue: tabs[0] || 'TABLE' });
  const [activeView = tabs[0] || 'TABLE', setActiveView] = useQueryParam('view', StringParam);
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'occurrenceSearchLayout';

  const tabComponents = {
    TABLE: <Tab tabId="TABLE" key="table">
      <FormattedMessage id="search.tabs.table" defaultMessage="Table"/>
    </Tab>,
    MAP: <Tab tabId="MAP" key="map">
      <FormattedMessage id="search.tabs.map" defaultMessage="Map"/>
    </Tab>,
    GALLERY: <Tab tabId="GALLERY" key="gallery">
      <FormattedMessage id="search.tabs.gallery" defaultMessage="Gallery"/>
    </Tab>,
    DATASETS: <Tab tabId="DATASETS" key="datasets">
      <FormattedMessage id="search.tabs.datasets" defaultMessage="Datasets"/>
    </Tab>
  }

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })}>
        <div css={cssFilter({ theme })}>
          <FilterBar config={config}></FilterBar>
        </div>
        <div css={cssViews({ theme })}>
          <TabList aria-labelledby="Views">
            {tabs.map(tab => tabComponents[tab])}
            <TapSeperator />
            <Tab tabId="download">
              <FormattedMessage id="search.tabs.download" defaultMessage="Download"/>
            </Tab>
            {/* <TapSeperator /> */}
            {/* <Tab tabId="publisher">Publishers</Tab> */}
            {/* <TapSpacer />
            <TapSeperator />
            <Tab tabId="test">Test</Tab> */}
          </TabList>
        </div>
      </div>
      <TabPanel lazy tabId="TABLE" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Table />
      </TabPanel>
      <TabPanel lazy tabId="MAP" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Map />
      </TabPanel>
      <TabPanel lazy tabId="GALLERY" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Gallery />
      </TabPanel>
      <TabPanel lazy tabId="DATASETS" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Datasets />
      </TabPanel>
      <TabPanel lazy tabId="download" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Download />
      </TabPanel>
      {/* <div className={`${prefix}-${elementName}-footer`} css={cssFooter({ theme })}>
        <div>Footer content</div>
      </div> */}
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);