import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRef } from 'react';
import { MdAddCircle, MdAttachFile, MdClose, MdRemoveCircleOutline } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { RelatedDatasetRow } from './types';
import { isValidCsvFile, parseRelatedDatasetsCsv } from './utils';

type Props = {
  rows: RelatedDatasetRow[];
  onRowsChange: (rows: RelatedDatasetRow[]) => void;
  attachmentName: string;
  onAttachmentNameChange: (name: string) => void;
  attachmentError: React.ReactNode | null;
  onAttachmentErrorChange: (error: React.ReactNode | null) => void;
  disabled?: boolean;
};

export function RelatedDatasetsField({
  rows,
  onRowsChange,
  attachmentName,
  onAttachmentNameChange,
  attachmentError,
  onAttachmentErrorChange,
  disabled,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { formatMessage } = useIntl();

  const updateRow = (index: number, patch: Partial<RelatedDatasetRow>) => {
    const next = rows.map((r, i) => (i === index ? { ...r, ...patch } : r));
    onRowsChange(next);
  };

  const removeRow = (index: number) => {
    const next = rows.filter((_, i) => i !== index);
    onRowsChange(next.length > 0 ? next : [{ key: '', val: '' }]);
  };

  const addRow = () => onRowsChange([...rows, { key: '', val: '' }]);

  const handleFileChosen = (file: File | null) => {
    onAttachmentErrorChange(null);
    if (!file) {
      onAttachmentNameChange('');
      return;
    }

    if (!isValidCsvFile(file)) {
      onAttachmentNameChange(file.name);
      onAttachmentErrorChange(
        <FormattedMessage
          id="tools.derivedDataset.invalidFileFormat"
          defaultMessage="Invalid file format — the file must be a CSV file."
        />
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? '');
      const result = parseRelatedDatasetsCsv(text);
      onAttachmentNameChange(file.name);
      if (!result.ok) {
        onAttachmentErrorChange(
          result.errorId === 'tools.derivedDataset.tooManyRows' ? (
            <FormattedMessage
              id="tools.derivedDataset.tooManyRows"
              defaultMessage="Too many rows (maximum 6,000). Try using the API instead."
            />
          ) : (
            <FormattedMessage
              id="tools.derivedDataset.emptyFile"
              defaultMessage="The file contains no rows."
            />
          )
        );
        return;
      }
      onRowsChange(result.rows.length > 0 ? result.rows : [{ key: '', val: '' }]);
    };
    reader.onerror = () => {
      onAttachmentNameChange(file.name);
      onAttachmentErrorChange(
        <FormattedMessage
          id="tools.derivedDataset.fileReadFailed"
          defaultMessage="Could not read the file. Please try again."
        />
      );
    };
    reader.readAsText(file);
  };

  const clearFile = () => {
    onAttachmentNameChange('');
    onAttachmentErrorChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="g-space-y-3">
      <div>
        <p className="g-text-sm g-text-slate-700">
          <FormattedMessage
            id="tools.derivedDataset.attachCsvLabel"
            defaultMessage="Attach a CSV file with dataset keys and occurrence counts"
          />
        </p>
        <div className="g-mt-2 g-flex g-items-center g-gap-2 g-flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            <MdAttachFile className="g-mr-1" />
            <FormattedMessage id="tools.derivedDataset.chooseFile" defaultMessage="Choose file" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.tsv,.txt,text/csv,text/plain"
            className="g-hidden"
            onChange={(e) => handleFileChosen(e.target.files?.[0] ?? null)}
            disabled={disabled}
          />
          {attachmentName ? (
            <span className="g-text-sm g-text-slate-600 g-flex g-items-center g-gap-1">
              {attachmentName}
              <button
                type="button"
                onClick={clearFile}
                className="g-text-slate-400 hover:g-text-slate-700"
                aria-label="Remove file"
                disabled={disabled}
              >
                <MdClose />
              </button>
            </span>
          ) : (
            <span className="g-text-sm g-text-slate-400">
              <FormattedMessage
                id="tools.derivedDataset.noFileChosen"
                defaultMessage="No file chosen"
              />
            </span>
          )}
        </div>
        {attachmentError && <p className="g-text-xs g-text-red-600 g-mt-1">{attachmentError}</p>}
      </div>

      <div>
        <p className="g-text-sm g-text-slate-700">
          <FormattedMessage
            id="tools.derivedDataset.orEnterLabel"
            defaultMessage="Or enter dataset keys/DOIs and occurrence counts here"
          />
        </p>

        <ul className="g-mt-2 g-divide-y g-rounded-md g-border g-border-slate-200">
          {rows.map((row, index) => (
            <li
              key={index}
              className="g-flex g-flex-col sm:g-flex-row sm:g-items-center g-gap-2 g-px-3 g-py-2"
            >
              <div className="g-flex g-items-center g-gap-2 sm:g-flex-1 sm:g-min-w-0">
                <span className="g-text-xs g-text-slate-500 g-shrink-0">
                  <FormattedMessage
                    id="tools.derivedDataset.datasetKey"
                    defaultMessage="Dataset key"
                  />
                </span>
                <Input
                  value={row.key}
                  onChange={(e) => updateRow(index, { key: e.target.value })}
                  placeholder="e.g. 10.21373/1llmgl"
                  className="g-flex-1 g-min-w-0"
                  disabled={disabled}
                />
              </div>
              <div className="g-flex g-items-center g-gap-2">
                <span className="g-text-xs g-text-slate-500 g-shrink-0">
                  <FormattedMessage
                    id="tools.derivedDataset.occurrenceCount"
                    defaultMessage="Occurrence count"
                  />
                </span>
                <Input
                  value={row.val}
                  onChange={(e) => updateRow(index, { val: e.target.value })}
                  placeholder={formatMessage({
                    id: 'tools.derivedDataset.occurrenceCountPlaceholder',
                    defaultMessage: 'e.g. 1234',
                  })}
                  inputMode="numeric"
                  className="g-flex-1 sm:g-flex-none sm:g-w-32"
                  disabled={disabled}
                />
                <div className="g-flex g-items-center g-gap-1 g-shrink-0 g-ml-auto g-min-w-10">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(index)}
                      className="g-text-slate-400 hover:g-text-destructive"
                      aria-label="Remove row"
                      disabled={disabled}
                    >
                      <MdRemoveCircleOutline />
                    </button>
                  )}
                  {index === rows.length - 1 && (
                    <button
                      type="button"
                      onClick={addRow}
                      className="g-text-primary-600 hover:g-text-primary-700 disabled:g-opacity-50"
                      aria-label="Add row"
                      disabled={disabled}
                    >
                      <MdAddCircle />
                    </button>
                  )}
                  <div className="g-flex-1"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
