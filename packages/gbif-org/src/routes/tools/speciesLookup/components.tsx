import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { SuggestResult } from './types';

export function MatchTypeBadge({ matchType }: { matchType?: string }) {
  if (!matchType) return null;
  return (
    <span
      className={cn(
        'g-inline-block g-px-2 g-py-0.5 g-rounded g-text-xs g-font-bold g-uppercase g-tracking-wide g-whitespace-nowrap',
        {
          'g-bg-green-600 g-text-white': matchType === 'EXACT',
          'g-bg-amber-500 g-text-white': matchType === 'HIGHERRANK' || matchType === 'FUZZY',
          'g-bg-red-500 g-text-white': matchType === 'NONE',
          'g-bg-blue-500 g-text-white': matchType === 'EDITED',
        }
      )}
    >
      {matchType}
    </span>
  );
}

export function TaxonLink({ usageKey, name }: { usageKey?: number; name?: string }) {
  if (!name) return null;
  if (!usageKey) return <>{name}</>;
  return (
    <a href={`/species/${usageKey}`} className="g-text-primary-500 hover:g-underline">
      {name}
    </a>
  );
}

export function SuggestionRow({ item, onClick }: { item: SuggestResult; onClick: () => void }) {
  const ownRank = item.rank?.toLowerCase();
  const taxonomy = (
    [
      { key: 'kingdom', val: item.kingdom },
      { key: 'phylum', val: item.phylum },
      { key: 'class', val: item.class },
      { key: 'order', val: item.order },
      { key: 'family', val: item.family },
      { key: 'genus', val: item.genus },
      { key: 'species', val: item.species },
    ] as { key: string; val: string | undefined }[]
  )
    .filter(({ key, val }) => val && key !== ownRank)
    .map(({ val }) => val)
    .join(' › ');

  return (
    <button
      className="g-w-full g-text-left g-px-4 g-py-3 hover:g-bg-slate-50 g-border-b g-border-slate-100 g-block g-transition-colors"
      onClick={onClick}
    >
      <div className="g-font-medium g-text-sm">
        {item.scientificName}
        <span className="g-ml-2 g-text-xs g-text-gray-400 g-font-normal">
          {item.rank && (
            <FormattedMessage id={`enums.taxonRank.${item.rank}`} defaultMessage={item.rank} />
          )}
          {item.status && (
            <>
              {' ('}
              <FormattedMessage
                id={`enums.taxonomicStatus.${item.status}`}
                defaultMessage={item.status}
              />
              {')'}
            </>
          )}
        </span>
      </div>
      {taxonomy && <div className="g-text-xs g-text-gray-400 g-mt-0.5">{taxonomy}</div>}
    </button>
  );
}
