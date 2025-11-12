import { useCallback, useMemo } from 'react';
import { highlight } from 'sql-highlight';
import { useStringParam } from '@/hooks/useParam';
import { validateSql } from './validate';
import { useIntl } from 'react-intl';

export default function SqlEditor({ onContinue }: { onContinue: (sqlString?: string) => void }) {
  const [sql, setSql] = useStringParam({ key: 'sql', replace: true });
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
        title="SQL Editor"
        documentationUrl="https://techdocs.gbif.org/en/data-use/api-sql-downloads"
        PrettyDisplay={SqlVisual}
        text={sql ?? ''}
        setText={setSql}
        handleFormat={handleFormat}
        onContinue={onContinue}
        handleValidation={handleValidation}
      />
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
