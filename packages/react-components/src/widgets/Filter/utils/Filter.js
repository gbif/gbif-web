import React from "react";
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import { Prose } from '../../../components/typography/Prose';
import { FilterBodyDescription, FilterBox } from './misc';
import { MenuAction, MenuToggle } from '../../../components/Menu';
import { uncontrollable } from 'uncontrollable';
import get from 'lodash/get';

import { FilterState, FilterContext } from '../state';

function Filter({ children, title, aboutText, labelledById, hasHelpTexts, supportsExist, filterName, formId, filter: tmpFilter, onFilterChange, aboutVisible, onAboutChange, helpVisible, onHelpChange, isExistenceFilter, onExistenceChange, style }) {
  
  return <FilterState filter={tmpFilter} onChange={updatedFilter => onFilterChange(updatedFilter)}>
    <FilterContext.Consumer>
      {({ setField, setFullField, toggle, filter }) => {
        const selectedItems = get(filter, `must.${filterName}`, []).map(x => typeof x === 'object' ? x._id || x.key : x);
        const checkedMap = new Set(selectedItems);
        const summaryProps = {
          count: checkedMap.size,
          onClear: () => setField(filterName, [])
        };
        const footerProps = {
          formId,
          showBack: aboutVisible,
          onBack: () => onAboutChange(false)
        }
        const menuItems = (aboutText || hasHelpTexts || supportsExist) ? menuState => [
          ...aboutText ? [<MenuAction key="About" onClick={() => { onAboutChange(true); menuState.hide() }}>About this filter</MenuAction>] : [],
          ...hasHelpTexts ? [<MenuToggle key="Help" disabled={aboutVisible} style={{ opacity: aboutVisible ? .5 : 1 }} checked={!!helpVisible} onChange={() => onHelpChange(!helpVisible)}>Show help texts</MenuToggle>] : [],
          ...supportsExist ? [<MenuToggle key="Exists" disabled={aboutVisible} style={{ opacity: aboutVisible ? .5 : 1 }} checked={!!isExistenceFilter} onChange={() => { onExistenceChange(!isExistenceFilter); menuState.hide() }}>Filter for existence</MenuToggle >] : [],
        ] : undefined;

        return <FilterBox style={style}>
          <Header menuItems={menuItems} labelledById={labelledById}>
            {title}
          </Header>
          {!aboutVisible &&
            <>
              {children({
                summaryProps,
                footerProps,
                helpVisible,
                setField,
                setFullField,
                toggle,
                filter,
                selectedItems,
                checkedMap,
                isExistenceFilter
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