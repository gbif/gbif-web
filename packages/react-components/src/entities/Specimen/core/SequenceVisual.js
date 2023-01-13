
import { jsx, css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import { FormattedMessage } from 'react-intl';

const legend = css`
  flex: 1 1 100%;
  margin-top: 8px;
  font-size: 10px;
  display: flex;
  justify-content: space-between;
  color: #626ba9;
`;

const letter = ({color}) => css`
  line-height: 24px;
  flex: 0 0 4px;
  margin: 3px 0;
  background: ${color};
  font-size: 8px;
  width: 6px;
  height: 24px;
  
  /* color: white;
  font-weight: bold;
  padding: 0 2px;
  width: auto; */
`;

const wrapper = css`
  display: flex;
  flex-wrap: wrap;
  background: #010834;
  padding: 24px;
`;

export function SequenceVisual({sequence, ...props}) {
  if (!sequence) return null;
  const parts = sequence.split('');

  const colorMap = {
    T: '#fdfa7c',
    A: '#3e2b68',
    C: '#f04484',
    G: '#3b68dc',
  }
  const defaultColor = '#1d244e';

  return <div css={wrapper}>
    {parts.map((x, i) => {
      return <div key={i} css={letter({color: colorMap[x] || defaultColor})}></div>
    })}
    <div css={legend}>
      <div>
        This occurrence contains sequences. See more
      </div>
      <div>
        <span style={{background: colorMap.A, color: colorMap.C, padding: '1px 3px'}}>A</span>
        <span style={{background: colorMap.C, color: colorMap.A, padding: '1px 3px'}}>C</span>
        <span style={{background: colorMap.G, color: colorMap.T, padding: '1px 3px'}}>G</span>
        <span style={{background: colorMap.T, color: colorMap.G, padding: '1px 3px'}}>T</span>
      </div>
    </div>
  </div>

  // flex: 1 1 100%;
  // margin-top: 8px;
  // font-size: 10px;
  // justify-content: end;
  // display: flex;
}