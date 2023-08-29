import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { HyperText } from '../HyperText/HyperText';

export function Message({
  id, defaultMessage, values,
  ...props
}) {
  const { formatMessage } = useIntl();
  const dirty = formatMessage({ ...{id, defaultMessage, values} });
  return <HyperText text={dirty} {...props}/>
};

export function Unknown({id = 'phrases.unknown', ...props}) {
  return <span style={{color: 'var(--color200)'}}><FormattedMessage id={id} {...props} /></span>
}