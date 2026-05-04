import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UserError, useUser } from '@/contexts/UserContext';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { RelatedDatasetsField } from './relatedDatasetsField';
import { DerivedDatasetPayload, RegistrationResult, RelatedDatasetRow } from './types';
import { buildRelatedDatasetsMap } from './utils';

type Errors = {
  title: React.ReactNode | null;
  sourceUrl: React.ReactNode | null;
  description: React.ReactNode | null;
  relatedDatasets: React.ReactNode | null;
};

type Touched = {
  title: boolean;
  sourceUrl: boolean;
  description: boolean;
  relatedDatasets: boolean;
};

export type FormInitialValues = {
  title?: string;
  sourceUrl?: string;
  description?: string;
  originalDownloadDOI?: string;
  registrationDate?: string;
  rows?: RelatedDatasetRow[];
};

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function validateRows(rows: RelatedDatasetRow[]): React.ReactNode | null {
  const rowsWithAnyData = rows.filter((r) => r.key.trim() !== '' || r.val.trim() !== '');
  if (rowsWithAnyData.length === 0) {
    return (
      <FormattedMessage
        id="tools.derivedDataset.atLeastOneDataset"
        defaultMessage="Please provide at least one dataset key and occurrence count."
      />
    );
  }
  for (const row of rowsWithAnyData) {
    if (!row.key.trim() || !row.val.trim()) {
      return (
        <FormattedMessage
          id="tools.derivedDataset.rowsMustBeComplete"
          defaultMessage="Each row must include both a dataset key and an occurrence count."
        />
      );
    }
    if (!Number.isFinite(Number(row.val))) {
      return (
        <FormattedMessage
          id="tools.derivedDataset.mustBeNumber"
          defaultMessage="Occurrence count must be a number."
        />
      );
    }
  }
  return null;
}

type Mode = 'create' | 'edit';

type Props = {
  mode: Mode;
  doi?: string;
  initialValues?: FormInitialValues;
  onSuccess: (result: RegistrationResult) => void;
};

export function RegistrationForm({ mode, doi, initialValues, onSuccess }: Props) {
  const { registerDerivedDataset, updateDerivedDataset } = useUser();

  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [sourceUrl, setSourceUrl] = useState(initialValues?.sourceUrl ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [originalDownloadDOI, setOriginalDownloadDOI] = useState(
    initialValues?.originalDownloadDOI ?? ''
  );
  const [registrationDate, setRegistrationDate] = useState(initialValues?.registrationDate ?? '');
  const [rows, setRows] = useState<RelatedDatasetRow[]>(
    initialValues?.rows && initialValues.rows.length > 0
      ? initialValues.rows
      : [{ key: '', val: '' }]
  );
  const [attachmentName, setAttachmentName] = useState('');
  const [attachmentError, setAttachmentError] = useState<React.ReactNode | null>(null);

  const [touched, setTouched] = useState<Touched>({
    title: false,
    sourceUrl: false,
    description: false,
    relatedDatasets: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors: Errors = {
    title: !title.trim() ? (
      <FormattedMessage id="validation.required" defaultMessage="Required" />
    ) : null,
    sourceUrl: !sourceUrl.trim() ? (
      <FormattedMessage id="validation.required" defaultMessage="Required" />
    ) : !isValidUrl(sourceUrl.trim()) ? (
      <FormattedMessage
        id="tools.derivedDataset.invalidUrl"
        defaultMessage="Please enter a valid URL (starting with http:// or https://)."
      />
    ) : null,
    description: !description.trim() ? (
      <FormattedMessage id="validation.required" defaultMessage="Required" />
    ) : null,
    relatedDatasets: validateRows(rows),
  };

  const hasErrors = Object.values(errors).some((e) => e != null);

  const showError = (field: keyof Errors) =>
    (touched[field] || submitAttempted) && errors[field];

  const handleBlur = (field: keyof Touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setServerError(null);
    if (hasErrors) return;

    setIsSubmitting(true);
    try {
      const { map } = buildRelatedDatasetsMap(rows);

      const payload: DerivedDatasetPayload = {
        title: title.trim(),
        sourceUrl: sourceUrl.trim(),
        description: description.trim(),
        relatedDatasets: map,
      };
      if (originalDownloadDOI.trim()) payload.originalDownloadDOI = originalDownloadDOI.trim();
      if (registrationDate.trim()) payload.registrationDate = registrationDate;

      const result: RegistrationResult =
        mode === 'edit' && doi
          ? await updateDerivedDataset(doi, payload)
          : await registerDerivedDataset(payload);

      onSuccess(result);
    } catch (err) {
      if (err instanceof UserError) {
        setServerError(err.message);
      } else {
        console.error(err);
        setServerError('Could not reach the server. Please check your connection and try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="g-flex g-flex-col g-gap-6" noValidate>
      {serverError && (
        <div
          role="alert"
          className="g-bg-red-50 g-text-red-700 g-rounded-lg g-px-4 g-py-3 g-text-sm"
        >
          {serverError}
        </div>
      )}

      {mode === 'edit' && doi && (
        <Field id="dd-doi" label={<FormattedMessage id="tools.derivedDataset.doi" defaultMessage="DOI" />}>
          <Input id="dd-doi" value={doi} disabled />
        </Field>
      )}

      <Field
        id="dd-title"
        label={
          <>
            <FormattedMessage id="tools.derivedDataset.titleField" defaultMessage="Title" /> *
          </>
        }
        error={showError('title') ? errors.title : null}
      >
        <Input
          id="dd-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleBlur('title')}
          disabled={isSubmitting}
        />
      </Field>

      <Field
        id="dd-sourceUrl"
        label={
          <>
            <FormattedMessage
              id="tools.derivedDataset.sourceUrl"
              defaultMessage="URL of where derived dataset can be accessed"
            />{' '}
            *
          </>
        }
        error={showError('sourceUrl') ? errors.sourceUrl : null}
      >
        <Input
          id="dd-sourceUrl"
          type="url"
          placeholder="https://"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          onBlur={() => handleBlur('sourceUrl')}
          disabled={isSubmitting}
        />
      </Field>

      <div>
        <RelatedDatasetsField
          rows={rows}
          onRowsChange={(next) => {
            setRows(next);
            handleBlur('relatedDatasets');
          }}
          attachmentName={attachmentName}
          attachmentError={attachmentError}
          onAttachmentNameChange={setAttachmentName}
          onAttachmentErrorChange={setAttachmentError}
          disabled={isSubmitting}
        />
        {showError('relatedDatasets') && (
          <p className="g-mt-1 g-text-xs g-text-red-600">{errors.relatedDatasets}</p>
        )}
      </div>

      <Field
        id="dd-description"
        label={
          <>
            <FormattedMessage
              id="tools.derivedDataset.description"
              defaultMessage="Description"
            />{' '}
            *
          </>
        }
        description={
          <FormattedMessage
            id="tools.derivedDataset.descriptionHint"
            defaultMessage="Markdown is supported."
          />
        }
        error={showError('description') ? errors.description : null}
      >
        <Textarea
          id="dd-description"
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => handleBlur('description')}
          disabled={isSubmitting}
        />
      </Field>

      <div className="g-flex g-flex-col sm:g-flex-row g-gap-4">
        <div className="g-flex-1 g-min-w-0">
          <Field
            id="dd-originalDownloadDOI"
            label={
              <FormattedMessage
                id="tools.derivedDataset.originalDownloadDOI"
                defaultMessage="Original Download DOI"
              />
            }
          >
            <Input
              id="dd-originalDownloadDOI"
              value={originalDownloadDOI}
              onChange={(e) => setOriginalDownloadDOI(e.target.value)}
              disabled={isSubmitting}
            />
          </Field>
        </div>
        <div className="g-flex-1">
          <Field
            id="dd-registrationDate"
            label={
              <FormattedMessage
                id="tools.derivedDataset.registrationDate"
                defaultMessage="Registration date"
              />
            }
          >
            <Input
              id="dd-registrationDate"
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              disabled={isSubmitting}
            />
          </Field>
        </div>
      </div>

      <div className="g-flex g-justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            mode === 'edit' ? (
              <FormattedMessage
                id="tools.derivedDataset.saving"
                defaultMessage="Saving…"
              />
            ) : (
              <FormattedMessage
                id="tools.derivedDataset.submitting"
                defaultMessage="Submitting…"
              />
            )
          ) : mode === 'edit' ? (
            <FormattedMessage id="tools.derivedDataset.saveChanges" defaultMessage="Save changes" />
          ) : (
            <FormattedMessage id="tools.derivedDataset.submit" defaultMessage="Submit" />
          )}
        </Button>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode | null;
  children: React.ReactNode;
};

function Field({ id, label, description, error, children }: FieldProps) {
  return (
    <div className="g-space-y-2">
      <label htmlFor={id} className="g-block g-text-sm g-font-medium g-text-slate-700">
        {label}
      </label>
      {children}
      {description && <p className="g-text-xs g-text-slate-500">{description}</p>}
      {error && <p className="g-text-xs g-text-red-600">{error}</p>}
    </div>
  );
}
