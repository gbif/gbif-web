import { useStringParam } from '@/hooks/useParam';
import { PredicateDisplay } from '../key/predicate';
import Editor from './editor';
import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { validatePredicate, ValidationResponse } from './validate';
import { FormattedMessage, useIntl } from 'react-intl';
import { getOriginalPredicate } from './usePredicate';

//a hook to store content in textarea. per default it should store to url, but if above 1200 characters then use session storage instead
export function useTextAreaContent(key: string): [string, (text: string) => void] {
  const [param, setParam] = useStringParam({ key, replace: true });
  const sessionStorageKey = `textarea-${key}`;
  const sessionValue = window.sessionStorage.getItem(sessionStorageKey) ?? '';

  const setValue = useCallback(
    (text: string) => {
      if (text.length > 1200) {
        window.sessionStorage.setItem(sessionStorageKey, text);
        setParam(undefined);
      } else {
        window.sessionStorage.removeItem(sessionStorageKey);
        setParam(text);
      }
    },
    [sessionStorageKey, setParam]
  );

  return [param || sessionValue, setValue];
}

export function setTextAreaContentStorageDirectly(key: string, text: string) {
  const sessionStorageKey = `textarea-${key}`;
  window.sessionStorage.setItem(sessionStorageKey, text);
}

export default function PredicateEditor({
  onContinue,
}: {
  onContinue: (predicate: string) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  // setSearchParams is not stable (https://github.com/remix-run/react-router/issues/9991)
  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  }, [setSearchParams]);
  const [predicate, setPredicate] = useTextAreaContent('predicate');
  const { formatMessage } = useIntl();

  // wrap this so it doesn't fail on server side rendering
  const referrer = typeof document !== 'undefined' ? document.referrer : '';
  let source = searchParams.get('source');
  try {
    const referrerUrl = new URL(referrer);
    // if source name undefined, then overwrite with referrer hostname
    source = referrerUrl.hostname ?? source;
  } catch (e) {
    // ignore invalid referrer url
  }
  sessionStorage.setItem('downloadSource', source ?? 'unknown');

  useEffect(() => {
    if (!searchParams.get('variablesId')) return;
    const controller = new AbortController();

    const initialize = async () => {
      try {
        const predicateFromVariableId = await getOriginalPredicate(searchParams, controller.signal);
        if (controller.signal.aborted || !predicateFromVariableId) return;
        // Write predicate to sessionStorage or URL param and clear variablesId atomically
        // in a single setSearchParams call to avoid a React Router race where two
        // consecutive setSearchParams calls each see the original params and the second
        // overwrites the first.
        if (predicateFromVariableId.length > 1200) {
          window.sessionStorage.setItem('textarea-predicate', predicateFromVariableId);
          setSearchParamsRef.current(
            (params) => {
              const next = new URLSearchParams(params);
              next.delete('predicate');
              next.delete('variablesId');
              return next;
            },
            { replace: true, preventScrollReset: true }
          );
        } else {
          window.sessionStorage.removeItem('textarea-predicate');
          setSearchParamsRef.current(
            (params) => {
              const next = new URLSearchParams(params);
              next.set('predicate', predicateFromVariableId);
              next.delete('variablesId');
              return next;
            },
            { replace: true, preventScrollReset: true }
          );
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          console.error('Failed to load predicate from variablesId:', e);
        }
      }
    };

    initialize();
    return () => controller.abort();
  }, [searchParams]);

  const handleFormat = useCallback(
    async (text: string): Promise<ValidationResponse> => {
      try {
        const obj = JSON.parse(text);
        return { text: JSON.stringify(obj, null, 2) };
      } catch (error) {
        return {
          error: {
            type: 'invalid',
            message: formatMessage({
              id: 'download.predicate.invalidJson',
              defaultMessage: 'The provided predicate is not valid JSON',
            }),
          },
        };
      }
    },
    [formatMessage]
  );

  const handleValidation = useCallback(
    (str: string) => validatePredicate(str, formatMessage),
    [formatMessage]
  );

  return (
    <Editor
      title={<FormattedMessage id="download.predicateEditor" />}
      documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
      PrettyDisplay={PredicateVisual}
      onContinue={onContinue}
      text={predicate ?? ''}
      setText={setPredicate}
      handleFormat={handleFormat}
      handleValidation={handleValidation}
      placeholder={formatMessage({ id: 'download.request.placeholder' })}
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
