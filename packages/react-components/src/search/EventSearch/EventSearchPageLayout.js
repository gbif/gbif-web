
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
  Table,
  ...props
}) => {
  const [activeView = 'TABLE', setActiveView] = useQueryParam('view', StringParam);
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
            <NavItem label={<FormattedMessage id="search.tabs.table" defaultMessage="Table"/>} data-targetid="table" onClick={e => setActiveView('TABLE')} isActive={activeView === 'TABLE'} />
            <NavItem label={<FormattedMessage id="search.tabs.map" defaultMessage="Map"/>} data-targetid="map" onClick={e => setActiveView('MAP')} isActive={activeView === 'MAP'} />
            <NavItem label="Download" data-targetid="download" onClick={e => setActiveView('DOWNLOAD')} isActive={activeView === 'DOWNLOAD'} />
          </NavBar>
        </div>
      </div>
      <div css={cssViewArea({ theme })}>
        {activeView === 'TABLE' && <Table />}
        {activeView === 'MAP' && <h1>Dave: "We need a placeholder for the map"</h1>}
        {activeView === 'DOWNLOAD' && <h1>Dave: "We need a placeholder for downloads ... <br /><br />make sure it includes an option to download site/species matrixes"</h1>}
      </div>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);