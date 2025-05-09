import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import animaliaIconUrl from './icons/animalia.svg';
import plantaeIconUrl from './icons/plantae.svg';
import fungiIconUrl from './icons/fungi.svg';
import archaeaIconUrl from './icons/archaea.svg';
import bacteriaIconUrl from './icons/bacteria.svg';
import chromistaIconUrl from './icons/chromista.svg';
import protozoaIconUrl from './icons/protozoa.svg';
import virusesIconUrl from './icons/viruses.svg';
import unknownIconUrl from './icons/unknown.svg';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  Predicate,
  OccurrencesPerKingdomQuery,
  OccurrencesPerKingdomQueryVariables,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { Skeleton } from '@/components/ui/skeleton';

export const kingdoms = [
  { id: 1, title: 'Animalia', icon: animaliaIconUrl },
  { id: 6, title: 'Plantae', icon: plantaeIconUrl },
  { id: 5, title: 'Fungi', icon: fungiIconUrl },
  { id: 2, title: 'Archaea', icon: archaeaIconUrl },
  { id: 3, title: 'Bacteria', icon: bacteriaIconUrl },
  { id: 4, title: 'Chromista', icon: chromistaIconUrl },
  { id: 7, title: 'Protozoa', icon: protozoaIconUrl },
  { id: 8, title: 'Viruses', icon: virusesIconUrl },
  { id: 0, title: 'incertae sedis', icon: unknownIconUrl },
];

type Props = {
  predicate: Predicate;
};

export function OccurrencesPerKingdom({ predicate }: Props) {
  const { data } = useQuery<OccurrencesPerKingdomQuery, OccurrencesPerKingdomQueryVariables>(
    QUERY,
    {
      variables: { predicate },
    }
  );

  const kingdomCountRecord = data?.occurrenceSearch?.facet?.kingdomKey?.reduce((acc, kingdom) => {
    if (!kingdom) return acc;
    acc[kingdom.key] = kingdom.count;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            // TODO: add i18n key
            id="metrics.occurrencesPerField"
            defaultMessage="Occurrences per kingdom"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="g-flex g-gap-8 g-justify-around g-flex-wrap">
        {kingdoms.map((kingdom) => {
          return (
            <div key={kingdom.id} className="g-flex g-flex-row g-items-center g-gap-2 g-min-w-44">
              <div className="g-size-16 g-p-0.5 g-bg-primary-500 g-rounded-full g-flex g-items-center g-justify-evenly">
                <img src={kingdom.icon} alt={kingdom.title} />
              </div>
              <div className="g-flex g-flex-col">
                <span className="g-text-sm">{kingdom.title}</span>
                <span className="g-text-sm g-font-bold">
                  {kingdomCountRecord == null ? (
                    <div className="g-flex g-flex-row g-h-5 g-w-26 g-items-center">
                      <Skeleton className="g-w-full g-h-4" />
                    </div>
                  ) : (
                    <FormattedNumber value={kingdomCountRecord[kingdom.id.toString()]} />
                  )}
                </span>
                <span className="g-text-xs">Occurrences</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

const QUERY = /* GraphQL */ `
  query OccurrencesPerKingdom($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      facet {
        kingdomKey {
          key
          count
        }
      }
    }
  }
`;
