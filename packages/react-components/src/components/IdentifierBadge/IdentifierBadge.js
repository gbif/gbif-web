
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';

export const IdentifierBadge = React.forwardRef(({
  as: Div = 'div',
  className,
  ...props
}, ref) => {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'identifierBadge', {/*modifiers goes here*/}, className);
  return <Div ref={ref} {...classNames} css={styles.identifierBadge} {...props} />
});

export function Doi({id = '', ...props}) {
  let sanitizedId = id.replace(/^(.*doi.org\/)?(doi:)?(10\.)/, '10.');
  return <IdentifierBadge as="a" href={`https://doi.org/${sanitizedId}`} {...props}>
    <span>DOI</span>
    <span>{sanitizedId}</span>
  </IdentifierBadge>
}

IdentifierBadge.propTypes = {
  as: PropTypes.string
};
