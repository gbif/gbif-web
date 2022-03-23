import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';
import { IdentifierBadge } from '../IdentifierBadge';
import licenses from '../../enums/basic/license.json';

const url2enum = {
  '//creativecommons.org/publicdomain/zero/1.0/legalcode': 'CC0_1_0',
  '//creativecommons.org/licenses/by/4.0/legalcode': 'CC_BY_4_0',
  '//creativecommons.org/licenses/by-nc/4.0/legalcode': 'CC_BY_NC_4_0'
};
const enum2url = {
  'CC0_1_0': '//creativecommons.org/publicdomain/zero/1.0/legalcode',
  'CC_BY_4_0': '//creativecommons.org/licenses/by/4.0/legalcode',
  'CC_BY_NC_4_0': '//creativecommons.org/licenses/by-nc/4.0/legalcode'
};


export function LicenseTag({
  value,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const val = value.replace(/http(s)?:/, '');
  let licenceEnum = url2enum[val] || value;
  if (licenses.indexOf(licenceEnum) === -1) licenceEnum = 'UNSUPPORTED';
  const url = enum2url[licenceEnum];
  // if (url) {
  //   return <a href={url} css={styles.licenseTag({theme})} {...props}>
  //   <FormattedMessage id={`enums.license.${licenceEnum}`} />
  // </a>
  // }
  // return <span css={styles.licenseTag({theme})} {...props}>
  //   <FormattedMessage id={`enums.license.${licenceEnum}`} />
  // </span>

  const licenseProps = url ? {as: 'a', href: url} : {};

  return <IdentifierBadge {...licenseProps} {...props}>
    <span>License</span>
    <span><FormattedMessage id={`enums.license.${licenceEnum}`} /></span>
  </IdentifierBadge>
};

LicenseTag.propTypes = {
  as: PropTypes.element
};
