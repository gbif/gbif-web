import { defaultDateFormatProps } from '@/components/headerComponents';
import { HelpLine } from '@/components/helpText';
import { HyperText } from '@/components/hyperText';
import Properties from '@/components/properties';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/largeCard';
import { DownloadKeyQuery } from '@/gql/graphql';
import { BasicField } from '@/routes/occurrence/key/properties';
import { formatBytes } from '@/utils/formatBytes';
import { useMemo } from 'react';
import { createIntl, FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { downloadCompleted } from '../utils';

export function FileCard({ download }: { download: DownloadKeyQuery['download'] }) {
  const { formatMessage } = useIntl();
  const englishCreationDate = useMemo(() => {
    const enIntl = createIntl({
      locale: 'en-GB',
      messages: {},
    });
    return enIntl.formatDate(download?.created, defaultDateFormatProps);
  }, [download?.created]);

  if (!download) return null;
  const { size, unit } = formatBytes(download.size ?? 0, 0);

  const citation = `GBIF.org (${englishCreationDate}) GBIF Occurrence Download ${
    download?.doi
      ? `https://doi.org/${download.doi}`
      : `${import.meta.env.PUBLIC_GBIF_ORG}/occurrence/download/${download.key}`
  }`;

  const hasCompleted = downloadCompleted(download);

  return (
    <Card className="g-mb-4 g-pt-8">
      <CardContent>
        <Properties breakpoint={800} className="[&>dt]:g-w-52">
          <BasicField label="phrases.pleaseCiteAs">
            <div>
              <div>{citation}</div>
              <div style={{ marginTop: '1em' }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="g-me-1"
                  onClick={() => {
                    navigator.clipboard.writeText(citation);
                  }}
                >
                  <FormattedMessage id="phrases.copy" />
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    href={`https://data.crosscite.org/application/x-research-info-systems/${download.doi}`}
                    className="g-me-1 g-text-inherit"
                  >
                    RIS
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a
                    className="g-text-inherit"
                    href={`https://data.crosscite.org/application/x-bibtex/${download.doi}`}
                  >
                    BibTex
                  </a>
                </Button>
              </div>
            </div>
          </BasicField>
        </Properties>
        {!download.doi && hasCompleted && (
          <div className="g-text-slate-600 g-mt-4">
            <FormattedMessage id="downloadKey.predatesDoi" />
          </div>
        )}
      </CardContent>
      {download.downloadLink && download?.status === 'SUCCEEDED' && (
        <CardContent className="g-border-t g-border-gray-200 !g-py-4 g-flex g-gap-4 g-flex-col md:g-flex-row">
          <div className="g-w-52 g-flex-none">
            <Button className="g-flex-none" variant="default" asChild>
              <a href={download.downloadLink} download>
                <FormattedMessage
                  id="downloadKey.DownloadArchive"
                  defaultMessage="Download archive"
                />
              </a>
            </Button>
            <div className="g-text-slate-800 g-flex-auto g-text-sm g-mt-1">
              <div>
                <FormattedNumber value={size} /> {unit}
              </div>
              <div className="g-text-slate-400">
                <FormattedMessage id={`enums.downloadFormat.${download?.request?.format}`} />
              </div>
            </div>
          </div>
          <div className="g-text-slate-600 g-flex-auto">
            <HyperText
              text={formatMessage({ id: 'downloadKey.readDatauseAndTerms' })}
              className="[&_a]:g-underline"
            />

            <div className="g-mt-2 g-text-sm">
              <FormattedMessage id="downloadKey.seeAlso" />
              <ul className="g-list-disc g-ps-4">
                <li>
                  <HelpLine id="opening-gbif-csv-in-excel" contentClassName="g-w-[500px]" icon />
                </li>
                <li>
                  <a
                    href="https://techdocs.gbif.org/en/data-use/download-formats"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="g-underline"
                  >
                    <FormattedMessage id="downloadKey.aboutDownloadFormatsLink" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
