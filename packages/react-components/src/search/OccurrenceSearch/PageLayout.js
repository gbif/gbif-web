
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
import { FormattedMessage } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter, cssViews, cssFooter } from '../Layout.styles';
import { Tabs, DataHeader, NavBar, NavItem } from '../../components'
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
      <FormattedMessage id="search.tabs.table" defaultMessage="Table" />
    </Tab>,
    MAP: <Tab tabId="MAP" key="map">
      <FormattedMessage id="search.tabs.map" defaultMessage="Map" />
    </Tab>,
    GALLERY: <Tab tabId="GALLERY" key="gallery">
      <FormattedMessage id="search.tabs.gallery" defaultMessage="Gallery" />
    </Tab>,
    DATASETS: <Tab tabId="DATASETS" key="datasets">
      <FormattedMessage id="search.tabs.datasets" defaultMessage="Datasets" />
    </Tab>
  }

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <div css={cssNavBar({ theme })} style={{margin: '0 0 10px 0', borderRadius: 0}}>
      <DataHeader style={{borderBottom: '1px solid #ddd'}} availableCatalogues={config.availableCatalogues}>
        <NavBar style={{marginLeft: 10}}>
          <NavItem label="Table" data-targetid="table" onClick={e => setActiveView('TABLE')} isActive={activeView === 'TABLE'} />
          <NavItem label="Gallery" data-targetid="gallery" onClick={e => setActiveView('GALLERY')} isActive={activeView === 'GALLERY'} />
          <NavItem label="Map" data-targetid="map" onClick={e => setActiveView('MAP')} isActive={activeView === 'MAP'} />
          <NavItem label="Download" data-targetid="download" onClick={e => setActiveView('DOWNLOAD')} isActive={activeView === 'DOWNLOAD'} />
        </NavBar>
      </DataHeader>
      <div css={cssFilter({ theme })}>
        <FilterBar config={config}></FilterBar>
      </div>
    </div>
    <div css={cssViewArea({ theme })}>
      {activeView === 'TABLE' && <Table />}
      {activeView === 'MAP' && <Map />}
      {activeView === 'GALLERY' && <Gallery />}
      {activeView === 'DOWNLOAD' && <Download />}
    </div>
    {/* <div className={`${prefix}-${elementName}-footer`} css={cssFooter({ theme })}>
      <div>Footer content</div>
    </div> */}
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);