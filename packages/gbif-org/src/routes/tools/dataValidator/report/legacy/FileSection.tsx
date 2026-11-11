import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
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
  unknownTerms,
}: {
  file: ReportFile;
  extensions: Record<string, DwcExtension>;
  unknownTerms: Set<string>;
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
            <TermFrequency file={file} unknownTerms={unknownTerms} />
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
  const [showDescription, setShowDescription] = useState(false);

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
            {extension?.description ? (
              <button
                type="button"
                className="g-text-primary-600 hover:g-underline g-text-start"
                aria-expanded={showDescription}
                onClick={() => setShowDescription((show) => !show)}
              >
                {labels.rowType(file.rowType, extensions)}
              </button>
            ) : (
              <span className="g-break-all">{labels.rowType(file.rowType, extensions)}</span>
            )}
            {extension?.url && (
              <a
                href={extension.url}
                target="_blank"
                rel="noopener noreferrer"
                className="g-ms-1 g-inline-block g-align-middle g-text-slate-400 hover:g-text-primary-600"
              >
                <MdLink />
                <span className="g-sr-only">{extension.url}</span>
              </a>
            )}
            {showDescription && extension?.description && (
              <span className="g-block g-text-slate-500 g-mt-1">{extension.description}</span>
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
