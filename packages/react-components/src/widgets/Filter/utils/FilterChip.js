import React, { useContext } from "react";
import PropTypes from 'prop-types';
import { Button, TextButton, Tooltip } from '../../../components';
import { FormattedMessage } from 'react-intl';

import { FilterContext } from '../state';

export function InlineFilterChip({ filterName, values, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  return <Tooltip title={<span><FormattedMessage id="filterSupport.updateFilter" /></span>}>
    <Button
      look="primaryOutline"
      as="span"
      onClick={e => currentFilterContext.setField(filterName, values, true)}
      style={{
        padding: '1px 5px',
        color: 'inherit'
      }} 
      {...props}
       />
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
