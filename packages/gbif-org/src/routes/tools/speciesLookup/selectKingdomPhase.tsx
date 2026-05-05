import { PaginationFooter } from '@/components/pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { KINGDOMS, PAGE_SIZE, SpeciesRow } from './types';

type SelectKingdomPhaseProps = {
  species: SpeciesRow[];
  defaultKingdom?: string;
  isMatching: boolean;
  matchedCount: number;
  offset: number;
  onBack: () => void;
  onSetDefaultKingdom: (kingdom: string | undefined) => void;
  onMatchNames: () => void;
  onSetOffset: (offset: number) => void;
};

export function SelectKingdomPhase({
  species,
  defaultKingdom,
  isMatching,
  matchedCount,
  offset,
  onBack,
  onSetDefaultKingdom,
  onMatchNames,
  onSetOffset,
}: SelectKingdomPhaseProps) {
  const visibleSpecies = species.slice(offset, offset + PAGE_SIZE);

  return (
    <PageContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-full g-pt-6 g-pb-8">
        <Button variant="ghost" size="sm" className="g-mb-4 g-text-slate-500" onClick={onBack}>
          ↺ <FormattedMessage id="tools.speciesLookup.startOver" defaultMessage="Start over" />
        </Button>

        <Card className="g-bg-white">
          {isMatching ? (
            <div className="g-py-12 g-px-8">
              <p className="g-text-base g-text-gray-700 g-mb-4">
                <FormattedMessage
                  id="tools.speciesLookup.matchingProgress"
                  defaultMessage="Matching {done} of {total}…"
                  values={{ done: matchedCount, total: species.length }}
                />
              </p>
              <div className="g-h-2 g-bg-slate-200 g-rounded-full g-overflow-hidden g-w-full">
                <div
                  className="g-h-full g-bg-primary-500 g-transition-all g-duration-200"
                  style={{ width: `${(matchedCount / species.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="g-p-6 g-border-b g-border-slate-100">
                <p className="g-text-sm g-text-gray-600 g-mb-5">
                  <FormattedMessage
                    id="tools.speciesLookup.ifNoKingdom"
                    defaultMessage="If no kingdom specified then prefer"
                  />
                </p>
                <div className="g-flex g-gap-4 g-flex-wrap g-mb-6">
                  {KINGDOMS.map((k) => (
                    <button
                      key={k.value}
                      className={cn(
                        'g-flex g-flex-col g-items-center g-gap-1.5 g-px-3 g-py-2 g-rounded g-transition-colors',
                        defaultKingdom === k.value
                          ? 'g-bg-primary-50 g-ring-2 g-ring-primary-500'
                          : 'hover:g-bg-slate-50'
                      )}
                      onClick={() =>
                        onSetDefaultKingdom(defaultKingdom === k.value ? undefined : k.value)
                      }
                    >
                      <k.icon className="g-w-9 g-h-9" />
                      <span className="g-text-xs g-text-gray-500">{k.label.toLowerCase()}</span>
                    </button>
                  ))}
                </div>
                <Button onClick={onMatchNames}>
                  <FormattedMessage
                    id="tools.speciesLookup.matchToBackbone"
                    defaultMessage="Match to GBIF backbone"
                  />
                </Button>
              </div>

              <div className="g-overflow-x-auto">
                <table className="g-w-full g-text-sm">
                  <thead className="g-sticky g-top-0 g-bg-white g-shadow-sm g-z-10">
                    <tr>
                      <th className="g-px-4 g-py-3 g-text-left g-font-medium g-text-slate-500 g-whitespace-nowrap">
                        <FormattedMessage
                          id="tools.speciesLookup.scientificName"
                          defaultMessage="scientificName"
                        />
                      </th>
                      <th className="g-px-4 g-py-3 g-text-left g-font-medium g-text-slate-500 g-whitespace-nowrap">
                        <FormattedMessage
                          id="tools.speciesLookup.preferedKingdom"
                          defaultMessage="preferred kingdom"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleSpecies.map((row, idx) => (
                      <tr key={idx} className="g-border-t g-border-gray-100 hover:g-bg-gray-50">
                        <td className="g-px-4 g-py-2">{row.verbatimScientificName}</td>
                        <td className="g-px-4 g-py-2 g-text-slate-400">{row.preferedKingdom}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {species.length > PAGE_SIZE && (
                <div className="g-p-4">
                  <PaginationFooter
                    offset={offset}
                    limit={PAGE_SIZE}
                    count={species.length}
                    onChange={onSetOffset}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </ArticleTextContainer>
    </PageContainer>
  );
}
