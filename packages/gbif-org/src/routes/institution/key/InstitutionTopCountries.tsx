import { Card, CardContent, CardTitle } from '@/components/ui/smallCard';
import { Skeleton } from '@/components/ui/skeleton';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useEffect } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  InstitutionTopCountriesQuery,
  InstitutionTopCountriesQueryVariables,
  Predicate,
} from '@/gql/graphql';

interface InstitutionTopCountriesProps {
  predicate: Predicate;
  className?: string;
}

export function InstitutionTopCountries({ predicate, className }: InstitutionTopCountriesProps) {
  const { data, error, loading, load } = useQuery<
    InstitutionTopCountriesQuery,
    InstitutionTopCountriesQueryVariables
  >(TOP_COUNTRIES_QUERY, {
    lazyLoad: true,
  });

  useEffect(() => {
    if (!predicate?.value) return;

    load({
      variables: {
        predicate,
      },
      queue: { name: 'dashboard' },
    });
  }, [predicate, load]);

  const total = data?.occurrenceSearch?.documents?.total ?? 0;
  const countries = data?.occurrenceSearch?.facet?.countryCode ?? [];

  const isLoading = loading || !data;

  if (error) {
    return (
      <Card className={cn('g-p-4', className)}>
        <CardContent>
          <div className="g-text-red-500">
            <FormattedMessage id="phrases.failedToLoadData" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoading && countries.length === 0) {
    return null;
  }

  return (
    <Card className={cn(className)}>
      <CardContent topPadding>
        {isLoading ? (
          <div>
            <Skeleton className="g-h-6 g-w-48 g-mb-4" />
            <Skeleton className="g-h-4 g-w-full g-mb-3" />
            <Skeleton className="g-h-4 g-w-full g-mb-3" />
            <Skeleton className="g-h-4 g-w-full" />
          </div>
        ) : (
          <>
            <CardTitle className="g-mb-4">
              <FormattedMessage
                id="grscicoll.topCountries"
                defaultMessage="Top 10 countries"
              />
            </CardTitle>
            <div>
              <ul className="g-p-0 g-m-0 g-list-none">
                {countries.map((country, i) => (
                  <li key={i} className="g-mb-3">
                    <ProgressItem
                      value={country?.count ?? 0}
                      max={total}
                      title={
                        <FormattedMessage
                          id={`enums.countryCode.${country?.key}`}
                          defaultMessage={country?.key ?? ''}
                        />
                      }
                    />
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressItem({
  value,
  max,
  title,
  color = 'g-bg-primary',
}: {
  value: number;
  max: number;
  title: React.ReactNode;
  color?: string;
}) {
  let percent = Math.round((value / max) * 1000) / 10;
  if (percent === 0 && value !== 0) percent = 0.1;
  if (percent === 100 && value !== max) percent = 99.9;

  return (
    <div>
      <div className="g-flex g-justify-between g-items-center g-mb-1 g-text-sm">
        <div>{title}</div>
        <span className="g-text-slate-600">
          {isNaN(percent) ? '—' : <FormattedNumber value={percent} maximumFractionDigits={1} />}
          {!isNaN(percent) && '%'}
        </span>
      </div>
      <div className="g-h-2 g-bg-slate-200 g-rounded g-overflow-hidden">
        <div
          className={cn('g-h-full g-rounded g-opacity-60', color)}
          style={{ width: `${isNaN(percent) ? 0 : percent}%` }}
        />
      </div>
    </div>
  );
}

const TOP_COUNTRIES_QUERY = /* GraphQL */ `
  query InstitutionTopCountries($predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      documents(size: 0) {
        total
      }
      facet {
        countryCode(size: 10) {
          count
          key
        }
      }
    }
  }
`;
