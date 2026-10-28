import { useOccurrenceCount } from '@/components/count';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DynamicLink } from '@/reactRouterPlugins';
import { notNull } from '@/utils/notNull';
import { Base64 } from 'js-base64';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import animaliaIconUrl from './icons/animalia.svg';
import archaeaIconUrl from './icons/archaea.svg';
import bacteriaIconUrl from './icons/bacteria.svg';
import chromistaIconUrl from './icons/chromista.svg';
import fungiIconUrl from './icons/fungi.svg';
import plantaeIconUrl from './icons/plantae.svg';
import protozoaIconUrl from './icons/protozoa.svg';
import unknownIconUrl from './icons/unknown.svg';
import virusesIconUrl from './icons/viruses.svg';

const COL_CHECKLIST_KEY = '7ddf754f-d193-4cc9-b351-99906754a03b';

// colTaxonKey is the Catalogue of Life taxon key. Each tile links to and counts that taxon.
export const kingdoms = [
  { id: 1, colTaxonKey: 'N', title: 'Animalia', icon: animaliaIconUrl },
  { id: 6, colTaxonKey: 'P', title: 'Plantae', icon: plantaeIconUrl },
  { id: 5, colTaxonKey: 'F', title: 'Fungi', icon: fungiIconUrl },
  { id: 2, colTaxonKey: 'CRLT8', title: 'Archaea', icon: archaeaIconUrl },
  { id: 3, colTaxonKey: 'CRRY6', title: 'Bacteria', icon: bacteriaIconUrl },
  { id: 4, colTaxonKey: 'C', title: 'Chromista', icon: chromistaIconUrl },
  { id: 7, colTaxonKey: 'Z', title: 'Protozoa', icon: protozoaIconUrl },
  { id: 8, colTaxonKey: 'L2TCC', title: 'Viruses', icon: virusesIconUrl },
  { id: 0, colTaxonKey: undefined, title: 'incertae sedis', icon: unknownIconUrl },
];

type Props = {
  type: 'publishedBy' | 'about';
  countryCode: string;
};

export function OccurrencesPerKingdom({ countryCode, type }: Props) {
  const { formatMessage } = useIntl();
  const countryFilterKey = type === 'publishedBy' ? 'publishingCountry' : 'country';

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="dashboard.occurrencesPerField"
            values={{
              FIELD: <FormattedMessage id="dashboard.kingdom" />,
            }}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="g-flex g-gap-8 g-justify-around g-flex-wrap">
        {kingdoms.filter(notNull).map((kingdom) => {
          // Kingdoms with a COL taxon key link to that taxon. Incertae sedis has no taxon, so it links to a filter on null taxon keys
          const searchParams: Record<string, string> = kingdom.colTaxonKey
            ? { taxonKey: kingdom.colTaxonKey, [countryFilterKey]: countryCode }
            : {
                filter: Base64.encode(
                  JSON.stringify({
                    must: {
                      taxonKey: [{ type: 'isNull' }],
                      [countryFilterKey]: [countryCode],
                    },
                    checklistKey: COL_CHECKLIST_KEY,
                  })
                ),
              };

          // The count uses the same taxon and country as the link
          const predicate = kingdom.colTaxonKey
            ? {
                type: 'and',
                predicates: [
                  {
                    type: 'equals',
                    key: 'taxonKey',
                    value: kingdom.colTaxonKey,
                    checklistKey: COL_CHECKLIST_KEY,
                  },
                  { type: 'equals', key: countryFilterKey, value: countryCode },
                ],
              }
            : {
                type: 'and',
                predicates: [
                  { type: 'isNull', key: 'taxonKey', checklistKey: COL_CHECKLIST_KEY },
                  { type: 'equals', key: countryFilterKey, value: countryCode },
                ],
              };

          const translatedKingdom = formatMessage({
            id: `enums.kingdomKey.${kingdom.id}`,
          });

          return (
            <DynamicLink
              key={kingdom.id}
              pageId="occurrenceSearch"
              searchParams={searchParams}
              className="g-group"
            >
              <div key={kingdom.id} className="g-flex g-flex-row g-items-center g-gap-2 g-min-w-44">
                <div className="g-size-16 g-p-0.5 g-bg-primary-500 group-hover:g-bg-primary-700 g-rounded-full g-flex g-items-center g-justify-evenly">
                  <img src={kingdom.icon} alt={translatedKingdom} />
                </div>
                <div className="g-flex g-flex-col">
                  <span className="g-text-sm">{translatedKingdom}</span>
                  <span className="g-text-sm g-font-bold">
                    <KingdomCount predicate={predicate} />
                  </span>
                  <span className="g-text-xs">
                    <FormattedMessage id="dashboard.occurrences" />
                  </span>
                </div>
              </div>
            </DynamicLink>
          );
        })}
      </CardContent>
    </Card>
  );
}

function KingdomCount({ predicate }: { predicate: unknown }) {
  const { count, loading, error } = useOccurrenceCount({ predicate });

  if (loading || typeof count === 'undefined') {
    return (
      <div className="g-flex g-flex-row g-h-5 g-w-26 g-items-center">
        <Skeleton className="g-w-full g-h-4" />
      </div>
    );
  }
  if (error) return null;
  return <FormattedNumber value={count} />;
}
