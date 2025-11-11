
import { jsx, css } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { HyperText } from '../HyperText/HyperText';
import { Tooltip } from '../Tooltip/Tooltip';
import { MdOutlineInfo } from 'react-icons/md';
import PropTypes from 'prop-types';
import useBelow from '../../utils/useBelow';
import { dl, dt, dd } from './styles';
import { bulletList } from '../../style/shared';

export function Properties({ as: Dl = 'dl', breakpoint, horizontal, dense = false, ...props }) {
  const isBelow = useBelow(breakpoint);
  const theme = useContext(ThemeContext);
  return <Dl css={dl({ theme, horizontal: typeof horizontal !== 'undefined' ? horizontal : !isBelow, dense })} {...props} />
}

Properties.propTypes = {
  as: PropTypes.any,
  horizontal: PropTypes.bool
};

export function Term({ as: Dt = 'dt', ...props }) {
  const theme = useContext(ThemeContext);
  return <Dt css={dt({ theme, props })} {...props} />
}
Term.propTypes = {
  as: PropTypes.any
};

export function Value({ as: Dd = 'dd', ...props }) {
  const theme = useContext(ThemeContext);
  return <Dd css={dd({ theme })} {...props} />
}
Value.propTypes = {
  as: PropTypes.any
};

Properties.Term = Term;
Properties.Value = Value;
Properties.EmptyValue = EmptyValue;

export function Property({ value, helpText, helpTextId, labelId, children, ...props }) {
  // if there is no value, and the user do not ask to show empty values, then do not show anything
  if ((typeof value === 'undefined' || value === null || (Array.isArray(value) && value.length === 0)) && !children) {
    if (!props.showEmpty) return null;
  }
  return <>
    <Term><PropertyLabel id={labelId} {...{ helpText, helpTextId }} /></Term>
    <Value>{children || <AutomaticPropertyValue value={value} {...props} />}</Value>
  </>
}

function AutomaticPropertyValue({ value, formatter, showEmpty, sanitizeOptions = { ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }, ...props }) {
  if (!value) {
    if (showEmpty) return <EmptyValue />;
    return null;
  }
  let val = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      if (showEmpty) return <EmptyValue />;
      return null;
    }
    val = <ul css={bulletList}>
      {value.map((v, i) => <li key={i}><AutomaticPropertyValue value={v} formatter={formatter} {...props} /></li>)}
    </ul>
  } else if (typeof formatter === 'function') {
    val = formatter(value);
  } else if (typeof value === 'number') {
    val = <FormattedNumber value={value} />
  } else if (typeof value === 'string') {
    val = <HyperText text={value} inline {...props} />
  }
  return val;
}

export function EmptyValue() {
  return <span css={css`color: #aaa; font-style: italic;`}><FormattedMessage id="phrases.noInformation" defaultMessage="No information" /></span>
}

export function PropertyLabel({ id, helpText, helpTextId, ...props }) {
  return <span {...props}>
    <FormattedMessage id={id} defaultMessage={id} />
    {(helpTextId || helpText) && <Tooltip title={helpText || <FormattedMessage id={helpTextId} defaultMessage={helpTextId} />}>
      <span>
        <MdOutlineInfo css={css`position: relative; top: .15em; margin-left: 4px;`} />
      </span>
    </Tooltip>}
  </span>;
}