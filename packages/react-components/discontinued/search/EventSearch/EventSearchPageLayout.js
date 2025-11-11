
import {css, jsx} from '@emotion/react';
import React, { useState, useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import {FilterContext, withFilter} from '../../widgets/Filter/state';
import { FormattedMessage } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter } from './Layout.styles';
import { Button, Tabs, DataHeader, NavBar, NavItem, Row, Col } from '../../components'
import { FilterBar } from '../FilterBar';
import { useQueryParam, StringParam } from 'use-query-params';
import GraphQLApiInfo from "./views/Api";
import SiteContext from "../../dataManagement/SiteContext";

const Layout = ({
  className = '',
  config,
  List,
  Table,
  Map,
  Download,
  Sites,
  tabs = ['DATASETS', 'EVENTS', 'SITES', 'MAP', 'DOWNLOAD'],
  ...props
}) => {
  const [activeView = tabs[0] || 'DATASETS', setActiveView] = useQueryParam('view', StringParam);
  const theme = useContext(ThemeContext);
  const {event: eventConfig} = useContext(SiteContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'searchLayout';

  const tabComponents = {
    DATASETS: <NavItem key={`DATASET_TAB`} label={<FormattedMessage id="search.tabs.datasets" defaultMessage="Datasets"/>} data-targetid="dataset" onClick={e => setActiveView('DATASETS')} isActive={activeView === 'DATASETS'} />,
    EVENTS: <NavItem key={`EVENTS_TAB`} label={<FormattedMessage id="search.tabs.events" defaultMessage="Events"/>} data-targetid="events" onClick={e => setActiveView('EVENTS')} isActive={activeView === 'EVENTS'} />,
    SITES: <NavItem key={`SITES_TAB`} label={<FormattedMessage id="search.tabs.sites" defaultMessage="Sites"/>} data-targetid="sites" onClick={e => setActiveView('SITES')} isActive={activeView === 'SITES'} />,
    MAP: <NavItem key={`MAP_TAB`} label={<FormattedMessage id="search.tabs.map" defaultMessage="Map"/>} data-targetid="map" onClick={e => setActiveView('MAP')} isActive={activeView === 'MAP'} />,
    DOWNLOAD: <NavItem key={`DOWNLOAD_TAB`} label="Download" data-targetid="download" onClick={e => setActiveView('DOWNLOAD')} isActive={activeView === 'DOWNLOAD'} />
  }

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme }) } {...props}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      {tabs.length > 1 &&
        <div  css={css`display:flex; justify-content: stretch`}>
          <NavBar style={{ marginLeft: 10, width:"100%"}} >
            {tabs.map(tab => tabComponents[tab])}
          </NavBar>
          { eventConfig.enableGraphQLAPI && (activeView === 'DATASETS' || activeView === 'EVENTS' ||activeView === 'SITES') && <GraphQLApiInfo/>}
      </div>}
      <div css={cssNavBar({ theme })} style={{ margin: '0 0 10px 0', borderRadius: 0 }}>
        <DataHeader availableCatalogues={config.availableCatalogues} style={{ borderBottom: '1px solid #ddd' }} />
        <div css={cssFilter({ theme })} >
          <FilterBar config={config}></FilterBar>
        </div>
      </div>
      <div css={cssViewArea({ theme })}>
        {activeView === 'DATASETS' && <List />}
        {activeView === 'EVENTS' && <Table />}
        {activeView === 'SITES' && <Sites />}
        {activeView === 'MAP' && <Map />}
        {activeView === 'DOWNLOAD' && <Download />}
      </div>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);