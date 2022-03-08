
import { css, jsx } from '@emotion/react';
import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import ThemeContext from '../style/themes/ThemeContext';
import { Skeleton } from '../components';

export const ResultsHeader = ({ children, total, loading, message, props }) => {
  const theme = useContext(ThemeContext);
  const showSkeleton = loading || typeof total !== 'number';

  return <div css={css`
    color: ${theme.color500};
    font-size: 12px;
    margin: 0 0 4px 4px;
  `} {...props}>
    {showSkeleton && <Skeleton style={{ width: 100 }} />}
    {!showSkeleton && <FormattedMessage id={message || "counts.nResults"} values={{ total }} />}
    {children}
  </div>
}