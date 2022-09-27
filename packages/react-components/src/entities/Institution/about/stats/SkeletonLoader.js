import { jsx, css } from '@emotion/react';
import React from 'react';
import { Skeleton } from '../../../../components'

export function SkeletonLoader({lines = 5, ...props}) {
  return <>
    <h4><Skeleton /></h4>
    <div>
      {Array(lines).fill().map((x, i ) => <Skeleton key={i} width="random" css={css`margin-bottom: .7em;`}/>)}
    </div>
  </>
};
