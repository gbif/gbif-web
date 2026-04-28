import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { MdOutlineCloudUpload } from 'react-icons/md';

type UploadPhaseProps = {
  error?: string;
  isDragOver: boolean;
  simpleExampleCsv: string;
  advancedExampleCsv: string;
  onFile: (file: File) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
};

export function UploadPhase({
  error,
  isDragOver,
  simpleExampleCsv,
  advancedExampleCsv,
  onFile,
  onDrop,
  onDragOver,
  onDragLeave,
}: UploadPhaseProps) {
  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-max-w-lg g-pt-8 g-pb-12">
        <Card className="g-bg-white g-overflow-hidden">
          <div className="g-px-8 g-pt-7 g-pb-5 g-border-b g-border-slate-100">
            <p className="g-text-slate-700 g-text-sm g-leading-relaxed">
              <FormattedMessage
                id="tools.speciesLookup.description"
                defaultMessage="Normalize species names from a csv file against the GBIF backbone."
              />
            </p>
          </div>

          <div className="g-p-8">
            {error && (
              <div className="g-bg-red-50 g-text-red-600 g-rounded-lg g-px-4 g-py-3 g-text-sm g-mb-6">
                {error}
              </div>
            )}

            <div
              className={cn(
                'g-rounded-xl g-border-2 g-border-dashed g-flex g-flex-col g-items-center g-justify-center g-gap-4 g-py-12 g-px-8',
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
                  <FormattedMessage id="tools.speciesLookup.dropHere" defaultMessage="Drop here" />
                </p>
                <p className="g-text-slate-400 g-text-xs g-mt-1">
                  <FormattedMessage id="tools.speciesLookup.or" defaultMessage="or" />
                </p>
              </div>
              <Button asChild variant="primaryOutline" size="sm">
                <label className="g-cursor-pointer">
                  <FormattedMessage
                    id="tools.speciesLookup.selectFile"
                    defaultMessage="Select file"
                  />
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    className="g-hidden"
                    onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                  />
                </label>
              </Button>
            </div>

            <div className="g-mt-6 g-flex g-items-center g-gap-3">
              <span className="g-text-slate-400 g-text-xs g-shrink-0">
                <FormattedMessage id="tools.speciesLookup.examples" defaultMessage="Examples:" />
              </span>
              <div className="g-flex g-gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={simpleExampleCsv} download="simple-example.csv">
                    <FormattedMessage
                      id="tools.speciesLookup.simpleExampleCsv"
                      defaultMessage="SimpleExample.csv"
                    />
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href={advancedExampleCsv} download="advanced-example.csv">
                    <FormattedMessage
                      id="tools.speciesLookup.advancedExampleCsv"
                      defaultMessage="AdvancedExample.csv"
                    />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}
