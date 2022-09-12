import React, { useContext } from "react";
import PropTypes from 'prop-types';
import { Button, TextButton, Tooltip } from '../../../components';
import { FormattedMessage } from 'react-intl';
import { AiOutlinePlusCircle as AddIcon } from 'react-icons/ai';

import { FilterContext } from '../state';

export function InlineFilterChip({ filterName, values, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  return <Tooltip placement="right" title={<span><FormattedMessage id="filterSupport.updateFilter" /></span>}>
    {/* <Button
      look="primaryOutline"
      as="span"
      onClick={e => currentFilterContext.setField(filterName, values, true)}
      style={{
        padding: '1px 5px',
        color: 'inherit',
        position: 'inherit',
        borderColor: '#888'
      }} 
      {...props}
       /> */}
       <TextButton as="span" look="textHover" onClick={e => currentFilterContext.setField(filterName, values, true)}>
       {props.children} <span style={{color: '#888', marginLeft: 4, position: 'relative', top: '.2em' }} data-loader>
          <AddIcon />
        </span>
        </TextButton>
  </Tooltip>
}

export function InlineFilter({ filterName, values, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  return <Tooltip title={<span><FormattedMessage id="filterSupport.updateFilter" /></span>}>
    <TextButton
      as="span"
      look="text"
      onClick={e => {
        currentFilterContext.setField(filterName, values, true);
      }}
      {...props}
       />
  </Tooltip>
}
