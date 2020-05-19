/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState, useContext, useEffect, useCallback } from "react";
import { Popover as BasePopover } from '../../../components';
import { FilterContext } from '../state';

/*
There is 3 level of abstractions in this
A general component for managing state in popover filters
A general component for popovers of a type (suggest, vocabulary)
A general component for filtering on a specific field (e.g. a taxonKey filter - a conf usage of suggest)
The actual usage of the component (e.g. taxonFilter with props: trigger, placement, modal)
*/
function getPopover({ ariaLabel, Content }) {
  return function Popover({ placement, modal, children, ...contentProps }) {
    const currentFilterContext = useContext(FilterContext);
    const [tmpFilter, setFilter] = useState(currentFilterContext.filter);
    const child = React.Children.only(children);

    useEffect(() => {
      setFilter(currentFilterContext.filter);
    }, [currentFilterContext.filter]);

    const onApply = useCallback(({ filter, hide }) => {
      currentFilterContext.setFilter(filter);
      hide();
    }, [currentFilterContext]);

    const onCancel = useCallback(({ hide }) => {
      hide();
    }, []);

    const onFilterChange = useCallback(filter => {
      setFilter(filter);
    }, []);

    return (
      <BasePopover
        onClickOutside={popover => { currentFilterContext.setFilter(tmpFilter); popover.hide() }}
        style={{ width: '22em', maxWidth: '100%' }}
        aria-label={ariaLabel}
        placement={placement}
        trigger={child}
        modal={modal}
      >
        <Content 
          onApply={onApply}
          onCancel={onCancel}
          onFilterChange={onFilterChange}
          initFilter={currentFilterContext.filter}
          {...contentProps}
          />
      </BasePopover>
    );
  }
}

export default getPopover;