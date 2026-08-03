import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/largeCard';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/utils/shadcn';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LuFileText as FileText, LuAlertCircle as AlertCircle } from 'react-icons/lu';
import { MdOutlineZoomOutMap, MdZoomInMap } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { Skeleton } from '@/components/ui/skeleton';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { LineNumberGutter } from './lineNumberGutter';
import { ValidationResponse } from './validate';

export default function Editor({
  documentationUrl,
  title,
  PrettyDisplay,
  onContinue,
  text,
  setText,
  handleFormat,
  placeholder,
  handleValidation,
  showLineNumbers,
}: {
  title: React.ReactNode;
  documentationUrl?: string;
  PrettyDisplay: React.FC<{ content: string; onError: (error: Error) => void }>;
  onContinue: (content: string) => void;
  text: string;
  setText: (text: string) => void;
  handleFormat?: (text: string) => Promise<ValidationResponse>;
  placeholder?: string;
  handleValidation?: (text: string) => Promise<ValidationResponse>;
  showLineNumbers?: boolean;
}) {
  const { formatMessage } = useIntl();
  const [isValidating, setIsValidating] = useState(false);
  const [isEditing, setIsEditing] = useState(!text || text.length === 0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const lineCount = showLineNumbers ? text.split('\n').length : 0;
  // the replica must have the exact same text metrics as the textarea for the sizes to match
  const sharedTextClasses = cn(
    'g-font-[monospace] g-text-sm g-leading-relaxed g-py-4 g-pe-4',
    showLineNumbers ? 'g-ps-0' : 'g-ps-4 g-border g-border-transparent'
  );
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [formatFailed, setFormatFailed] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const onFormat = () => {
    if (!handleFormat || isFormatting) return;
    // reset here rather than relying only on onAnimationEnd — with prefers-reduced-motion
    // the shake animation never runs, so animationend never fires
    setFormatFailed(false);
    setIsFormatting(true);
    handleFormat(text)
      .then((result) => {
        // discard stale results: the user may have left edit mode or changed the
        // text while the request was in flight
        const textArea = textAreaRef.current;
        if (!textArea || textArea.disabled || textArea.value !== text) return;
        if ('error' in result) {
          setErrorMessage(result.error.message);
          setFormatFailed(true);
          return;
        }
        const str = result.text;
        if (str === text) return;
        // insertText goes through the browser's edit pipeline, so the reformat
        // lands on the undo stack instead of wiping it like a programmatic value set
        textArea.focus();
        textArea.select();
        if (document.execCommand('insertText', false, str)) return;
        setText(str);
      })
      .catch(() => {
        // ignore format errors
      })
      .finally(() => setIsFormatting(false));
  };

  const handleError = useCallback((error: Error) => {
    setErrorMessage(error.message);
    // setIsEditing(true);
  }, []);

  useLockBodyScroll(isFullScreen);

  useEffect(() => {
    async function validate(str: string) {
      if (!handleValidation) return null;
      setIsValidating(true);
      try {
        const result = await handleValidation(str);
        if ('error' in result) {
          setErrorMessage(result.error.message);
        }
      } catch (err) {
        setErrorMessage('Validation failed due to an unexpected error.');
      }
      setIsValidating(false);
    }
    if (isEditing) {
      setErrorMessage(null);
    } else if (!isEditing && handleValidation && text) {
      validate(text);
    }
  }, [text, isEditing, handleValidation, setText]);

  return (
    <div
      className={cn('g-flex g-justify-center g-transition-colors g-duration-300', {
        'g-fixed g-top-0 g-start-0 g-z-50 g-w-screen g-h-screen': isFullScreen,
      })}
    >
      <Card
        className={cn('g-w-full', {
          'g-h-full g-flex g-flex-col g-rounded-none g-border-none': isFullScreen,
        })}
      >
        <div className="g-p-6 g-border-b dark:g-border-slate-700 g-border-slate-200 g-flex-none">
          <div className="g-flex g-items-end g-justify-between">
            <h1 className="g-text-2xl g-font-bold dark:g-text-white g-text-slate-900 g-hidden md:g-block">
              {title}
            </h1>

            <div className="g-flex g-items-center g-gap-3">
              <div className="g-flex g-items-center g-gap-2 g-h-8 g-me-auto g-flex-none">
                <Label htmlFor="occurrence-download-sql-editing">
                  {isEditing && (
                    <FormattedMessage id="download.stopEditing" defaultMessage="Stop Editing" />
                  )}
                  {!isEditing && (
                    <FormattedMessage id="download.startEditing" defaultMessage="Start Editing" />
                  )}
                </Label>
                <Switch
                  checked={isEditing}
                  onCheckedChange={() => setIsEditing(!isEditing)}
                  id="occurrence-download-sql-editing"
                />
              </div>
              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                aria-label={formatMessage({
                  id: isFullScreen ? 'download.exitFullScreen' : 'download.fullScreen',
                  defaultMessage: isFullScreen ? 'Exit full screen' : 'Full screen',
                })}
                className="g-flex g-items-center g-justify-center g-h-8 g-w-8 g-rounded-md dark:g-text-slate-300 g-text-slate-600 dark:hover:g-bg-slate-700 hover:g-bg-slate-200 g-transition-colors g-duration-200"
              >
                {isFullScreen ? <MdZoomInMap /> : <MdOutlineZoomOutMap />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'dark:g-bg-slate-900 g-bg-slate-50 focus:g-ring-2',
            isEditing
              ? 'g-border-blue-500 g-shadow-blue-500/20 focus:g-ring-blue-500'
              : 'g-border-transparent focus:g-ring-slate-500',
            {
              'g-border-red-500': errorMessage && !isEditing,
              'g-flex-auto g-min-h-0': isFullScreen,
            }
          )}
        >
          <div
            className={cn('g-relative', { 'g-h-full': isFullScreen })}
            onClick={() => {
              errorMessage ? setIsEditing(true) : null;
            }}
          >
            {/* kept mounted (hidden) in view mode — unmounting the textarea would wipe the browser's undo history */}
            <div
              className={cn({
                // same transparent border as the view mode wrapper so the gutter doesn't shift between modes
                'g-flex g-items-start g-overflow-scroll gbif-editor-scrollbar g-bg-slate-50 g-border g-border-transparent':
                  showLineNumbers,
                'g-h-full': isFullScreen,
                'g-h-96': showLineNumbers && !isFullScreen,
                'g-hidden': !isEditing && !!text,
              })}
            >
              {showLineNumbers && (
                <LineNumberGutter
                  lineCount={lineCount}
                  className="g-min-h-full g-py-4 g-bg-slate-50 g-font-[monospace] g-text-sm g-leading-relaxed"
                />
              )}
              <div
                className={cn({
                  'g-flex-auto g-min-h-full g-grid': showLineNumbers,
                  'g-h-full': !showLineNumbers && isFullScreen,
                })}
              >
                {showLineNumbers && (
                  // invisible replica sizes the grid cell to the content, so the shared parent
                  // scrolls gutter and textarea as one — no scroll syncing needed
                  <div
                    aria-hidden="true"
                    className={cn(
                      sharedTextClasses,
                      'g-col-start-1 g-row-start-1 g-invisible g-whitespace-pre'
                    )}
                  >
                    {text + ' '}
                  </div>
                )}
                <textarea
                  ref={textAreaRef}
                  placeholder={placeholder || 'Enter filter here...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  // soft-wrapped lines would break the alignment with the line number gutter
                  wrap={showLineNumbers ? 'off' : undefined}
                  disabled={!isEditing}
                  className={cn(
                    sharedTextClasses,
                    'g-block g-w-full g-bg-slate-50 dark:g-text-slate-100 g-text-slate-900 g-resize-none g-transition-all g-duration-200 focus:g-outline-none',
                    {
                      'g-col-start-1 g-row-start-1 g-overflow-hidden': showLineNumbers,
                      'g-h-full': !showLineNumbers && isFullScreen,
                      'g-h-96': !showLineNumbers && !isFullScreen,
                    }
                  )}
                  spellCheck={false}
                />
              </div>
            </div>
            {!isEditing && text && (
              <div
                className={cn(
                  'g-w-full dark:g-bg-slate-900 g-border g-border-transparent g-bg-slate-50 dark:g-text-slate-100 g-text-slate-900 g-font-[monospace] g-text-sm g-leading-relaxed',
                  {
                    'g-py-4 g-pe-4 g-overflow-scroll gbif-editor-scrollbar': showLineNumbers,
                    'g-p-4 g-overflow-auto': !showLineNumbers,
                    'g-h-full': isFullScreen,
                    'g-h-96': !isFullScreen && showLineNumbers,
                    'g-min-h-96': !isFullScreen && !showLineNumbers,
                    'g-border-red-500': !!errorMessage,
                  }
                )}
              >
                <ErrorBoundary
                  invalidateOn={text}
                  fallback={<ErrorFallback text={text} />}
                  onError={handleError}
                >
                  <PrettyDisplay content={text} onError={() => {}} />
                </ErrorBoundary>
              </div>
            )}

            {isEditing && (
              <div className="g-absolute g-top-2 g-end-4 g-hidden md:g-block">
                <button
                  onClick={onFormat}
                  disabled={isFormatting}
                  onAnimationEnd={() => setFormatFailed(false)}
                  className={cn(
                    'g-px-2 g-py-1 dark:g-bg-slate-700 g-bg-slate-200 dark:hover:g-bg-slate-600 hover:g-bg-slate-300 dark:g-text-white g-text-slate-900 g-text-sm g-rounded-md g-transition-colors g-duration-200 g-border dark:g-border-slate-600 g-border-slate-300 disabled:g-opacity-50',
                    { 'gbif-shake': formatFailed }
                  )}
                >
                  <FormattedMessage id="download.reformat" />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="g-sticky g-bottom-0 g-bg-white g-z-10 g-flex-none">
          {errorMessage && (
            <div className="g-pt-2 g-pb-2 g-min-h-4 g-px-6 g-flex g-gap-2 dark:g-text-red-400 g-text-red-600 g-text-sm g-border-t dark:g-border-slate-700 g-border-slate-200">
              <>
                <AlertCircle className="g-w-4 g-h-4 g-flex-none" />
                <div className="g-flex-auto">
                  <div className="g-font-bold">
                    <FormattedMessage id="download.invalid" />
                  </div>
                  <div className="g-text-sm">{errorMessage}</div>
                </div>
              </>
            </div>
          )}
          <div className="g-p-6 g-border-t dark:g-border-slate-700 g-border-slate-200 g-flex g-items-start g-justify-between">
            {documentationUrl && (
              <Button asChild variant="ghost">
                <a href={documentationUrl} target="_blank" rel="noopener noreferrer" className="">
                  <FileText className="g-w-5 g-h-5 g-me-1" />
                  <FormattedMessage id="download.readTheDocumentation" />
                </a>
              </Button>
            )}

            <div className="g-flex g-flex-col g-items-end g-gap-2">
              {(isEditing || isValidating) && (
                <Button disabled={isValidating} onClick={() => setIsEditing(false)}>
                  <FormattedMessage id="download.validate" />
                </Button>
              )}
              {!isEditing && !isValidating && (
                <Button
                  disabled={!!isEditing || !!errorMessage || !text || text.trim().length === 0}
                  onClick={() => onContinue(text)}
                >
                  <FormattedMessage id="download.continue" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function EditorSkeleton() {
  return <Skeleton className="g-h-96 g-w-full g-max-w-4xl g-mx-auto g-my-6" />;
}

const ErrorFallback = ({ text }: { text: string }) => {
  return <code className="g-block g-whitespace-pre-wrap g-font-[monospace]">{text}</code>;
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
  invalidateOn?: string | number | boolean | object | null;
  onError?: (error: Error) => void;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps | Readonly<ErrorBoundaryProps>) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // We do not have a service to do client logging. Could be nice at some point.
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>) {
    // invalidate the error if the invalidateOn prop changes. Typical use will be the key of the item. Or a filter. Whatever would trigger a new fetch typically
    if (prevProps.invalidateOn !== this.props.invalidateOn) {
      this.setState({
        ...this.state,
        error: null,
      });
    }
  }

  render() {
    const { error } = this.state;

    // if there is no error then just return the children
    if (!error) {
      return this.props.children;
    }

    return (
      this.props.fallback ?? (
        <code className="g-block g-whitespace-pre-wrap g-font-[monospace]">
          Unable to parse input
        </code>
      )
    );
  }
}
