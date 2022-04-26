import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import styles from './styles';
import Map from './test/index';

export function OccurrenceMap({
  rootPredicate,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'occurrenceMap', {/*modifiers goes here*/}, className);
  // return <Div css={styles.occurrenceMap({theme})} {...props} />
  return <Map {...{classNames, rootPredicate}} />
};

OccurrenceMap.propTypes = {
  as: PropTypes.element
};
