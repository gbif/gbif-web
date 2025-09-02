import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useState } from 'react';
import { CurrentFilterCard, JSONValidationError } from './components/currentFilterCard';
import { DownloadOptionsCard } from './components/downloadOptionsCard';
import { RestoredPredicateNotice } from './components/restoredPredicateNotice';
import { usePredicate } from './usePredicate';

export type Mode = 'editing' | 'viewing';

export function OccurrenceDownloadRequestCreate() {
  const {
    loading,
    error: predicateError,
    predicate,
    setPredicate,
    wasLoadedFromSession,
    discardSessionPredicate,
  } = usePredicate();

  const [validationError, setValidationError] = useState<JSONValidationError>();
  const [mode, setMode] = useState<Mode>('viewing');

  useEffect(() => {
    if (predicateError) {
      setValidationError({ type: 'faild-to-load-predicate', message: predicateError });
    }
  }, [predicateError]);

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <RestoredPredicateNotice
          show={!loading && wasLoadedFromSession}
          discard={discardSessionPredicate}
        />

        <CurrentFilterCard
          loading={loading}
          predicate={predicate}
          setPredicate={setPredicate}
          mode={mode}
          setMode={setMode}
          validationError={validationError}
          setValidationError={setValidationError}
        />

        {!validationError && !predicateError && mode === 'viewing' && <DownloadOptionsCard />}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
