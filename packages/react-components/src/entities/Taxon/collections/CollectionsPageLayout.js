import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { withFilter } from '../../../widgets/Filter/state';
import { FormattedMessage } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter } from './Layout.styles';
import { Button, Tabs, DataHeader, NavBar, NavItem } from '../../../components';
import { FilterBar } from '../../../search/FilterBar';
import { useQueryParam, StringParam } from 'use-query-params';

const Layout = ({
  className = '',
  config,
  Table,
  Map,
  tabs = ['TABLE', 'MAP'],
  ...props
}) => {
  const [activeView = tabs[0] || 'TABLE', setActiveView] = useQueryParam(
    'view',
    StringParam
  );
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'searchLayout';

  const tabComponents = {
    TABLE: (
      <NavItem
        key={`TABLE_TAB`}
        label={
          <FormattedMessage id='search.tabs.table' defaultMessage='table' />
        }
        data-targetid='table'
        onClick={(e) => setActiveView('TABLE')}
        isActive={activeView === 'TABLE'}
      />
    ),
    MAP: (
      <NavItem
        key={`MAP_TAB`}
        label={<FormattedMessage id='search.tabs.map' defaultMessage='Map' />}
        data-targetid='map'
        onClick={(e) => setActiveView('MAP')}
        isActive={activeView === 'MAP'}
      />
    ),
    // DOWNLOAD: <NavItem key={`DOWNLOAD_TAB`} label="Download" data-targetid="download" onClick={e => setActiveView('DOWNLOAD')} isActive={activeView === 'DOWNLOAD'} />
  };

  return (
    <div
      className={`${className} ${prefix}-${elementName}`}
      css={cssLayout({ theme })}
      {...props}
    >
      <Tabs activeId={activeView} onChange={setActiveView}>
        <div
          css={cssNavBar({ theme })}
          style={{ margin: '0 0 10px 0', borderRadius: 0 }}
        >
          <DataHeader
            availableCatalogues={config.availableCatalogues}
            style={{ borderBottom: '1px solid #ddd' }}
          />
          <div css={cssFilter({ theme })}>
            <FilterBar config={config}></FilterBar>
          </div>
          {tabs.length > 1 && (
            <div>
              <NavBar style={{ marginLeft: 10 }}>
                {tabs.map((tab) => tabComponents[tab])}
              </NavBar>
            </div>
          )}
        </div>
        <div css={cssViewArea({ theme })}>
          {activeView === 'TABLE' && <Table />}
          {activeView === 'MAP' && <Map />}
          {/* {activeView === 'DOWNLOAD' && <Download />} */}
        </div>
      </Tabs>
    </div>
  );
};

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);
