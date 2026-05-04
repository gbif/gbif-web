import { FormSuccess } from '@/components/formSuccess';
import { ProtectedForm } from '@/components/protectedForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfig } from '@/config/config';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { FormInitialValues, RegistrationForm } from './registrationForm';
import { RegistrationResult } from './types';
import {
  DerivedDatasetRecord,
  fetchAllDerivedDatasetRows,
  fetchDerivedDataset,
} from './utils';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'not-found' }
  | { kind: 'error'; message: string }
  | { kind: 'loaded'; record: DerivedDatasetRecord; initialValues: FormInitialValues };

export default function EditDerivedDatasetPage() {
  const { doiPrefix, doiSuffix } = useParams<{ doiPrefix: string; doiSuffix: string }>();
  const config = useConfig();
  const [load, setLoad] = useState<LoadState>({ kind: 'loading' });
  const [result, setResult] = useState<RegistrationResult | null>(null);

  const doi = doiPrefix && doiSuffix ? `${doiPrefix}/${doiSuffix}` : '';

  useEffect(() => {
    if (!doiPrefix || !doiSuffix) {
      setLoad({ kind: 'error', message: 'Missing DOI in URL.' });
      return;
    }
    const controller = new AbortController();
    setLoad({ kind: 'loading' });

    Promise.all([
      fetchDerivedDataset(config.v1Endpoint, doiPrefix, doiSuffix, controller.signal),
      fetchAllDerivedDatasetRows(config.v1Endpoint, doiPrefix, doiSuffix, controller.signal),
    ])
      .then(([record, rows]) => {
        const initialValues: FormInitialValues = {
          title: record.title ?? '',
          sourceUrl: record.sourceUrl ?? '',
          description: record.description ?? '',
          originalDownloadDOI: record.originalDownloadDOI ?? '',
          registrationDate: record.registrationDate
            ? record.registrationDate.slice(0, 10)
            : '',
          rows: rows.length > 0 ? rows : [{ key: '', val: '' }],
        };
        setLoad({ kind: 'loaded', record, initialValues });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        if (err instanceof Error && err.message === 'not-found') {
          setLoad({ kind: 'not-found' });
        } else {
          const message =
            err instanceof Error ? err.message : 'Could not load the derived dataset.';
          setLoad({ kind: 'error', message });
        }
      });

    return () => controller.abort();
  }, [config.v1Endpoint, doiPrefix, doiSuffix]);

  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-pt-8 g-pb-12">
        <Card className="g-bg-white g-overflow-hidden">
          <div className="g-px-6 g-pt-6 g-pb-4 g-border-b g-border-slate-100">
            <h2 className="g-text-base g-font-semibold g-text-slate-800">
              <FormattedMessage
                id="tools.derivedDataset.editDataset"
                defaultMessage="Edit derived dataset"
              />
            </h2>
            {doi && (
              <p className="g-text-slate-500 g-text-sm g-mt-1">
                <code>{doi}</code>
              </p>
            )}
          </div>

          <div className="g-p-6">
            <ProtectedForm
              title={
                <FormattedMessage
                  id="tools.derivedDataset.loginRequiredTitle"
                  defaultMessage="Sign in to edit this derived dataset"
                />
              }
              message={
                <FormattedMessage
                  id="tools.derivedDataset.loginRequiredEditMessage"
                  defaultMessage="A GBIF account is required to edit a derived dataset."
                />
              }
            >
              {result ? (
                <FormSuccess
                  title={
                    <FormattedMessage
                      id="tools.derivedDataset.editCompleted"
                      defaultMessage="Changes saved"
                    />
                  }
                  message={
                    <FormattedMessage
                      id="tools.derivedDataset.editCompletedMessage"
                      defaultMessage="Your changes to {doi} have been saved."
                      values={{ doi: <code>{result.doi || doi}</code> }}
                    />
                  }
                  action={
                    <Button asChild>
                      <a
                        href={`https://doi.org/${result.doi || doi}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FormattedMessage
                          id="tools.derivedDataset.goToDataset"
                          defaultMessage="Go to dataset"
                        />
                      </a>
                    </Button>
                  }
                />
              ) : load.kind === 'loading' ? (
                <LoadingSkeleton />
              ) : load.kind === 'not-found' ? (
                <ErrorMessage>
                  <FormattedMessage
                    id="tools.derivedDataset.notFound"
                    defaultMessage="No derived dataset was found for {doi}."
                    values={{ doi: <code>{doi}</code> }}
                  />
                </ErrorMessage>
              ) : load.kind === 'error' ? (
                <ErrorMessage>{load.message}</ErrorMessage>
              ) : (
                <RegistrationForm
                  mode="edit"
                  doi={doi}
                  initialValues={load.initialValues}
                  onSuccess={setResult}
                />
              )}
            </ProtectedForm>
          </div>
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}

function LoadingSkeleton() {
  return (
    <div className="g-flex g-flex-col g-gap-4">
      <Skeleton className="g-h-10" />
      <Skeleton className="g-h-10" />
      <Skeleton className="g-h-32" />
      <Skeleton className="g-h-40" />
    </div>
  );
}

function ErrorMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="alert"
      className="g-bg-red-50 g-text-red-700 g-rounded-lg g-px-4 g-py-3 g-text-sm"
    >
      {children}
    </div>
  );
}
