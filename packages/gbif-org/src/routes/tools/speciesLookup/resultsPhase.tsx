import { PaginationFooter } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/largeCard';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { MatchTypeBadge, TaxonLink } from './components';
import { PAGE_SIZE, SpeciesRow } from './types';

const RESULT_COLUMNS: { id: string; defaultMessage: string }[] = [
  { id: 'tools.speciesLookup.colId', defaultMessage: 'id' },
  { id: 'tools.speciesLookup.colVerbatimScientificName', defaultMessage: 'verbatimScientificName' },
  { id: 'tools.speciesLookup.colPreferedKingdom', defaultMessage: 'preferedKingdom' },
  { id: 'tools.speciesLookup.colMatchType', defaultMessage: 'matchType' },
  { id: 'tools.speciesLookup.colConfidence', defaultMessage: 'confidence' },
  {
    id: 'tools.speciesLookup.colScientificNameEditable',
    defaultMessage: 'scientificName (editable)',
  },
  { id: 'tools.speciesLookup.colStatus', defaultMessage: 'status' },
  { id: 'tools.speciesLookup.colRank', defaultMessage: 'rank' },
  { id: 'tools.speciesLookup.colKingdom', defaultMessage: 'kingdom' },
  { id: 'tools.speciesLookup.colPhylum', defaultMessage: 'phylum' },
  { id: 'tools.speciesLookup.colClass', defaultMessage: 'class' },
  { id: 'tools.speciesLookup.colOrder', defaultMessage: 'order' },
  { id: 'tools.speciesLookup.colFamily', defaultMessage: 'family' },
  { id: 'tools.speciesLookup.colGenus', defaultMessage: 'genus' },
  { id: 'tools.speciesLookup.colSpecies', defaultMessage: 'species' },
];

type ResultsPhaseProps = {
  species: SpeciesRow[];
  excludeUnmatched: boolean;
  offset: number;
  onBack: () => void;
  onOpenEdit: (row: SpeciesRow) => void;
  onSetOffset: (offset: number) => void;
  onSetExcludeUnmatched: (value: boolean) => void;
  onGenerateCsv: () => void;
};

export function ResultsPhase({
  species,
  excludeUnmatched,
  offset,
  onBack,
  onOpenEdit,
  onSetOffset,
  onSetExcludeUnmatched,
  onGenerateCsv,
}: ResultsPhaseProps) {
  const displayedSpecies = excludeUnmatched ? species.filter((s) => s.key) : species;
  const visibleResults = displayedSpecies.slice(offset, offset + PAGE_SIZE);

  return (
    <PageContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-full g-pt-6 g-pb-8">
        <Button variant="ghost" size="sm" className="g-mb-4 g-text-slate-500" onClick={onBack}>
          ↺ <FormattedMessage id="tools.speciesLookup.startOver" defaultMessage="Start over" />
        </Button>

        <Card className="g-bg-white">
          <div className="g-overflow-x-auto">
            <table className="g-w-full g-text-sm">
              <thead className="g-sticky g-top-0 g-bg-white g-shadow-sm g-z-10">
                <tr>
                  {RESULT_COLUMNS.map((col) => (
                    <th
                      key={col.id}
                      className="g-px-4 g-py-3 g-text-left g-font-medium g-text-slate-500 g-whitespace-nowrap"
                    >
                      <FormattedMessage id={col.id} defaultMessage={col.defaultMessage} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleResults.map((row, idx) => (
                  <ResultRow key={idx} row={row} onEdit={onOpenEdit} />
                ))}
              </tbody>
            </table>
          </div>

          <div className="g-flex g-items-center g-justify-end g-flex-wrap g-gap-4 g-p-4 g-border-t g-border-gray-100">
            {displayedSpecies.length > PAGE_SIZE && (
              <div className="g-flex-1 g-min-w-0">
                <PaginationFooter
                  offset={offset}
                  limit={PAGE_SIZE}
                  count={displayedSpecies.length}
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
                  id="tools.speciesLookup.excludeUnmatched"
                  defaultMessage="Exclude unmatched"
                />
                <Switch
                  checked={excludeUnmatched}
                  onCheckedChange={(v) => {
                    onSetExcludeUnmatched(v);
                    onSetOffset(0);
                  }}
                />
              </label>
              <Button onClick={onGenerateCsv}>
                <FormattedMessage
                  id="tools.speciesLookup.generateCsv"
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

function ResultRow({ row, onEdit }: { row: SpeciesRow; onEdit: (row: SpeciesRow) => void }) {
  return (
    <tr className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900">
      <td className="g-px-4 g-py-2 g-max-w-[6rem]">
        <div className="g-truncate g-text-slate-400">{row.occurrenceId}</div>
      </td>
      <td className="g-px-4 g-py-2 g-max-w-[12rem]">
        <div className="g-truncate">{row.verbatimScientificName}</div>
      </td>
      <td className="g-px-4 g-py-2 g-max-w-[7rem]">
        <div className="g-truncate g-text-slate-400">
          {row.preferedKingdom ?? (
            <FormattedMessage id="tools.speciesLookup.any" defaultMessage="any" />
          )}
        </div>
      </td>
      <td className="g-px-4 g-py-2">
        <MatchTypeBadge matchType={row.matchType} />
      </td>
      <td className="g-px-4 g-py-2 g-text-right g-text-slate-500">{row.confidence}</td>
      <td className="g-px-4 g-py-2 g-max-w-[14rem]">
        <button
          className="g-flex g-items-start g-gap-1.5 g-text-left hover:g-text-primary-600 g-transition-colors g-group g-w-full"
          onClick={() => onEdit(row)}
        >
          <span className="g-text-slate-300 group-hover:g-text-primary-400 g-mt-0.5 g-flex-shrink-0">
            ✏
          </span>
          <span className={cn('g-truncate', { 'g-text-slate-400 g-italic': !row.scientificName })}>
            {row.scientificName ??
              (row.discarded ? (
                <FormattedMessage id="tools.speciesLookup.discarded" defaultMessage="Discarded" />
              ) : (
                <FormattedMessage id="tools.speciesLookup.options" defaultMessage="Options" />
              ))}
          </span>
        </button>
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">
        {row.status && (
          <FormattedMessage
            id={`enums.taxonomicStatus.${row.status}`}
            defaultMessage={row.status}
          />
        )}
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap g-text-slate-600">
        {row.rank && (
          <FormattedMessage id={`enums.taxonRank.${row.rank}`} defaultMessage={row.rank} />
        )}
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <TaxonLink usageKey={row.kingdomKey} name={row.kingdom} />
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <TaxonLink usageKey={row.phylumKey} name={row.phylum} />
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <TaxonLink usageKey={row.classKey} name={row.class} />
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <TaxonLink usageKey={row.orderKey} name={row.order} />
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <TaxonLink usageKey={row.familyKey} name={row.family} />
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <TaxonLink usageKey={row.genusKey} name={row.genus} />
      </td>
      <td className="g-px-4 g-py-2 g-whitespace-nowrap">
        <TaxonLink usageKey={row.speciesKey} name={row.species} />
      </td>
    </tr>
  );
}
