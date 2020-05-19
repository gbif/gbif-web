import React from "react";
import PropTypes from 'prop-types';
import Header from './Header';
import Footer from './Footer';
import { Prose } from '../../../components/typography/Prose';
import { FilterBodyDescription, FilterBox } from './misc';
import { MenuAction, MenuToggle } from '../../../components/Menu';
import { uncontrollable } from 'uncontrollable';
import get from 'lodash/get';

import {FilterState, FilterContext} from '../state';

function Filter({ children, onApply, onCancel, title, aboutText, hasHelpTexts, filterName, formId, filter: tmpFilter, onFilterChange, aboutVisible, onAboutChange, helpVisible, onHelpChange, style }) {
  return <FilterState filter={tmpFilter} onChange={updatedFilter => onFilterChange(updatedFilter)}>
    <FilterContext.Consumer>
      {({ setField, toggle, filter }) => {
        const selectedItems = get(filter, `must.${filterName}`, []);
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
        return <FilterBox style={style}>
          <Header menuItems={menuState => [
            ...aboutText ? [<MenuAction key="About" onClick={() => { onAboutChange(true); menuState.hide() }}>About this filter</MenuAction>] : [],
            ...hasHelpTexts ? [<MenuToggle key="Help" disabled={aboutVisible} style={{ opacity: aboutVisible ? .5 : 1 }} checked={!!helpVisible} onChange={() => onHelpChange(!helpVisible)}>Show help texts</MenuToggle>] : []
          ]}>
            {title}
          </Header>
          {!aboutVisible &&
            <>
              {children({
                  summaryProps,
                  footerProps,
                  helpVisible, 
                  setField, 
                  toggle, 
                  filter, 
                  selectedItems, 
                  checkedMap })}
            </>}
          {aboutVisible && <>
            <Prose as={FilterBodyDescription}>
              {aboutText}
            </Prose>
            <Footer {...footerProps}/>
          </>}
        </FilterBox>
      }}
    </FilterContext.Consumer>
  </FilterState>
}

Filter.propTypes = {
  children: PropTypes.func,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
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
  filter: 'onFilterChange'
});

export default UncontrollableFilter;