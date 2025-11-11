import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import env from '../../../../.env.json';
import { Button, Message } from '../../../components';
import LocaleContext from '../../../dataManagement/LocaleProvider/LocaleContext';
import ThemeContext from '../../../style/themes/ThemeContext';
import { Card, CardHeader3 } from '../../shared';
import * as css from './styles';

export function DownloadOptions({ data, className, ...props }) {
  const theme = useContext(ThemeContext);
  const localeSettings = useContext(LocaleContext);
  const localePrefix = localeSettings?.localeMap?.gbif_org;
  const { dataset, occurrenceSearch } = data;
  const total = occurrenceSearch?.documents?.total;

  const fullPredicate = {
    type: 'equals',
    key: 'datasetKey',
    value: dataset.key,
  };

  const dwcAEndpoint = dataset.endpoints.find(function (e) {
    return e.type == 'DWC_ARCHIVE';
  });

  return (
    <div>
      <div css={css.options({ theme })}>
        {!!total && (
          <div>
            <Card>
              <CardHeader3>
                <FormattedMessage id="dataset.processedOccurrences" />
              </CardHeader3>
              <div>
                <Message id="dataset.processedOccurrencesDescription" />
              </div>
              <Button
                as="a"
                href={`${env.GBIF_ORG}/${
                  localePrefix ? `${localePrefix}/` : ''
                }occurrence/download/request?predicate=${encodeURIComponent(
                  JSON.stringify(fullPredicate),
                )}#create`}
                appearance="primary"
              >
                <Message id="download.continueToGBIF" inline />
              </Button>
            </Card>
          </div>
        )}

        {dataset?.checklistBankDataset?.key && (
          <div>
            <Card>
              <CardHeader3>
                <FormattedMessage id="dataset.checklistBankDownload" />
              </CardHeader3>
              <Message id="dataset.checklistBankDownloadDescription" />
              <Button
                as="a"
                appeance="outline"
                href={`${env.CHECKLIST_BANK_WEBSITE}/dataset/gbif-${dataset.key}/download`}
                rel="noopener noreferrer"
              >
                Checklist Bank
              </Button>
            </Card>
          </div>
        )}

        {dwcAEndpoint && (
          <div>
            <Card>
              <CardHeader3>
                <FormattedMessage id="dataset.originalArchive" />
              </CardHeader3>
              <Message id="dataset.originalArchiveDescription" />
              <Button
                as="a"
                appeance="outline"
                href={`${dwcAEndpoint.url}`}
                rel="noopener noreferrer"
              >
                source archive
              </Button>
            </Card>
          </div>
        )}
      </div>
      <div>
        <div style={{ color: '#888' }}>
          <p>
            For diagnostics you might want to look at the EML record after normalisation.{' '}
            <a style={{ color: 'inherit' }} href={`${env.API_V1}/dataset/${dataset.key}/document`}>
              Download processed EML
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
