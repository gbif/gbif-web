import PredicateEditor from '../../editor/predicateEditor';

export type Mode = 'editing' | 'viewing';

export function OccurrenceDownloadRequestCreate({
  onContinue,
  text,
}: {
  onContinue: (predicate: string) => void;
  text?: string | JSON;
}) {
  return (
    <>
      <PredicateEditor
        onContinue={onContinue}
        content={typeof text === 'string' ? text : JSON.stringify(text)}
      />
    </>
  );
}
