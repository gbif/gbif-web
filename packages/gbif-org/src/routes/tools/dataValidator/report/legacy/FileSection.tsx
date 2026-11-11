import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MdInfoOutline, MdLink } from 'react-icons/md';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import type { ReportFile } from '../../data/normalizeReport';
import type { DwcExtension } from '../../data/types';
import { useLabels } from '../useLabels';
import { IssueList } from './IssueList';
import { TermFrequency } from './TermFrequency';

const DESCRIPTOR_TYPES = new Set(['METADATA', 'META_DESCRIPTOR']);

export function hasTermSection(file: ReportFile) {
  return !DESCRIPTOR_TYPES.has(file.fileType ?? '') && file.terms.length > 0 && file.count !== 0;
}

export function FileSection({
  file,
  extensions,
}: {
  file: ReportFile;
  extensions: Record<string, DwcExtension>;
}) {
  return (
    <Card className="g-mb-4 gbif-word-break" id={file.anchor}>
      <CardHeader>
        <CardTitle dir="auto">{file.fileName}</CardTitle>
      </CardHeader>
      <CardContent className="g-space-y-6">
        <FileFacts file={file} extensions={extensions} />

        {hasTermSection(file) && (
          <section id={`${file.anchor}-terms`}>
            <h3 className="g-text-base g-font-semibold g-mb-2">
              <FormattedMessage
                id="tools.dataValidator.termsFrequency.title"
                defaultMessage="Term frequency"
              />
            </h3>
            <TermFrequency file={file} />
          </section>
        )}

        <section id={`${file.anchor}-issues`}>
          <h3 className="g-text-base g-font-semibold g-mb-2">
            <FormattedMessage id="tools.dataValidator.issues" defaultMessage="Validation issues" />
          </h3>
          <IssueList file={file} />
        </section>
      </CardContent>
    </Card>
  );
}

function FileFacts({
  file,
  extensions,
}: {
  file: ReportFile;
  extensions: Record<string, DwcExtension>;
}) {
  const labels = useLabels();

  if (file.fileType === 'METADATA') {
    return (
      <p className="g-text-sm">
        <FormattedMessage
          id="tools.dataValidator.fileType.METADATA.title"
          defaultMessage="Metadata document"
        />
        <span className="g-block g-text-slate-500">
          <FormattedMessage
            id="tools.dataValidator.fileType.METADATA.description"
            defaultMessage="Metadata describing the data in EML (Ecological Metadata Language)"
          />
        </span>
      </p>
    );
  }
  if (file.fileType === 'META_DESCRIPTOR') {
    return (
      <p className="g-text-sm">
        <FormattedMessage
          id="tools.dataValidator.fileType.META_DESCRIPTOR.title"
          defaultMessage="Meta descriptor"
        />
        <span className="g-block g-text-slate-500">
          <FormattedMessage
            id="tools.dataValidator.fileType.META_DESCRIPTOR.description"
            defaultMessage="Semantic annotation describing how the data is structured (files, columns, etc)"
          />
        </span>
      </p>
    );
  }

  const extension = file.rowType ? extensions[file.rowType] : undefined;
  return (
    <dl className="g-grid g-grid-cols-[auto_1fr] g-gap-x-4 g-gap-y-1 g-text-sm">
      {file.rowType && (
        <>
          <dt className="g-text-slate-500">
            <FormattedMessage id="tools.dataValidator.fileType.title" defaultMessage="Row type" />
          </dt>
          <dd>
            <span className="g-break-all">{labels.rowType(file.rowType, extensions)}</span>
            {(extension?.description || extension?.url) && (
              <span className="g-ms-1.5 g-inline-flex g-items-center g-gap-1 g-align-middle">
                {extension.description && (
                  <RowTypeHelp
                    title={labels.rowType(file.rowType, extensions)}
                    description={extension.description}
                  />
                )}
                {extension.url && (
                  <a
                    href={extension.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={ICON_BUTTON}
                  >
                    <MdLink aria-hidden />
                    <span className="g-sr-only">{extension.url}</span>
                  </a>
                )}
              </span>
            )}
          </dd>
        </>
      )}
      {file.count !== undefined && (
        <>
          <dt className="g-text-slate-500">
            <FormattedMessage
              id="tools.dataValidator.numberOfLines"
              defaultMessage="Number of lines"
            />
          </dt>
          <dd>
            <FormattedNumber value={file.count} />
          </dd>
        </>
      )}
      {file.indexedCount !== undefined && (
        <>
          <dt className="g-text-slate-500">
            <FormattedMessage
              id="tools.dataValidator.interpretedCounts.indexed"
              defaultMessage="Number of records indexed"
            />
          </dt>
          <dd>
            <FormattedNumber value={file.indexedCount} />
          </dd>
        </>
      )}
    </dl>
  );
}

const ICON_BUTTON =
  'g-inline-flex g-h-5 g-w-5 g-items-center g-justify-center g-rounded g-text-base g-text-slate-400 hover:g-text-primary-600 focus-visible:g-outline-none focus-visible:g-ring-2 focus-visible:g-ring-primary-500';

function RowTypeHelp({ title, description }: { title: string; description: string }) {
  const { formatMessage } = useIntl();
  return (
    <Popover>
      <PopoverTrigger
        className={ICON_BUTTON}
        aria-label={formatMessage(
          { id: 'tools.dataValidator.aboutRowType', defaultMessage: 'About {rowType}' },
          { rowType: title }
        )}
      >
        <MdInfoOutline aria-hidden />
      </PopoverTrigger>
      <PopoverContent className="g-w-80 g-text-sm">
        <p className="g-font-semibold g-mb-1" dir="auto">
          {title}
        </p>
        <p className="g-text-slate-600" dir="auto">
          {description}
        </p>
      </PopoverContent>
    </Popover>
  );
}
