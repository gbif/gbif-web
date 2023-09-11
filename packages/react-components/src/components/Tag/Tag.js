
import { jsx } from '@emotion/react';
import ThemeContext from '../../style/themes/ThemeContext';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';
import { MdNavigateNext as Arrow } from 'react-icons/md';

export function Tags({
  as: Div = 'div',
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'tags', {/*modifiers goes here*/ }, className);
  return <Div css={styles.tags({ theme })} {...classNames} {...props} />
}
export function Tag({
  as: Span = 'span',
  type = 'light',
  outline = false,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { classNames } = getClasses(theme.prefix, 'tag', { type, outline }, className);
  return <Span css={styles.tag({ theme, type, outline })} {...classNames} {...props} />
};

Tag.propTypes = {
  as: PropTypes.element
};

export function Alert({
  as: Div = 'div',
  tagType,
  tagText,
  children,
  className,
  ...props
}) {
  const isLink = !!props.href;
  const { classNames } = getClasses('gbif', 'tags', {/*modifiers goes here*/ }, className);
  return <Div css={styles.alert({ type: tagType, isLink })} {...classNames} {...props}>
    {tagText && <Tag type={tagType}>{tagText}</Tag>}
    <div>{children}</div>
    {isLink && <Arrow style={{fontSize: '1.5em'}} />}
  </Div>
}

Alert.propTypes = {
  as: PropTypes.element
};