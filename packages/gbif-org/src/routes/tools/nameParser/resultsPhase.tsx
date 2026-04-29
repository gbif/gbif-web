import { PaginationFooter } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Switch } from '@/components/ui/switch';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { PAGE_SIZE, ParsedName, RESULT_COLUMNS, SortDirection } from './types';
import { sortNames } from './utils';

type ResultsPhaseProps = {
  names: ParsedName[];
  excludeUnparsed: boolean;
  offset: number;
  sortColumn?: string;
  sortDirection: SortDirection;
  onBack: () => void;
  onSetOffset: (offset: number) => void;
  onSetExcludeUnparsed: (value: boolean) => void;
  onSort: (column: string) => void;
  onGenerateCsv: () => void;
};

export function ResultsPhase({
  names,
  excludeUnparsed,
  offset,
  sortColumn,
  sortDirection,
  onBack,
  onSetOffset,
  onSetExcludeUnparsed,
  onSort,
  onGenerateCsv,
}: ResultsPhaseProps) {
  const filtered = useMemo(
    () => (excludeUnparsed ? names.filter((n) => n.parsed) : names),
    [names, excludeUnparsed]
  );
  const sorted = useMemo(
    () => sortNames(filtered, sortColumn, sortDirection),
    [filtered, sortColumn, sortDirection]
  );
  const visible = sorted.slice(offset, offset + PAGE_SIZE);

  return (
    <PageContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl g-pt-6 g-pb-8">
        <Button variant="ghost" size="sm" className="g-mb-4 g-text-slate-500" onClick={onBack}>
          ↺ <FormattedMessage id="tools.nameParser.startOver" defaultMessage="Start over" />
        </Button>

        <Card className="g-bg-white">
          <div className="g-overflow-x-auto">
            <table className="g-w-full g-text-sm">
              <thead className="g-sticky g-top-0 g-bg-white g-shadow-sm g-z-10">
                <tr>
                  {RESULT_COLUMNS.map((col) => {
                    const isActive = sortColumn === col.key;
                    return (
                      <th
                        key={col.key}
                        className="g-px-4 g-py-3 g-text-left g-font-medium g-text-slate-500 g-whitespace-nowrap"
                      >
                        <button
                          className="g-flex g-items-center g-gap-1 hover:g-text-slate-700 g-transition-colors"
                          onClick={() => onSort(col.key)}
                        >
                          <FormattedMessage id={col.id} defaultMessage={col.defaultMessage} />
                          {isActive && (
                            <span className="g-text-slate-400">
                              {sortDirection === 'asc' ? '▲' : '▼'}
                            </span>
                          )}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visible.map((row, idx) => (
                  <ResultRow key={offset + idx} row={row} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="g-flex g-items-center g-justify-end g-flex-wrap g-gap-4 g-p-4 g-border-t g-border-gray-100">
            {sorted.length > PAGE_SIZE && (
              <div className="g-flex-1 g-min-w-0">
                <PaginationFooter
                  offset={offset}
                  limit={PAGE_SIZE}
                  count={sorted.length}
                  onChange={(newOffset) => {
                    onSetOffset(newOffset);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
            <div className="g-flex g-items-center g-gap-6">
              <label className="g-flex g-items-center g-gap-2 g-cursor-pointer g-text-sm g-text-gray-600">
                <FormattedMessage
                  id="tools.nameParser.excludeUnparsed"
                  defaultMessage="Exclude unparsed"
                />
                <Switch
                  checked={excludeUnparsed}
                  onCheckedChange={(v) => {
                    onSetExcludeUnparsed(v);
                    onSetOffset(0);
                  }}
                />
              </label>
              <Button onClick={onGenerateCsv}>
                <FormattedMessage
                  id="tools.nameParser.generateCsv"
                  defaultMessage="Generate CSV"
                />
              </Button>
            </div>
          </div>
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}

function ResultRow({ row }: { row: ParsedName }) {
  const authorshipMissing = !row.authorship && !row.bracketAuthorship;

  return (
    <tr className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900 g-align-top">
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <span>{row.scientificName}</span>
      </td>
      <td className="g-px-4 g-py-2">
        <ParsedBadge parsed={row.parsed} />
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">{row.type}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{row.genusOrAbove}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{row.specificEpithet}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{row.infraSpecificEpithet}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        {row.authorship ? (
          <span>{row.authorship}</span>
        ) : authorshipMissing && row.parsed ? (
          <span className="g-inline-block g-px-2 g-py-0.5 g-rounded g-text-xs g-font-medium g-bg-amber-100 g-text-amber-700">
            <FormattedMessage
              id="tools.nameParser.authorshipMissing"
              defaultMessage="Authorship missing"
            />
          </span>
        ) : null}
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">
        {row.bracketAuthorship}
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">{row.sensu}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{row.canonicalName}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{row.canonicalNameWithMarker}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{row.canonicalNameComplete}</td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">{row.rankMarker}</td>
    </tr>
  );
}

function ParsedBadge({ parsed }: { parsed?: boolean }) {
  return (
    <span
      className={cn(
        'g-inline-block g-px-2 g-py-0.5 g-rounded g-text-xs g-font-bold g-uppercase g-tracking-wide g-whitespace-nowrap',
        parsed ? 'g-bg-green-600 g-text-white' : 'g-bg-red-500 g-text-white'
      )}
    >
      {parsed ? 'true' : 'false'}
    </span>
  );
}
