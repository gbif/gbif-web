import { Callout } from '@/components/callout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/largeCard';
import { Switch } from '@/components/ui/switch';
import { useStringParam } from '@/hooks/useParam';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { highlight } from 'sql-highlight';
import { SQLValidationError, validateSql } from './validateSql';

type Mode = 'editing' | 'viewing';

export function OccurrenceDownloadSqlCreate() {
  const [sql, setSql] = useStringParam({ key: 'sql', replace: true });
  const [validationError, setValidationError] = useState<SQLValidationError>();
  const [mode, setMode] = useState<Mode>('viewing');
  const { formatMessage } = useIntl();

  const highlightedHtml = useMemo(() => {
    if (mode === 'editing' || !sql) return null;
    return highlight(sql, {
      html: true,
    });
  }, [sql, mode]);

  const codeElement = useRef<HTMLElement>(null);
  const textAreaElement = useRef<HTMLTextAreaElement>(null);
  const textAreaMinHeight = useRef<number>(1000);

  const validate = useCallback(
    async (sql: string) => {
      const response = await validateSql(sql, formatMessage);

      if ('error' in response) {
        setValidationError(response.error);
        return;
      }

      setValidationError(undefined);
      return response.sql;
    },
    [setValidationError, formatMessage]
  );

  async function onCheckedChange(checked: boolean) {
    const newMode: Mode = checked ? 'editing' : 'viewing';
    setMode(newMode);

    if (newMode === 'editing') {
      // Set the min height of the textarea to the height to the SQL code element
      const currentCodeBlockHeight = codeElement.current?.clientHeight;
      if (typeof currentCodeBlockHeight === 'number') {
        textAreaMinHeight.current = currentCodeBlockHeight;
      }

      return;
    }

    if (sql) await validate(sql);
  }

  async function reformat() {
    if (!sql) return;
    const formattedSQL = await validate(sql);
    if (formattedSQL) setSql(formattedSQL);
  }

  // Validate SQL on mount
  const initialValidatenOccurredRef = useRef(false);
  useEffect(() => {
    if (!sql) return;
    if (initialValidatenOccurredRef.current) return;
    initialValidatenOccurredRef.current = true;
    validate(sql);
  }, [sql, validate]);

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <Callout>
          <Callout.Title>
            <FormattedMessage id="download.sql.note.title" defaultMessage="Note" />
          </Callout.Title>
          <Callout.Description>
            <p className="g-pb-2">
              <FormattedMessage
                id="download.sql.note.description"
                defaultMessage="The easiest way to download and explore data is via the occurrence search user interface. But for complex queries and aggregations, the SQL editor provides more freedom."
              />
            </p>
            <Button variant="outline" size="sm" asChild>
              <DynamicLink pageId="occurrenceSearch">
                <FormattedMessage
                  id="download.sql.note.goToOccurrenceSearch"
                  defaultMessage="Go to occurrence search"
                />
              </DynamicLink>
            </Button>
          </Callout.Description>
        </Callout>
        <Card>
          <EditorHeader
            mode={mode}
            hasError={validationError != null}
            onCheckedChange={onCheckedChange}
            reformat={reformat}
          />

          {mode === 'editing' && (
            <textarea
              ref={textAreaElement}
              autoFocus
              style={{ minHeight: textAreaMinHeight.current }}
              className="gbif-sqlInput g-w-full g-bg-white g-p-4"
              value={sql}
              onChange={(event) => setSql(event.currentTarget.value)}
            />
          )}
          {mode === 'viewing' && highlightedHtml && (
            <code
              ref={codeElement}
              className="gbif-sqlInput g-block g-bg-white g-p-4"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          )}

          {validationError && <EditorFooter validationError={validationError} />}
        </Card>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

type EditorHeaderProps = {
  mode: Mode;
  onCheckedChange(checked: boolean): void;
  reformat(): void;
  hasError: boolean;
};

function EditorHeader({ mode, onCheckedChange, reformat, hasError }: EditorHeaderProps) {
  return (
    <div className="g-flex g-items-center g-gap-2 g-border-b g-p-4 g-sticky g-top-0 g-bg-white g-flex-wrap">
      <div className="g-flex g-items-center g-gap-2 g-h-8 g-mr-auto">
        <Switch
          checked={mode === 'editing'}
          onCheckedChange={onCheckedChange}
          id="occurrence-download-sql-editing"
        />
        <Label htmlFor="occurrence-download-sql-editing">
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
            <DynamicLink to="https://techdocs.gbif.org/en/data-use/api-sql-downloads#sql">
              <FormattedMessage
                id="download.readTheDocumentation"
                defaultMessage="Read the documentation"
              />
            </DynamicLink>
          </Button>
          <Button size="sm" onClick={reformat} disabled={hasError}>
            <FormattedMessage id="download.download" />
          </Button>
        </div>
      )}
    </div>
  );
}

type EditorFooterProps = {
  validationError: SQLValidationError;
};

function EditorFooter({ validationError }: EditorFooterProps) {
  return (
    <div className="g-sticky g-bottom-0 g-bg-slate-50 g-border-t g-p-4">
      <div className="g-gap-2 g-space-x-2">
        <span className="g-text-nowrap g-bg-red-500 g-text-white g-text-xs g-font-semibold g-py-1 g-px-2 g-rounded-full">
          <FormattedMessage
            id={`download.sql.errors.${validationError.type}`}
            defaultMessage={validationError.type}
          />
        </span>
        <span className="g-text-red-500 ">{validationError.message}</span>
      </div>
    </div>
  );
}
