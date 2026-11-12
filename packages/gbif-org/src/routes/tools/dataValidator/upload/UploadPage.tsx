import { ProtectedForm } from '@/components/protectedForm';
import { useConfig } from '@/config/config';
import { UserError, useUser } from '@/contexts/UserContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useToolUnsavedGuard } from '../../_shared/useToolUnsavedGuard';
import {
  MAX_UPLOAD_BYTES,
  submitFile,
  submitUrl,
  ValidatorErrorKind,
  validatorErrorKind,
  ValidatorHttpError,
} from '../data/validatorApi';
import { UploadForm } from './UploadForm';

type Submit = (token: string, signal: AbortSignal) => Promise<{ key: string }>;

function isAuthError(error: unknown) {
  return error instanceof ValidatorHttpError && (error.status === 401 || error.status === 403);
}

function toErrorKind(error: unknown): ValidatorErrorKind {
  if (error instanceof UserError && error.type === 'UNKNOWN_USER') return 'unauthorized';
  return validatorErrorKind(error);
}

export default function UploadPage() {
  const { getApiToken } = useUser();
  const { v1Endpoint } = useConfig();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | undefined>();
  const [error, setError] = useState<ValidatorErrorKind | undefined>();
  const [submittedKey, setSubmittedKey] = useState<string | undefined>();
  const controller = useRef<AbortController>();

  useEffect(() => () => controller.current?.abort(), []);

  useEffect(() => {
    if (!busy) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [busy]);

  useToolUnsavedGuard(busy);

  // navigate only once busy is false, or the unsaved-work guard would block it
  useEffect(() => {
    if (submittedKey && !busy) navigate(encodeURIComponent(submittedKey));
  }, [submittedKey, busy, navigate]);

  const run = useCallback(
    async (submit: Submit) => {
      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      setError(undefined);
      setBusy(true);
      try {
        let result: { key: string };
        try {
          result = await submit(await getApiToken(), current.signal);
        } catch (err) {
          if (!isAuthError(err)) throw err;
          result = await submit(await getApiToken({ forceRefresh: true }), current.signal);
        }
        setSubmittedKey(result.key);
      } catch (err) {
        if (current.signal.aborted) return;
        setError(toErrorKind(err));
        setProgress(undefined);
      } finally {
        if (!current.signal.aborted) setBusy(false);
      }
    },
    [getApiToken]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (file.size > MAX_UPLOAD_BYTES) {
        setError('tooLarge');
        setProgress(undefined);
        return;
      }
      setProgress(0);
      run((token, signal) =>
        submitFile({ v1Endpoint, token, file, signal, onProgress: setProgress })
      );
    },
    [run, v1Endpoint]
  );

  const handleUrl = useCallback(
    (fileUrl: string) => {
      setProgress(undefined);
      run((token, signal) => submitUrl({ v1Endpoint, token, fileUrl, signal }));
    },
    [run, v1Endpoint]
  );

  return (
    <ProtectedForm
      className="g-bg-white g-flex-1"
      title={
        <FormattedMessage
          id="tools.dataValidator.loginTitle"
          defaultMessage="Sign in to validate your data"
        />
      }
      message={
        <FormattedMessage
          id="tools.dataValidator.loginMessage"
          defaultMessage="You need a GBIF account to use the data validator."
        />
      }
    >
      <UploadForm
        busy={busy}
        progress={progress}
        error={error}
        onFile={handleFile}
        onUrl={handleUrl}
      />
    </ProtectedForm>
  );
}
