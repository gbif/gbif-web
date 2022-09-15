import { css, jsx } from '@emotion/react';
import React, { useContext } from "react";
import PropTypes from 'prop-types';
import { TextButton, Tooltip, ResourceLink } from '../../../components';
import { FormattedMessage } from 'react-intl';
import { AiOutlinePlusCircle as AddIcon } from 'react-icons/ai';
import { MdLink } from 'react-icons/md';

import { FilterContext } from '../state';

export function InlineFilterChip({ filterName, values, children, addIcon, ...props }) {
  const currentFilterContext = useContext(FilterContext);
  return <Tooltip placement="right" title={<span><FormattedMessage id="filterSupport.setFilter" /></span>}>
    <TextButton as="span" look="textHover" style={{marginRight: children ? null : 4}} onClick={e => {
      currentFilterContext.setField(filterName, values, true);
      e.preventDefault();
      e.stopPropagation();
    }
    } {...props}>
      {children}
      {addIcon && <span style={{ color: '#888', margin: children ? '0 3px' : null}} data-loader>
        <AddIcon />
      </span>}
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

export function LinkOption({ children, ...props }) {
  return <span css={linkOption}>
    <ResourceLink {...props} data-loader>
      <MdLink/>
    </ResourceLink>
    {children}
  </span>
}

const linkOption = css`
  &:has(>a:hover) {
    text-decoration: underline;
  }
  a:first-of-type {
    margin-right: .5em;
  }
`;