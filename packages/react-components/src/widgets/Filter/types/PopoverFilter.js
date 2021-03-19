
import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from "react";
import { nanoid } from 'nanoid';
import { Popover as BasePopover } from '../../../components';
import { FilterContext } from '../state';

/*
There is 3 level of abstractions in this
A general component for managing state in popover filters
A general component for popovers of a type (suggest, vocabulary)
A general component for filtering on a specific field (e.g. a taxonKey filter - a conf usage of suggest)
The actual usage of the component (e.g. taxonFilter with props: trigger, placement, modal)

<Popover trigger content ariaLabel placement modal />
<SuggestPopover trigger config placement modal />
<TaxonPopover trigger placement modal />

const config = {DisplayName, filterName, suggestConfig}
const TaxonPopover = (props) => {
  const child = React.Children.only(children);
  return <SuggestPopover trigger={child} config {...props} />
}

const SuggestPopover = ({config, ...props}) => {
  return <Popover content {...props}>
    <FilterContent {...config} />
  </Popover>
}

//Alternatively the individual filter do this
const config = {DisplayName, filterName, suggestConfig}
const TaxonPopover = props => {
  const child = React.Children.only(children);
  return <Popover trigger={child} {...props}>
    <SuggestContent config />
  </Popover>
}
*/
function Popover({ content, placement, modal, children, className, style, ...props }) {
  const [labelledById] = React.useState(nanoid);
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
      style={{ width: '22em', maxWidth: '100%', ...style }}
      aria-labelledby={labelledById}
      placement={placement}
      trigger={child}
      modal={modal}
      className={className}
    >
      {React.cloneElement(content, {
        onApply, onCancel, onFilterChange, labelledById,
        initFilter: currentFilterContext.filter
      })}
    </BasePopover>
  );
}

export default Popover;