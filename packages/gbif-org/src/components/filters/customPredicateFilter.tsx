import { FilterContext } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  LuAlertCircle as AlertCircle,
  LuFileText as FileText,
  LuLoader as Loader,
} from 'react-icons/lu';
import { MdCleaningServices, MdClose, MdInfoOutline, MdModeEdit, MdPreview } from 'react-icons/md';
import { interopDefault } from '@/utils/interopDefault';
import _useLocalStorage from 'use-local-storage';
// Used to import commonjs module as es6 module
const useLocalStorage = interopDefault(_useLocalStorage);
import { FormattedMessage, useIntl } from 'react-intl';
import { PredicateDisplay } from '@/routes/occurrence/download/key/predicate';
import { validatePredicate } from '@/routes/occurrence/download/editor/validate';
import { ApplyCancel } from './filterTools';

type CustomPredicateFilterProps = {
  filterHandle: string;
  onApply?: ({
    keepOpen,
    filter,
  }?: {
    keepOpen?: boolean;
    filter?: import('@/contexts/filter').FilterType;
  }) => void;
  onCancel?: () => void;
  className?: string;
  style?: React.CSSProperties;
  pristine?: boolean;
};

export const CustomPredicateFilter = React.forwardRef<HTMLDivElement, CustomPredicateFilterProps>(
  ({ className, filterHandle, onApply, onCancel, style }, ref) => {
    const { filter, setField, filterHash } = useContext(FilterContext);
    const { formatMessage } = useIntl();
    const [text, setText] = useState<string>('');
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [pristine, setPristine] = useState(true);
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [showExtendedHelp, setShowExtendedHelp] = useLocalStorage<boolean>(
      'gbif-predicate-filter-help-visible',
      true
    );
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      const current = filter?.must?.[filterHandle]?.[0];
      let nextText = '';
      let hasExisting = false;
      let parsedValue: unknown = null;
      let parseFailed = false;
      if (typeof current === 'string' && current.trim().length > 0) {
        nextText = current;
        hasExisting = true;
        try {
          parsedValue = JSON.parse(current);
        } catch {
          parseFailed = true;
        }
      } else if (current && typeof current === 'object') {
        // URL params are auto-parsed (see querystring.tryParse), so the stored
        // value is the predicate object — re-serialize it for the textarea.
        try {
          nextText = JSON.stringify(current, null, 2);
          hasExisting = true;
          parsedValue = current;
        } catch {
          nextText = '';
        }
      }
      setText(nextText);
      // Only open in preview when the value is parseable. Malformed JSON drops
      // back to edit mode so the user can correct it.
      setShowPreview(hasExisting && !parseFailed);
      setPristine(true);
      setValidationError(null);
      setIsValidating(false);
      // No existing predicate → start in edit mode and focus the textarea.
      // (The wrapper div below absorbs the popover's auto-focus call as a no-op.)
      if (!hasExisting) {
        textareaRef.current?.focus();
        return;
      }
      // Existing predicate — the URL value can't be trusted, so validate it
      // and surface any error. Local JSON errors already show via parsed.error;
      // here we just check semantic validity against the server.
      if (parseFailed || parsedValue == null) return;
      let cancelled = false;
      setIsValidating(true);
      validatePredicate(JSON.stringify(parsedValue), formatMessage)
        .then((result) => {
          if (cancelled) return;
          setIsValidating(false);
          if ('error' in result && result.error.type === 'invalid') {
            setValidationError(result.error.message);
          }
        })
        .catch(() => {
          if (cancelled) return;
          setIsValidating(false);
        });
      return () => {
        cancelled = true;
      };
      // we track the filterHash instead of the filter object itself.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterHash, filterHandle]);

    const parsed = useMemo(() => {
      const trimmed = text?.trim();
      if (!trimmed) return { value: null as unknown, error: null as string | null };
      try {
        return { value: JSON.parse(trimmed), error: null };
      } catch (e) {
        return {
          value: null,
          error: formatMessage({
            id: 'filterSupport.predicate.invalidJson',
            defaultMessage: 'The provided predicate is not valid JSON',
          }),
        };
      }
    }, [text, formatMessage]);

    const handleFormat = () => {
      if (parsed.value == null) return;
      setText(JSON.stringify(parsed.value, null, 2));
    };

    const handleApply = useCallback(async () => {
      const trimmed = text?.trim() ?? '';
      if (!trimmed) {
        const next = setField(filterHandle, []);
        onApply?.({ keepOpen: false, filter: next });
        return;
      }
      if (parsed.error || parsed.value == null) return;

      // Store the predicate as compact JSON so the URL stays small. The textarea
      // re-formats with indentation when re-opened.
      const compact = JSON.stringify(parsed.value);

      setIsValidating(true);
      setValidationError(null);
      const result = await validatePredicate(compact, formatMessage);
      setIsValidating(false);

      if ('error' in result) {
        setValidationError(result.error.message);
        if (result.error.type === 'network-error') {
          // Network errors are non-blocking — apply anyway but keep the warning visible
          const next = setField(filterHandle, [compact]);
          onApply?.({ keepOpen: false, filter: next });
        }
        return;
      }

      const next = setField(filterHandle, [compact]);
      onApply?.({ keepOpen: false, filter: next });
    }, [text, parsed.error, parsed.value, filterHandle, setField, onApply, formatMessage]);

    return (
      // The popover's onOpenAutoFocus calls `.focus()` on the forwarded ref to
      // bypass Radix's default tabbable-first focus. We attach the ref to this
      // plain div (no tabIndex) so the call becomes a no-op — focus is then
      // either set by our effect (textarea, in edit mode) or stays where it
      // was (preview mode opens with nothing focused).
      <div
        ref={ref}
        style={style}
        className={cn(
          'g-flex g-flex-col g-flex-1 g-min-h-0 g-max-h-[var(--radix-popover-content-available-height,100dvh)]',
          className
        )}
      >
        <div className="g-flex g-flex-col g-flex-auto g-min-h-0 g-p-3">
          {showExtendedHelp && (
            <div
              dir="auto"
              className="g-relative g-text-slate-700 g-text-sm g-bg-slate-100 g-p-4 g-pe-9 g-mb-2 g-border g-border-solid g-rounded"
            >
              <FormattedMessage
                id="filterSupport.predicate.helpExtended"
                defaultMessage="This is an expert tool for building complex queries that can't be expressed with the standard filters. See the documentation for the full predicate reference and examples."
              />
              <button
                type="button"
                onClick={() => setShowExtendedHelp(false)}
                title={formatMessage({
                  id: 'filterSupport.predicate.hideHelp',
                  defaultMessage: 'Hide help',
                })}
                className="g-absolute g-top-2 g-end-2 g-p-1 g-text-slate-500 hover:g-text-slate-700 g-rounded"
              >
                <MdClose className="g-w-4 g-h-4" />
              </button>
            </div>
          )}
          <div className="g-flex g-items-start g-gap-2 g-mb-2">
            <div dir="auto" className="g-text-xs g-text-slate-500 g-flex-auto g-min-w-0">
              <FormattedMessage
                id="filterSupport.predicate.help"
                defaultMessage="Enter a GBIF occurrence predicate as JSON. It will be combined with the other filters using AND."
              />
            </div>
            {!showExtendedHelp && (
              <button
                type="button"
                onClick={() => setShowExtendedHelp(true)}
                title={formatMessage({
                  id: 'filterSupport.predicate.showHelp',
                  defaultMessage: 'Show help',
                })}
                className="g-flex-none g-text-slate-500 hover:g-text-slate-700 g-rounded"
              >
                <MdInfoOutline className="g-w-4 g-h-4" />
              </button>
            )}
          </div>
          <div className="g-relative">
            {!showPreview && (
              <textarea
                ref={textareaRef}
                dir="ltr"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setPristine(false);
                  setValidationError(null);
                }}
                spellCheck={false}
                placeholder={formatMessage({
                  id: 'filterSupport.predicate.placeholder',
                  defaultMessage: '{\n  "type": "equals",\n  "key": "COUNTRY",\n  "value": "DK"\n}',
                })}
                className="g-block g-font-[monospace] g-w-full g-h-64 g-p-3 g-bg-slate-50 g-text-slate-900 g-text-xs g-leading-relaxed g-resize-none g-border g-border-slate-200 g-rounded focus:g-outline-none focus:g-ring-2 focus:g-ring-blue-500"
              />
            )}
            {showPreview && (
              <div
                dir="ltr"
                className="g-block g-w-full g-h-64 g-overflow-auto g-p-3 g-bg-slate-50 g-text-slate-900 g-text-xs g-leading-relaxed g-border g-border-slate-200 g-rounded"
              >
                {parsed.value != null ? (
                  <div className="gbif-predicates">
                    <PredicateDisplay predicate={parsed.value} />
                  </div>
                ) : (
                  <div dir="auto" className="g-text-slate-400">
                    <FormattedMessage
                      id="filterSupport.predicate.emptyPreview"
                      defaultMessage="Nothing to preview"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="g-flex g-items-center g-gap-2 g-mt-2">
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="g-flex g-items-center g-justify-center g-gap-1 g-min-w-11 g-min-h-11 g-p-2 sm:g-min-w-0 sm:g-min-h-0 sm:g-px-2 sm:g-py-1 g-text-xs g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-700 g-rounded g-border g-border-slate-200"
              title={formatMessage({
                id: showPreview
                  ? 'filterSupport.predicate.edit'
                  : 'filterSupport.predicate.preview',
                defaultMessage: showPreview ? 'Edit' : 'Preview',
              })}
            >
              {showPreview ? (
                <>
                  <MdModeEdit className="g-w-5 g-h-5 sm:g-hidden" />
                  <span className="g-hidden sm:g-inline">
                    <FormattedMessage id="filterSupport.predicate.edit" defaultMessage="Edit" />
                  </span>
                </>
              ) : (
                <>
                  <MdPreview className="g-w-5 g-h-5 sm:g-hidden" />
                  <span className="g-hidden sm:g-inline">
                    <FormattedMessage
                      id="filterSupport.predicate.preview"
                      defaultMessage="Preview"
                    />
                  </span>
                </>
              )}
            </button>
            {!showPreview && (
              <button
                type="button"
                onClick={handleFormat}
                disabled={parsed.value == null}
                className="g-flex g-items-center g-justify-center g-gap-1 g-min-w-11 g-min-h-11 g-p-2 sm:g-min-w-0 sm:g-min-h-0 sm:g-px-2 sm:g-py-1 g-text-xs g-bg-slate-100 hover:g-bg-slate-200 disabled:g-opacity-50 g-text-slate-700 g-rounded g-border g-border-slate-200"
                title={formatMessage({
                  id: 'filterSupport.predicate.reformat',
                  defaultMessage: 'Reformat',
                })}
              >
                <MdCleaningServices className="g-w-5 g-h-5 sm:g-hidden" />
                <span className="g-hidden sm:g-inline">
                  <FormattedMessage
                    id="filterSupport.predicate.reformat"
                    defaultMessage="Reformat"
                  />
                </span>
              </button>
            )}
            <a
              href="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
              target="_blank"
              rel="noopener noreferrer"
              className="g-ms-auto g-flex g-items-center g-justify-center g-gap-1 g-min-w-11 g-min-h-11 g-p-2 sm:g-min-w-0 sm:g-min-h-0 sm:g-px-2 sm:g-py-1 g-text-xs g-text-blue-600 hover:g-underline"
              title={formatMessage({
                id: 'filterSupport.predicate.documentation',
                defaultMessage: 'Documentation',
              })}
            >
              <FileText className="g-w-5 g-h-5 sm:g-w-3 sm:g-h-3" />
              <span className="g-hidden sm:g-inline">
                <FormattedMessage
                  id="filterSupport.predicate.documentation"
                  defaultMessage="Documentation"
                />
              </span>
            </a>
          </div>
          {isValidating && (
            <div className="g-mt-2 g-flex g-gap-2 g-items-center g-text-xs g-text-slate-500">
              <Loader className="g-w-3 g-h-3 g-animate-spin" />
              <span dir="auto">
                <FormattedMessage
                  id="filterSupport.predicate.validating"
                  defaultMessage="Validating…"
                />
              </span>
            </div>
          )}
          {!isValidating && ((parsed.error && text.trim().length > 0) || validationError) ? (
            <div className="g-mt-2 g-flex g-gap-2 g-items-start g-text-xs g-text-red-600">
              <AlertCircle className="g-w-4 g-h-4 g-mt-0.5 g-flex-none" />
              <div dir="auto">{parsed.error ?? validationError}</div>
            </div>
          ) : null}
        </div>
        <ApplyCancel
          onApply={() => {
            if (parsed.error || isValidating) return;
            handleApply();
          }}
          onCancel={onCancel}
          pristine={pristine}
          disabled={isValidating}
        />
      </div>
    );
  }
);
