
import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
// import { FormattedMessage, FormattedNumber } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter } from '../Layout.styles';
import { Tabs, DataHeader, NavBar, NavItem, ErrorBoundary, LoginButton } from '../../components'
import { FilterBar } from '../FilterBar';
// import FilterBar from './FilterBar';
import { FormattedMessage } from 'react-intl';
import RulesWrapper from './rules/Rules';
import ProjectWrapper from './projects/Projects';
import { StringParam, useQueryParam } from 'use-query-params';
import RulesetWrapper from './rulesets/Rulesets';

const Layout = ({
  className = '',
  config,
  Table,
  ...props
}) => {
  const [activeView = 'RULES', setActiveView] = useQueryParam('view', StringParam);
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'searchLayout';

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })} style={{ margin: '0 0 10px 0', borderRadius: 0 }}>
        <DataHeader availableCatalogues={config?.availableCatalogues} style={{ borderBottom: '1px solid #ddd' }}
        right={<LoginButton style={{margin: '0 8px'}} />}>
          <NavBar style={{ marginLeft: 10 }}>
            <NavItem label={<FormattedMessage id="search.tabs.rules" defaultMessage="Rules" />} data-targetid="rules" onClick={e => setActiveView('RULES')} isActive={activeView === 'RULES'} />
            <NavItem label={<FormattedMessage id="search.tabs.projects" defaultMessage="Projects" />} data-targetid="projects" onClick={e => setActiveView('PROJECTS')} isActive={activeView === 'PROJECTS'} />
            <NavItem label={<FormattedMessage id="search.tabs.rulesets" defaultMessage="Rulesets" />} data-targetid="rulesets" onClick={e => setActiveView('RULESETS')} isActive={activeView === 'RULESETS'} />
          </NavBar>
        </DataHeader>
        {activeView === 'RULES' && <div css={cssFilter({ theme })}>
          <FilterBar config={config}></FilterBar>
        </div>}
      </div>
      <div css={cssViewArea({ theme })}>
        {activeView === 'RULES' && <RulesWrapper />}
        {activeView === 'PROJECTS' && <ProjectWrapper />}
        {activeView === 'RULESETS' && <RulesetWrapper />}
      </div>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);
