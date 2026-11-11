import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/largeCard';
import { Progress } from '@/components/ui/progress';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useI18n } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { FormEvent, ReactNode, useState } from 'react';
import { MdOutlineCloudUpload } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import type { ValidatorErrorKind } from '../data/validatorApi';
import { isHttpUrl } from '../data/validatorApi';
import { ValidatorErrorMessage } from '../validatorErrorMessage';

type Props = {
  busy: boolean;
  progress?: number;
  error?: ValidatorErrorKind;
  onFile: (file: File) => void;
  onUrl: (url: string) => void;
};

export function UploadForm({ busy, progress, error, onFile, onUrl }: Props) {
  const { formatMessage } = useIntl();
  const { locale } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [urlInvalid, setUrlInvalid] = useState(false);

  const submitUrl = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    if (!isHttpUrl(fileUrl)) {
      setUrlInvalid(true);
      return;
    }
    setUrlInvalid(false);
    onUrl(fileUrl.trim());
  };

  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-pt-8 g-pb-12">
        <Card className="g-bg-white g-overflow-hidden">
          <div className="g-px-8 g-pt-7 g-pb-5 g-border-b g-border-slate-100">
            <p className="g-text-slate-700 g-text-sm g-leading-relaxed">
              <FormattedMessage
                id="tools.dataValidator.description"
                defaultMessage="The GBIF data validator is a service that allows anyone with a GBIF-relevant dataset to receive a report on the syntactical correctness and the validity of the content contained within the dataset."
              />
            </p>
          </div>

          <div className="g-p-8">
            {error && (
              <div
                role="alert"
                className="g-bg-red-50 g-text-red-600 g-rounded-lg g-px-4 g-py-3 g-text-sm g-mb-6"
              >
                <ValidatorErrorMessage kind={error} />
              </div>
            )}

            <div
              className={cn(
                'g-rounded-xl g-border-2 g-border-dashed g-flex g-flex-col g-items-center g-justify-center g-gap-4 g-py-10 g-px-8 g-transition-colors',
                isDragOver
                  ? 'g-border-primary-400 g-bg-primary-50'
                  : 'g-border-slate-200 g-bg-slate-50'
              )}
              onDragOver={(event) => {
                event.preventDefault();
                if (!busy) setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragOver(false);
                const file = event.dataTransfer.files?.[0];
                if (file && !busy) onFile(file);
              }}
            >
              <MdOutlineCloudUpload
                className={cn('g-text-5xl', isDragOver ? 'g-text-primary-400' : 'g-text-slate-300')}
              />
              <p
                className={cn(
                  'g-text-sm g-font-medium',
                  isDragOver ? 'g-text-primary-600' : 'g-text-slate-500'
                )}
              >
                <FormattedMessage
                  id="tools.dataValidator.dropHere"
                  defaultMessage="Drop a file here"
                />
              </p>
              <p className="g-text-slate-400 g-text-xs">
                <FormattedMessage id="tools.dataValidator.or" defaultMessage="or" />
              </p>
              <Button asChild size="sm" disabled={busy}>
                <label className={cn(busy ? 'g-cursor-not-allowed' : 'g-cursor-pointer')}>
                  <FormattedMessage
                    id="tools.dataValidator.selectFile"
                    defaultMessage="Select file"
                  />
                  <input
                    type="file"
                    className="g-hidden"
                    disabled={busy}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      // reset so that choosing the same file again still triggers a change
                      event.target.value = '';
                      if (file) onFile(file);
                    }}
                  />
                </label>
              </Button>
            </div>

            {progress !== undefined && (
              <UploadProgress value={progress} dir={locale.textDirection}>
                <FormattedMessage
                  id="tools.dataValidator.uploading"
                  defaultMessage="Uploading… {percent, number, ::percent}"
                  values={{ percent: progress / 100 }}
                />
              </UploadProgress>
            )}

            <div className="g-flex g-items-center g-my-6 g-text-xs g-text-slate-400 g-uppercase g-tracking-wide">
              <div className="g-flex-1 g-h-px g-bg-slate-200" />
              <span className="g-px-3">
                <FormattedMessage id="tools.dataValidator.or" defaultMessage="or" />
              </span>
              <div className="g-flex-1 g-h-px g-bg-slate-200" />
            </div>

            <form onSubmit={submitUrl} noValidate>
              <label
                htmlFor="dataValidatorUrl"
                className="g-block g-text-sm g-font-medium g-text-slate-700 g-mb-2"
              >
                <FormattedMessage
                  id="tools.dataValidator.fetchFileFromLocation"
                  defaultMessage="Fetch file from location"
                />
              </label>
              <div className="g-flex g-flex-wrap g-gap-2">
                <Input
                  id="dataValidatorUrl"
                  type="url"
                  dir="ltr"
                  className="g-flex-1 g-min-w-0"
                  value={fileUrl}
                  disabled={busy}
                  aria-invalid={urlInvalid}
                  aria-describedby={urlInvalid ? 'dataValidatorUrlError' : undefined}
                  placeholder={formatMessage({
                    id: 'tools.dataValidator.urlPlaceholder',
                    defaultMessage: 'https://example.com/dwca.zip',
                  })}
                  onChange={(event) => {
                    setFileUrl(event.target.value);
                    if (urlInvalid) setUrlInvalid(false);
                  }}
                />
                <Button type="submit" disabled={busy || fileUrl.trim() === ''}>
                  <FormattedMessage id="tools.dataValidator.submit" defaultMessage="Submit" />
                </Button>
              </div>
              {urlInvalid && (
                <p id="dataValidatorUrlError" className="g-text-red-600 g-text-sm g-mt-2">
                  <FormattedMessage
                    id="tools.dataValidator.invalidUrl"
                    defaultMessage="Please enter a web address starting with http:// or https://"
                  />
                </p>
              )}
            </form>

            <p className="g-text-slate-500 g-text-xs g-mt-6">
              <FormattedMessage
                id="tools.dataValidator.fileSizeLimit"
                defaultMessage="File size limit: 100 mb"
              />
            </p>
          </div>
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}

function UploadProgress({
  value,
  dir,
  children,
}: {
  value: number;
  dir: 'ltr' | 'rtl';
  children: ReactNode;
}) {
  return (
    <div className="g-mt-6" aria-live="polite">
      <p className="g-text-sm g-text-slate-600 g-mb-2">{children}</p>
      <Progress value={value} dir={dir} />
    </div>
  );
}
