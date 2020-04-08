/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import PropTypes from 'prop-types';
import { LevelItem, LevelLeft, LevelRight } from './LevelChildren';

const Level = ({
  as: Lvl,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  return <Lvl css={css`
        align-items: center;
        justify-content: space-between;
        img {
          display: inline-block;
          vertical-align: top;
        }
        @media screen and (min-width: 769px), print {
          display: flex;
        }
      `} {...props}>
      </Lvl>
}

Level.displayName = 'Level'

Level.defaultProps = {
  as: 'nav'
}

Level.propTypes = {
  as: PropTypes.node,
  className: PropTypes.string,
  // danger: PropTypes.bool,
  // outlined: PropTypes.bool,
  // primary: PropTypes.bool,
  // loading: PropTypes.bool,
}

Level.Item = LevelItem;
Level.Left = LevelLeft;
Level.Right = LevelRight;

export default Level