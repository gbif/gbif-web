import SqlEditor from '../editor/sqlEditor';

export function OccurrenceDownloadSqlCreate({
  onContinue,
}: {
  onContinue: (predicate?: string) => void;
  text?: string | JSON;
}) {
  return <SqlEditor onContinue={onContinue} />;
}
