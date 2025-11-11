import { jsx } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { getClasses } from '../../utils/util';
import * as styles from './styles';

export function TextThumbnail({
  className,
  text,
  id,
  ...props
}) {
  const { classNames } = getClasses('gbif', 'textThumbnail', {/*modifiers goes here*/ }, className);
  let clipText = text;
  let lineLength = Math.ceil(Math.sqrt(text.length));
  if (text.length === 3) lineLength = 3;
  let texts = [];
  while (clipText.length > 0) {
    texts.push(clipText.substring(0, lineLength));
    clipText = clipText.substring(lineLength);
  }

  return <div css={styles.textThumbnail({ fontModifier: texts.length, id: id || text })} {...classNames} {...props}>
    {texts.map((t, i) => <div key={`${t}_${i}`}>{t}</div>)}
  </div>
};

TextThumbnail.propTypes = {
  text: PropTypes.string,
  id: PropTypes.string
};