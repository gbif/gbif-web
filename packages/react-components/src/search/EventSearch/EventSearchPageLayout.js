
import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
import { FormattedMessage } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter } from './Layout.styles';
import { Tabs, DataHeader, NavBar, NavItem } from '../../components'
import { FilterBar } from '../FilterBar';
import { useQueryParam, StringParam } from 'use-query-params';

const Layout = ({
  className = '',
  config,
  List,
  Table,
  Map,
  ...props
}) => {
  const [activeView = 'DATASETS', setActiveView] = useQueryParam('view', StringParam);
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'searchLayout';

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })} style={{ margin: '0 0 10px 0', borderRadius: 0 }}>
        <DataHeader availableCatalogues={config.availableCatalogues} style={{ borderBottom: '1px solid #ddd' }} />
        <div css={cssFilter({ theme })}>
          <FilterBar config={config}></FilterBar>
        </div>
        <div>
          <NavBar style={{ marginLeft: 10 }}>
            <NavItem label={<FormattedMessage id="search.tabs.datasets" defaultMessage="Datasets"/>} data-targetid="dataset" onClick={e => setActiveView('DATASETS')} isActive={activeView === 'DATASETS'} />
            <NavItem label={<FormattedMessage id="search.tabs.events" defaultMessage="Events"/>} data-targetid="events" onClick={e => setActiveView('EVENTS')} isActive={activeView === 'EVENTS'} />
            <NavItem label={<FormattedMessage id="search.tabs.map" defaultMessage="Map"/>} data-targetid="map" onClick={e => setActiveView('MAP')} isActive={activeView === 'MAP'} />
            <NavItem label="Download" data-targetid="download" onClick={e => setActiveView('DOWNLOAD')} isActive={activeView === 'DOWNLOAD'} />
          </NavBar>
        </div>
      </div>
      <div css={cssViewArea({ theme })}>
        {activeView === 'DATASETS' && <List />}
        {activeView === 'EVENTS' && <Table />}
        {activeView === 'MAP' && <Map />}
        {activeView === 'DOWNLOAD' && <p>Download - how does download work? What is the API, what are the formats and options. </p>}
      </div>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);