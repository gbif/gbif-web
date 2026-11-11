import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { MdLink } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import type { ReportFile } from '../../data/normalizeReport';

const UNKNOWN_PREFIX = 'http://unknown.org/';
const ARCHIVE_RECORD_ID = 'http://unknown.org/ARCHIVE_RECORD_ID';

export function TermFrequency({
  file,
  unknownTerms,
}: {
  file: ReportFile;
  unknownTerms: Set<string>;
}) {
  const { locale } = useI18n();
  const total = file.count ?? 0;

  return (
    <div className="g-overflow-x-auto">
      <table className="g-w-full g-text-sm">
        <thead>
          <tr className="g-text-slate-500 g-text-start">
            <th className="g-py-2 g-pe-4 g-text-start g-font-medium">
              <FormattedMessage
                id="tools.dataValidator.termsFrequency.term"
                defaultMessage="Term"
              />
            </th>
            <th className="g-py-2 g-pe-4 g-text-end g-font-medium">
              <FormattedMessage
                id="tools.dataValidator.termsFrequency.count"
                defaultMessage="Count"
              />
            </th>
            <th className="g-py-2 g-pe-4 g-text-start g-font-medium">
              <FormattedMessage
                id="tools.dataValidator.termsFrequency.percentage"
                defaultMessage="Percentage"
              />
            </th>
            {file.hasInterpretedCounts && (
              <th className="g-py-2 g-text-end g-font-medium">
                <FormattedMessage
                  id="tools.dataValidator.termsFrequency.interpreted"
                  defaultMessage="Interpreted"
                />
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {file.terms.map((term, index) => {
            const name = term.term ?? '';
            const isId = file.idTerm === name;
            const isUnknown =
              unknownTerms.has(name) ||
              (name.startsWith(UNKNOWN_PREFIX) && name !== ARCHIVE_RECORD_ID);
            const fraction =
              total > 0 && term.rawIndexed !== undefined ? term.rawIndexed / total : 0;
            return (
              <tr key={`${name}-${index}`} className="g-border-t g-border-slate-100">
                <td className="g-py-1.5 g-pe-4 g-break-all" dir="ltr">
                  <span
                    className={cn({
                      'g-text-red-700': isUnknown,
                      'g-font-semibold': isId,
                    })}
                  >
                    {isId && name === ARCHIVE_RECORD_ID ? 'recordID' : name}
                  </span>
                  {/^https?:\/\//.test(name) && !name.startsWith(UNKNOWN_PREFIX) && (
                    <a
                      href={name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="g-ms-1 g-inline-block g-align-middle g-text-slate-400 hover:g-text-primary-600"
                    >
                      <MdLink />
                      <span className="g-sr-only">{name}</span>
                    </a>
                  )}
                  {isId && (
                    <span className="g-ms-1 g-text-slate-500 g-font-normal">
                      (
                      <FormattedMessage
                        id="tools.dataValidator.uniqueIdentifier"
                        defaultMessage="Unique identifier"
                      />
                      )
                    </span>
                  )}
                </td>
                <td className="g-py-1.5 g-pe-4 g-text-end g-tabular-nums">
                  {term.rawIndexed !== undefined && <FormattedNumber value={term.rawIndexed} />}
                </td>
                <td className="g-py-1.5 g-pe-4">
                  <div className="g-flex g-items-center g-gap-2">
                    <Progress
                      value={Math.min(100, fraction * 100)}
                      dir={locale.textDirection}
                      className="g-w-20 g-flex-none"
                    />
                    <span className="g-tabular-nums">
                      <FormattedNumber value={fraction} style="percent" maximumFractionDigits={0} />
                    </span>
                  </div>
                </td>
                {file.hasInterpretedCounts && (
                  <td className="g-py-1.5 g-text-end g-tabular-nums">
                    {typeof term.interpretedIndexed === 'number' && (
                      <FormattedNumber value={term.interpretedIndexed} />
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
