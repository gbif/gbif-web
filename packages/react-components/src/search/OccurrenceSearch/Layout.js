
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
import { FormattedMessage } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter, cssViews, cssFooter } from '../Layout.styles';
import { Tabs, DataHeader, NavBar, NavItem, ErrorBoundary } from '../../components'
import Map from './views/Map';
import Table from './views/Table';
import Gallery from './views/Gallery';
import Datasets from './views/Datasets';
import Clusters from './views/Clusters';
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
    TABLE: <NavItem key="table" label={<FormattedMessage id="search.tabs.table" defaultMessage="Table"/>} data-targetid="table" onClick={e => setActiveView('TABLE')} isActive={activeView === 'TABLE'} />,
    MAP: <NavItem key="map" label={<FormattedMessage id="search.tabs.map" defaultMessage="Map"/>} data-targetid="map" onClick={e => setActiveView('MAP')} isActive={activeView === 'MAP'} />,
    GALLERY: <NavItem key="gallery" label={<FormattedMessage id="search.tabs.gallery" defaultMessage="Gallery"/>} data-targetid="gallery" onClick={e => setActiveView('GALLERY')} isActive={activeView === 'GALLERY'} />,
    DATASETS: <NavItem key="datasets" label={<FormattedMessage id="search.tabs.datasets" defaultMessage="Datasets"/>} data-targetid="dataset" onClick={e => setActiveView('DATASETS')} isActive={activeView === 'DATASETS'} />,
    CLUSTERS: <NavItem key="clusters" label={<FormattedMessage id="search.tabs.clusters" defaultMessage="Clusters"/>} data-targetid="clusters" onClick={e => setActiveView('CLUSTERS')} isActive={activeView === 'CLUSTERS'} />
  }

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <div css={cssNavBar({ theme })}>
      <div css={cssFilter({ theme })}>
        <FilterBar config={config}></FilterBar>
      </div>
      <div>
        <NavBar style={{ marginLeft: 10 }}>
          {tabs.map(tab => tabComponents[tab])}
          <NavItem label="Download" data-targetid="download" onClick={e => setActiveView('DOWNLOAD')} isActive={activeView === 'DOWNLOAD'} />
        </NavBar>
      </div>
    </div>
    <div css={cssViewArea({ theme })}>
      {activeView === 'TABLE' &&    <ErrorBoundary><Table /></ErrorBoundary>}
      {activeView === 'MAP' &&      <ErrorBoundary><Map /></ErrorBoundary>}
      {activeView === 'GALLERY' &&  <ErrorBoundary><Gallery /></ErrorBoundary>}
      {activeView === 'DATASETS' && <ErrorBoundary><Datasets /></ErrorBoundary>}
      {activeView === 'CLUSTERS' && <ErrorBoundary><Clusters /></ErrorBoundary>}
      {activeView === 'DOWNLOAD' && <ErrorBoundary><Download /></ErrorBoundary>}
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