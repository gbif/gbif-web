import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, DiscreteCardTitle } from '@/components/ui/largeCard';
import { Switch } from '@/components/ui/switch';
import { Setter } from '@/types';
import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';
import { Mode } from '..';
import { PredicateDisplay, PredicateDisplaySkeleton } from '../../../key/predicate';

type Props = {
  loading: boolean;
  predicate: string | undefined;
  setPredicate: Setter<string | undefined>;
  mode: Mode;
  setMode: Setter<Mode>;
  validationError: JSONValidationError | undefined;
  setValidationError: Setter<JSONValidationError | undefined>;
};

export function CurrentFilterCard({
  loading,
  predicate,
  mode,
  setMode,
  validationError,
  setValidationError,
  setPredicate,
}: Props) {
  const { formatMessage } = useIntl();

  const codeElementRef = useRef<HTMLElement>(null);
  const textareaElementRef = useRef<HTMLTextAreaElement>(null);
  const textAreaMinHeight = useRef<number>(500);

  async function onCheckedChange(checked: boolean) {
    const newMode: Mode = checked ? 'editing' : 'viewing';
    setMode(newMode);

    if (newMode === 'editing') {
      // Set the min height of the textarea to the height to the code element
      // The code element will only be showen if there is an error in the predicate,
      // but this makes the transition from viewing to editing the error smoother
      const currentCodeBlockHeight = codeElementRef.current?.clientHeight;
      if (typeof currentCodeBlockHeight === 'number') {
        textAreaMinHeight.current = currentCodeBlockHeight;
      }

      reformat();
    }
  }

  const reformat = useCallback(async () => {
    if (!predicate) return;

    const result = formatJSON(predicate, formatMessage);

    if ('error' in result) setValidationError(result.error);
    else {
      setPredicate(result.json);
      setValidationError(undefined);
    }
  }, [predicate, setPredicate, setValidationError, formatMessage]);

  // Trigger reformt if the predicate changes while in viewing mode (this will sync the error handling)
  useEffect(() => {
    if (mode === 'viewing') {
      reformat();
    }
  }, [reformat, mode]);

  return (
    <>
      <DiscreteCardTitle>
        <FormattedMessage id="download.request.currentFilter" defaultMessage="Current filter" />
      </DiscreteCardTitle>

      <Card>
        <EditorHeader
          mode={mode}
          hasError={validationError != null}
          onCheckedChange={onCheckedChange}
          reformat={reformat}
        />

        {loading && (
          <div className="g-p-4">
            <PredicateDisplaySkeleton />
          </div>
        )}

        {!loading && mode === 'editing' && (
          <textarea
            ref={textareaElementRef}
            style={{ minHeight: textAreaMinHeight.current }}
            autoFocus
            value={predicate}
            onChange={(event) => setPredicate(event.target.value)}
            className="g-font-[monospace] g-block g-w-full g-bg-white g-p-4"
          />
        )}

        {!loading && mode === 'viewing' && (
          <ErrorBoundary
            invalidateOn={predicate}
            fallback={
              <PredicateErrorFallback
                ref={codeElementRef}
                predicate={predicate}
                jsonError={validationError != null}
                reformat={reformat}
              />
            }
          >
            <PredicateVisualizer predicate={predicate} />
          </ErrorBoundary>
        )}

        {validationError && <EditorFooter validationError={validationError} />}
      </Card>
    </>
  );
}

type PredicateVisualizerProps = {
  predicate?: string;
};

function PredicateVisualizer({ predicate }: PredicateVisualizerProps) {
  if (!predicate) {
    return (
      <div className="g-p-8">
        <p className="g-text-center">
          <FormattedMessage id="download.request.noPredicate" defaultMessage="No predicate" />
        </p>
      </div>
    );
  }

  return (
    <div className="gbif-predicates g-p-4">
      <PredicateDisplay predicate={JSON.parse(predicate)} />
    </div>
  );
}

type PredicateErrorFallbackProps = {
  reformat(fallbackError?: JSONValidationError): void;
  predicate?: string;
  jsonError: boolean;
};

const PredicateErrorFallback = forwardRef<HTMLElement, PredicateErrorFallbackProps>(
  ({ reformat, predicate, jsonError }, ref) => {
    const { formatMessage } = useIntl();

    useEffect(() => {
      return () => {
        reformat();
      };
    }, [reformat]);

    return (
      <>
        <code ref={ref} className="g-p-4 g-block g-whitespace-pre-wrap g-font-[monospace]">
          {predicate}
        </code>
        {!jsonError && (
          <EditorFooter
            validationError={{
              type: 'invalid-predicate',
              message: formatMessage({
                id: 'download.request.errors.failedToVisualizePredicate',
                defaultMessage: 'Failed to visualize predicate',
              }),
            }}
          />
        )}
      </>
    );
  }
);

type EditorHeaderProps = {
  mode: Mode;
  onCheckedChange(checked: boolean): void;
  reformat(): void;
  hasError: boolean;
};

function EditorHeader({ mode, onCheckedChange, reformat }: EditorHeaderProps) {
  return (
    <div className="g-z-10 g-flex g-items-center g-gap-2 g-border-b g-p-4 g-sticky g-top-0 g-bg-white g-flex-wrap">
      <div className="g-flex g-items-center g-gap-2 g-h-8 g-mr-auto">
        <Switch
          checked={mode === 'editing'}
          onCheckedChange={onCheckedChange}
          id="occurrence-download-predicate-editing"
        />
        <Label htmlFor="occurrence-download-predicate-editing">
          {mode === 'editing' && (
            <FormattedMessage id="download.stopEditing" defaultMessage="Stop Editing" />
          )}
          {mode === 'viewing' && (
            <FormattedMessage id="download.startEditing" defaultMessage="Start Editing" />
          )}
        </Label>
      </div>

      {mode === 'editing' && (
        <Button variant="outline" size="sm" onClick={reformat}>
          <FormattedMessage id="download.reformat" defaultMessage="Reformat" />
        </Button>
      )}

      {mode === 'viewing' && (
        <div className="g-flex g-gap-2 g-w-full sm:g-w-auto">
          <Button size="sm" asChild variant="outline">
            <a href="https://techdocs.gbif.org/en/openapi/v1/occurrence#/download">
              <FormattedMessage
                id="download.readTheDocumentation"
                defaultMessage="Read the documentation"
              />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

type EditorFooterProps = {
  validationError: JSONValidationError;
};

function EditorFooter({ validationError }: EditorFooterProps) {
  return (
    <div className="g-sticky g-bottom-0 g-bg-slate-50 g-border-t g-p-4">
      <div className="g-gap-2 g-space-x-2">
        <span className="g-text-nowrap g-bg-red-500 g-text-white g-text-xs g-font-semibold g-py-1 g-px-2 g-rounded-full">
          <FormattedMessage
            id={`download.request.errors.${validationError.type}`}
            defaultMessage={validationError.type}
          />
        </span>
        <span className="g-text-red-500 ">{validationError.message}</span>
      </div>
    </div>
  );
}

type JSONValidationErrorType = 'invalid-json' | 'invalid-predicate' | 'faild-to-load-predicate';

export type JSONValidationError = {
  type: JSONValidationErrorType;
  message: string;
};

type FormatJSONResult =
  | { json: string }
  | {
      error: JSONValidationError;
    };

function formatJSON(json: string, formatMessage: IntlShape['formatMessage']): FormatJSONResult {
  try {
    const parsed = JSON.parse(json);
    const formatted = JSON.stringify(parsed, null, 2);

    return {
      json: formatted,
    };
  } catch (e) {
    return {
      error: {
        type: 'invalid-json',
        message:
          e instanceof Error
            ? e.message
            : formatMessage({
                id: 'download.request.errors.failedToParseJSON',
                defaultMessage: 'Failed to parse JSON',
              }),
      },
    };
  }
}
