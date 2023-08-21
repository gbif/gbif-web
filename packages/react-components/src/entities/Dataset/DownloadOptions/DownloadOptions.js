
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Button, Message } from '../../../components';
import LocaleContext from '../../../dataManagement/LocaleProvider/LocaleContext';
import env from '../../../../.env.json';

export function DownloadOptions({
  dataset,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const localeSettings = useContext(LocaleContext);
  const localePrefix = localeSettings?.localeMap?.gbif_org;

  const fullPredicate = {
    type: 'equals',
    key: 'datasetKey',
    value: dataset.key
  };

  const dwcAEndpoint = dataset.endpoints.find(function(e) {
    return e.type == 'DWC_ARCHIVE';
  });

  return <div>
    <div css={css.options({ theme })}>
      <div>
        <div css={css.card({ theme })}>
          <h4>GBIF annotated occurrence archive</h4>
          <div>
            <p>
              Download the occurrence records after GBIF processing. During processing, names, dates etc are normalised. The data is also enriched with information from other sources.
            </p>
            <p>
              Be aware that an account is needed to download the content.
            </p>
          </div>
          <Button
            as="a"
            href={`${env.GBIF_ORG}/${localePrefix ? `${localePrefix}/` : ''}occurrence/download/request?predicate=${encodeURIComponent(JSON.stringify(fullPredicate))}#create`}
            appearance="primary"><Message id="download.continueToGBIF" /></Button>
        </div>
      </div>

      {dwcAEndpoint && <div>
        <div css={css.card({ theme })}>
          <h4>Source archive</h4>
          <div>
            The source archive is the data as published to GBIF. For checklists, this is the natural choice.
          </div>
          <Button as="a" appeance="outline" href={`${dwcAEndpoint.url}`} rel="noopener noreferrer">source archive</Button>
        </div>
      </div>}
    </div>
    <div>
      <div style={{color: "#888"}}>
        <p>
          For diagnostics you might want to look at the EML record after normalisation. <a href={`${env.API_V1}/dataset/${dataset.key}/document`}>Download processed EML</a>
        </p>
      </div>
    </div>
  </div>
};
