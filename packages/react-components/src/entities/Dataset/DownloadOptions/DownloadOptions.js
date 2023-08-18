
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Button } from '../../../components';

export function DownloadOptions({
  dataset,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);

  return <div>
    <div css={css.options({ theme })}>
      <div>
        <div css={css.card({ theme })}>
          <h4>GBIF annotated occurrence archive</h4>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
          <Button>Interpreted occurrences</Button>
        </div>
      </div>

      <div>
        <div css={css.card({ theme })}>
          <h4>Source archive</h4>
          <div>
            The source archive is the data as published to GBIF. It contains information lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </div>
          <Button appeance="outline">source archive</Button>
        </div>
      </div>
    </div>
    <div>
      <div>
        <Button look="text">Download processed EML</Button>
      </div>
    </div>
  </div>
};
