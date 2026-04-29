import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Textarea } from '@/components/ui/textarea';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { FormattedMessage, useIntl } from 'react-intl';
import { MdOutlineCloudUpload } from 'react-icons/md';

type UploadPhaseProps = {
  error?: string;
  isParsing: boolean;
  isDragOver: boolean;
  inputText: string;
  onInputTextChange: (value: string) => void;
  onParseText: () => void;
  onLoadSample: () => void;
  onFile: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
};

export function UploadPhase({
  error,
  isParsing,
  isDragOver,
  inputText,
  onInputTextChange,
  onParseText,
  onLoadSample,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
}: UploadPhaseProps) {
  const { formatMessage } = useIntl();

  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-max-w-lg g-pt-8 g-pb-12">
        <Card className="g-bg-white g-overflow-hidden">
          <div className="g-px-8 g-pt-7 g-pb-5 g-border-b g-border-slate-100">
            <p className="g-text-slate-700 g-text-sm g-leading-relaxed">
              <FormattedMessage
                id="tools.nameParser.description"
                defaultMessage="Parse scientific names into their components — genus, species, authorship, rank and more."
              />
            </p>
          </div>

          <div className="g-p-8">
            {error && (
              <div className="g-bg-red-50 g-text-red-600 g-rounded-lg g-px-4 g-py-3 g-text-sm g-mb-6">
                {error}
              </div>
            )}

            <label
              htmlFor="nameParserInput"
              className="g-block g-text-sm g-font-medium g-text-slate-700 g-mb-2"
            >
              <FormattedMessage
                id="tools.nameParser.pasteNamesToParse"
                defaultMessage="Paste names to parse (one per line)"
              />
            </label>
            <Textarea
              id="nameParserInput"
              value={inputText}
              onChange={(e) => onInputTextChange(e.target.value)}
              rows={8}
              placeholder={formatMessage({
                id: 'tools.nameParser.pasteNamesPlaceholder',
                defaultMessage: 'e.g. Abies alba Mill.',
              })}
              className="g-font-mono g-text-sm"
              disabled={isParsing}
            />
            <div className="g-mt-3 g-flex g-flex-wrap g-items-center g-gap-2">
              <Button onClick={onParseText} disabled={isParsing || !inputText.trim()} size="sm">
                {isParsing ? (
                  <FormattedMessage
                    id="tools.nameParser.parsingNames"
                    defaultMessage="Parsing names…"
                  />
                ) : (
                  <FormattedMessage id="tools.nameParser.parse" defaultMessage="Parse" />
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLoadSample}
                disabled={isParsing}
              >
                <FormattedMessage
                  id="tools.nameParser.loadTestNames"
                  defaultMessage="Load test names"
                />
              </Button>
            </div>

            <div className="g-flex g-items-center g-my-6 g-text-xs g-text-slate-400 g-uppercase g-tracking-wide">
              <div className="g-flex-1 g-h-px g-bg-slate-200" />
              <span className="g-px-3">
                <FormattedMessage id="tools.nameParser.or" defaultMessage="or" />
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
                className={cn(
                  'g-text-5xl',
                  isDragOver ? 'g-text-primary-400' : 'g-text-slate-300'
                )}
              />
              <div className="g-text-center">
                <p
                  className={cn(
                    'g-text-sm g-font-medium',
                    isDragOver ? 'g-text-primary-600' : 'g-text-slate-500'
                  )}
                >
                  <FormattedMessage
                    id="tools.nameParser.dropTextFile"
                    defaultMessage="Drop a text file here"
                  />
                </p>
                <p className="g-text-slate-400 g-text-xs g-mt-1">
                  <FormattedMessage id="tools.nameParser.or" defaultMessage="or" />
                </p>
              </div>
              <Button asChild size="sm" disabled={isParsing}>
                <label className="g-cursor-pointer">
                  <FormattedMessage
                    id="tools.nameParser.selectFile"
                    defaultMessage="Select file"
                  />
                  <input
                    type="file"
                    accept=".txt,text/plain"
                    className="g-hidden"
                    disabled={isParsing}
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
