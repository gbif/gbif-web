import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { DynamicLink } from '@/reactRouterPlugins';
import { MARKERS } from './types';

type UploadPhaseProps = {
  error?: string;
  isProcessing: boolean;
  isDragOver: boolean;
  inputText: string;
  marker: string;
  hasCmsAbout: boolean;
  onInputTextChange: (value: string) => void;
  onMarkerChange: (value: string) => void;
  onSubmit: () => void;
  onLoadSample: () => void;
  onFile: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
};

export function UploadPhase({
  error,
  isProcessing,
  isDragOver,
  inputText,
  marker,
  hasCmsAbout,
  onInputTextChange,
  onMarkerChange,
  onSubmit,
  onLoadSample,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
}: UploadPhaseProps) {
  const { formatMessage } = useIntl();

  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-pt-8 g-pb-12">
        <Card className="g-bg-white g-overflow-hidden">
          <div className="g-px-8 g-pt-7 g-pb-5 g-border-b g-border-slate-100">
            <p className="g-text-slate-700 g-text-sm g-leading-relaxed">
              <FormattedMessage
                id="tools.sequenceId.description"
                defaultMessage="Identify DNA sequences against a reference database. Files can be uploaded in FASTA or CSV format. CSVs need a column named ‘sequence’ and an optional ‘id’ or ‘occurrenceId’ column. You can also paste FASTA sequences directly into the text field."
              />
            </p>
            {hasCmsAbout && (
              <p className="g-text-slate-500 g-text-sm g-mt-3">
                <FormattedMessage
                  id="tools.sequenceId.aboutHint"
                  defaultMessage="See the {aboutLink} for the reference databases used, version information and citations."
                  values={{
                    aboutLink: (
                      <DynamicLink to="about" className="g-underline g-text-primary-600">
                        <FormattedMessage id="tools.sequenceId.aboutPage" defaultMessage="about page" />
                      </DynamicLink>
                    ),
                  }}
                />
              </p>
            )}
          </div>

          <div className="g-p-8">
            {error && (
              <div className="g-bg-red-50 g-text-red-600 g-rounded-lg g-px-4 g-py-3 g-text-sm g-mb-6">
                {error}
              </div>
            )}

            <div className="g-mb-6">
              <label className="g-block g-text-sm g-font-medium g-text-slate-700 g-mb-2">
                <FormattedMessage
                  id="tools.sequenceId.referenceDatabase"
                  defaultMessage="Reference database"
                />
              </label>
              <Select value={marker} onValueChange={onMarkerChange} disabled={isProcessing}>
                <SelectTrigger className="g-max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MARKERS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <span className="g-font-medium">{m.marker}</span>{' '}
                      <span className="g-text-slate-500">— {m.group}</span>{' '}
                      <span className="g-text-slate-400 g-text-xs">({m.database})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <label
              htmlFor="sequenceIdInput"
              className="g-block g-text-sm g-font-medium g-text-slate-700 g-mb-2"
            >
              <FormattedMessage
                id="tools.sequenceId.pasteSequences"
                defaultMessage="Paste sequences (FASTA format)"
              />
            </label>
            <Textarea
              id="sequenceIdInput"
              value={inputText}
              onChange={(e) => onInputTextChange(e.target.value)}
              rows={8}
              placeholder={formatMessage({
                id: 'tools.sequenceId.pasteSequencesPlaceholder',
                defaultMessage: '>seq1\nATGC...',
              })}
              className="g-font-mono g-text-sm"
              disabled={isProcessing}
            />
            <div className="g-mt-3 g-flex g-flex-wrap g-items-center g-gap-2">
              <Button onClick={onSubmit} disabled={isProcessing || !inputText.trim()} size="sm">
                {isProcessing ? (
                  <FormattedMessage
                    id="tools.sequenceId.blasting"
                    defaultMessage="Blasting sequences…"
                  />
                ) : (
                  <FormattedMessage id="tools.sequenceId.blast" defaultMessage="Blast" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={onLoadSample} disabled={isProcessing}>
                <FormattedMessage
                  id="tools.sequenceId.loadTestData"
                  defaultMessage="Load test data"
                />
              </Button>
            </div>

            <div className="g-flex g-items-center g-my-6 g-text-xs g-text-slate-400 g-uppercase g-tracking-wide">
              <div className="g-flex-1 g-h-px g-bg-slate-200" />
              <span className="g-px-3">
                <FormattedMessage id="tools.sequenceId.or" defaultMessage="or" />
              </span>
              <div className="g-flex-1 g-h-px g-bg-slate-200" />
            </div>

            <div
              className={cn(
                'g-rounded-xl g-border-2 g-border-dashed g-flex g-flex-col g-items-center g-justify-center g-gap-4 g-py-10 g-px-8',
                'g-transition-colors',
                isDragOver
                  ? 'g-border-primary-400 g-bg-primary-50'
                  : 'g-border-slate-200 g-bg-slate-50'
              )}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <MdOutlineCloudUpload
                className={cn('g-text-5xl', isDragOver ? 'g-text-primary-400' : 'g-text-slate-300')}
              />
              <div className="g-text-center">
                <p
                  className={cn(
                    'g-text-sm g-font-medium',
                    isDragOver ? 'g-text-primary-600' : 'g-text-slate-500'
                  )}
                >
                  <FormattedMessage
                    id="tools.sequenceId.dropFile"
                    defaultMessage="Drop a FASTA or CSV file here"
                  />
                </p>
                <p className="g-text-slate-400 g-text-xs g-mt-1">
                  <FormattedMessage id="tools.sequenceId.or" defaultMessage="or" />
                </p>
              </div>
              <Button asChild size="sm" disabled={isProcessing}>
                <label className="g-cursor-pointer">
                  <FormattedMessage
                    id="tools.sequenceId.selectFile"
                    defaultMessage="Select file"
                  />
                  <input
                    type="file"
                    accept=".fasta,.fa,.fna,.csv,.tsv,.txt,text/plain,text/csv"
                    className="g-hidden"
                    disabled={isProcessing}
                    onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                  />
                </label>
              </Button>
            </div>
          </div>
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}
