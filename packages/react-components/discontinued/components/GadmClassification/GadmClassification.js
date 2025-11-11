
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
// import styles from './styles';
import { Classification } from '../Classification/Classification';

export function GadmClassification({
  gadm,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  if (!gadm) return <span>Unknown</span>
  const { classNames } = getClasses(theme.prefix, 'gadmClassification', {/*modifiers goes here*/ }, className);
  return <Classification {...classNames} {...props}>
    {[0, 1, 2, 3, 4].map(n => {
      const level = gadm[`level${n}`];
      return level ? <span key={n}>{level.name}</span> : null;
    })}
  </Classification>
};

GadmClassification.propTypes = {
  as: PropTypes.element
};

<Classification>
  <span>higher</span>
  <span>middle</span>
  <span>lower</span>
</Classification>