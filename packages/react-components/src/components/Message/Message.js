import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import DOMPurify from 'dompurify';// consider using isomorphic-dompurify instead. the foot print seem to be the same
import PropTypes from 'prop-types';

export function Message({
  allowNewLines,
  allowedTags,
  allowedAttr,
  textComponent,
  isHTML,
  values = {},
  ...props
}) {
  const { formatMessage } = useIntl();
  if (isHTML || allowedTags) {
    const Comp = textComponent || 'div';
    const dirty = formatMessage({ ...props, values });
    let options = {
      ALLOWED_TAGS: allowedTags || ['i', 'br', 'a'],
      ALLOWED_ATTR: allowedAttr || ['href']
    };
    var sanitized = DOMPurify.sanitize(dirty, options);

    return <Comp dangerouslySetInnerHTML={{ __html: sanitized }} />
  } else {
    if (allowNewLines) {
      values.br = <br />
    }
    // if (allowedTags) {
    //   allowedTags.forEach(t => {
    //     const Tag = t;
    //     values[t] = chunks => <Tag>{chunks}</Tag>
    //   });
    // }
  }
  return <FormattedMessage {...props} values={values} />
};
