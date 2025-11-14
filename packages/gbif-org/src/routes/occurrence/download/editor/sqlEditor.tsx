import { useCallback, useMemo } from 'react';
import { highlight } from 'sql-highlight';
import { validateSql } from './validate';
import { FormattedMessage, useIntl } from 'react-intl';
import Editor from './editor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DynamicLink } from '@/reactRouterPlugins';
import { useTextAreaContent } from './predicateEditor';

export default function SqlEditor({ onContinue }: { onContinue: (sqlString?: string) => void }) {
  // const [sql, setSql] = useStringParam({ key: 'sql', replace: true });
  const [sql, setSql] = useTextAreaContent('sql');
  const { formatMessage } = useIntl();

  const handleFormat = useCallback(
    async (text: string) => {
      try {
        const { text: str, error } = await validateSql(text, formatMessage);
        if (error) {
          return text;
        }
        return str;
      } catch (error) {
        return text;
      }
    },
    [formatMessage]
  );

  const handleValidation = useCallback(
    (str: string) => validateSql(str, formatMessage),
    [formatMessage]
  );

  return (
    <div className="g-from-sky-50 g-via-blue-50 g-to-indigo-50 g-bg-gradient-to-br">
      <Editor
        title={<FormattedMessage id="download.sqlEditor" />}
        documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads" // deliberately hardcoded to prod as I assume there is no point in linking to a uat tech docs
        PrettyDisplay={SqlVisual}
        text={sql ?? ''}
        setText={setSql}
        handleFormat={handleFormat}
        onContinue={onContinue}
        handleValidation={handleValidation}
        placeholder={formatMessage({ id: 'download.sql.placeholder' })}
      />
      <Alert variant="info" className="g-mt-8 g-max-w-4xl g-mx-auto">
        <AlertTitle>
          <FormattedMessage id="download.sql.note.title" />
        </AlertTitle>
        <div className="prose">
          <AlertDescription>
            <FormattedMessage
              id="download.sql.note.description"
              values={{
                occurrence_search: (
                  <DynamicLink className="g-underline" pageId="occurrenceSearch">
                    <FormattedMessage id="download.sql.note.occurrence_search" />
                  </DynamicLink>
                ),
              }}
            />
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}

function SqlVisual({ content: sql }: { content: string; onError: (error: Error) => void }) {
  const highlightedHtml = useMemo(() => {
    if (!sql) return null;
    return highlight(sql, {
      html: true,
    });
  }, [sql]);

  return (
    <code className="gbif-sqlInput" dangerouslySetInnerHTML={{ __html: highlightedHtml ?? '' }} />
  );
}
