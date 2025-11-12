import { useStringParam } from '@/hooks/useParam';
import { PredicateDisplay } from '../key/predicate';
import { getOriginalPredicate } from '../request/create/usePredicate';
import Editor from './editor';
import { useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validatePredicate } from './validate';
import { useIntl } from 'react-intl';

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
  onContinue: (predicate: string) => void;
}) {
  const [searchParams] = useSearchParams();
  const [queryId, setQueryId] = useStringParam({ key: 'queryId', replace: true });
  const [variablesId, setVariablesId] = useStringParam({ key: 'variablesId', replace: true });
  const [predicate, setPredicate] = useTextAreaContent('predicate');
  const { formatMessage } = useIntl();

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

  const handleFormat = useCallback(async (text: string) => {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return text;
    }
  }, []);

  const handleValidation = useCallback(
    (str: string) => validatePredicate(str, formatMessage),
    [formatMessage]
  );

  return (
    <Editor
      title="Predicate Editor"
      documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
      PrettyDisplay={PredicateVisual}
      onContinue={onContinue}
      text={predicate ?? ''}
      setText={setPredicate}
      handleFormat={handleFormat}
      handleValidation={handleValidation}
    />
  );
}

function PredicateVisual({ content }: { content: string; onError: (error: Error) => void }) {
  return (
    <div className="gbif-predicates">
      <PredicateDisplay predicate={content} />
    </div>
  );
}
