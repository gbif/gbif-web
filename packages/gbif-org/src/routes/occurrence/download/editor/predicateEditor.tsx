import { useStringParam } from '@/hooks/useParam';
import { PredicateDisplay } from '../key/predicate';
import { RestoredPredicateNotice } from '../request/create/components/restoredPredicateNotice';
import { getOriginalPredicate, usePredicate } from '../request/create/usePredicate';
import Editor, { EditorSkeleton } from './editor';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

//a hook to store content in textarea. per default it should store to url, but if above 1200 characters then use session storage instead
function useTextAreaContent(key: string): [string, (text: string) => void] {
  const [param, setParam] = useStringParam({ key, replace: true });
  const sessionStorageKey = `textarea-${key}`;
  const sessionValue = window.sessionStorage.getItem(sessionStorageKey) ?? '';

  function setValue(text: string) {
    if (text.length > 1200) {
      window.sessionStorage.setItem(sessionStorageKey, text);
      setParam(undefined);
    } else {
      window.sessionStorage.removeItem(sessionStorageKey);
      setParam(text);
    }
  }

  return [param || sessionValue, setValue];
}

export default function PredicateEditor({
  onContinue,
}: {
  onContinue: (predicate?: string) => void;
}) {
  const [searchParams] = useSearchParams();
  const [queryId, setQueryId] = useStringParam({ key: 'queryId', replace: true });
  const [variablesId, setVariablesId] = useStringParam({ key: 'variablesId', replace: true });
  const [predicate, setPredicate] = useTextAreaContent('predicate');
  // const [predicate, setPredicate] = useStringParam({ key: 'predicate', replace: true });

  useEffect(() => {
    if (predicate || !searchParams.get('queryId')) return;
    const controller = new AbortController();

    const initialize = async () => {
      try {
        const predicateFromQueryId = await getOriginalPredicate(searchParams, controller.signal);
        if (predicate || !queryId) return;
        setTimeout(() => {
          // set queryid to null and once that is done set predicate
          setPredicate(predicateFromQueryId ?? '');
        }, 1);
      } catch (e) {
        // ignore errors
      }
    };

    initialize();
    return () => controller.abort();
  }, [searchParams, setPredicate, predicate, queryId]);

  useEffect(() => {
    if (predicate && (queryId || variablesId)) {
      setQueryId(undefined);
      setVariablesId(undefined);
    }
  }, [predicate, setQueryId, setVariablesId, queryId, variablesId]);
  // const {
  //   loading,
  //   error: predicateError,
  //   predicate,
  //   setPredicate,
  //   wasLoadedFromSession,
  //   discardSessionPredicate,
  // } = usePredicate();

  return (
    <Editor
      title="Predicate Editor"
      documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
      PrettyDisplay={PredicateVisual}
      onContinue={onContinue}
      text={predicate ?? ''}
      setText={setPredicate}
    />
  );
}

function PredicateVisual({
  content,
  onError,
}: {
  content: string;
  onError: (error: Error) => void;
}) {
  return (
    <div className="gbif-predicates">
      <PredicateDisplay predicate={content} />
    </div>
  );
}
