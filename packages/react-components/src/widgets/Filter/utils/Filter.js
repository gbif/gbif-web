import React, { useEffect } from "react";
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import { Prose } from '../../../components/typography/Prose';
import { FilterBodyDescription, FilterBox } from './misc';
import { MenuAction, MenuToggle } from '../../../components/Menu';
import { uncontrollable } from 'uncontrollable';
import get from 'lodash/get';
import { hash } from '../../../utils/util';
import { FormattedMessage } from 'react-intl';

import { FilterState, FilterContext } from '../state';

function Filter({ children, title, aboutText, labelledById, hasHelpTexts, supportsExist, filterName, formId, filter: tmpFilter, onFilterChange, aboutVisible, onAboutChange, helpVisible, onHelpChange, isExistenceFilter, onExistenceChange, isNegated, style }) {
  const type  = isNegated ? 'must_not' : 'must';
  
  //When mounting, then check the filter. If it is an existence filter then show those
  useEffect(() => {
    const mustType = get(tmpFilter, `must.${filterName}[0].type`) === 'isNotNull';
    const mustNotType = get(tmpFilter, `must_not.${filterName}[0].type`) === 'isNotNull';
    if (!isExistenceFilter && (mustType || mustNotType)) {
      onExistenceChange(true);
    } else {
      onExistenceChange(false);
    }
  }, []);

  return <FilterState filter={tmpFilter} onChange={updatedFilter => onFilterChange(updatedFilter)}>
    <FilterContext.Consumer>
      {({ setField, negateField, setFullField, toggle, filter }) => {
        const selectedItems = get(filter, `${type}.${filterName}`, []).map(x => typeof x === 'object' ? hash(x) : x);
        const checkedMap = new Set(selectedItems);
        const summaryProps = {
          count: checkedMap.size,
          onClear: () => setFullField(filterName, [], [])
        };
        const footerProps = {
          formId,
          showBack: aboutVisible,
          onBack: () => onAboutChange(false)
        }
        const menuItems = (aboutText || hasHelpTexts || supportsExist) ? menuState => [
          ...aboutText ? [
            <MenuAction key="About" onClick={() => { onAboutChange(true); menuState.hide() }}>
              <FormattedMessage id="filterSupport.aboutThisFilter" defaultMessage="About this filter" />
            </MenuAction>] : [],
          ...hasHelpTexts ? [<MenuToggle key="Help" disabled={aboutVisible} style={{ opacity: aboutVisible ? .5 : 1 }} checked={!!helpVisible} onChange={() => onHelpChange(!helpVisible)}>
            <FormattedMessage id="filterSupport.showHelp" defaultMessage="Show help text" />
          </MenuToggle>] : [],
          ...supportsExist ? [<MenuToggle key="Exists" disabled={aboutVisible} style={{ opacity: aboutVisible ? .5 : 1 }} checked={!!isExistenceFilter} onChange={() => { if (isExistenceFilter) { setFullField(filterName, [], []);} onExistenceChange(!isExistenceFilter); menuState.hide() }}>
            <FormattedMessage id="filterSupport.existence" defaultMessage="Filter for existence" />
          </MenuToggle >] : [],
        ] : undefined;

        return <FilterBox style={style}>
          <Header menuItems={menuItems} labelledById={labelledById}>
            {title}
          </Header>
          {!aboutVisible &&
            <>
              {children({
                formId,
                summaryProps,
                footerProps,
                helpVisible,
                setField,
                setFullField,
                toggle,
                filter,
                selectedItems,
                checkedMap,
                isExistenceFilter,
                negateField
              })}
            </>}
          {aboutVisible && <>
            <Prose as={FilterBodyDescription}>
              {aboutText}
            </Prose>
            <Footer {...footerProps} />
          </>}
        </FilterBox>
      }}
    </FilterContext.Consumer>
  </FilterState>
}

Filter.propTypes = {
  children: PropTypes.func,
  onFilterChange: PropTypes.func,
  onAboutChange: PropTypes.func,
  onHelpChange: PropTypes.func,
  title: PropTypes.node,
  aboutText: PropTypes.node,
  hasHelpTexts: PropTypes.bool,
  aboutVisible: PropTypes.bool,
  helpVisible: PropTypes.bool,
  filterName: PropTypes.string,
  filter: PropTypes.object,
  formId: PropTypes.string,
}

export const UncontrollableFilter = uncontrollable(Filter, {
  aboutVisible: 'onAboutChange',
  helpVisible: 'onHelpChange',
  isExistenceFilter: 'onExistenceChange',
  filter: 'onFilterChange'
});

export default UncontrollableFilter;