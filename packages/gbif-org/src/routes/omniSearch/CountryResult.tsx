import { Count } from '@/components/count';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';

export function CountryResult({ country }: { country: unknown }) {
  return (
    <Card className="g-mb-4">
      <article className="g-p-4 lg:g-p-8">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <h3 className="g-text-base g-font-semibold g-mb-2">
              <DynamicLink
                className="hover:g-text-primary-500"
                pageId="countryKey"
                variables={{ key: country.countryCode }}
              >
                <FormattedMessage id={`enums.countryCode.${country.countryCode}`} />
              </DynamicLink>
            </h3>

            <>
              <div className="g-font-normal g-text-slate-700 g-text-sm">
                {country.participant && (
                  <>
                    <div>Participation status {country.participant.participationStatus}</div>
                    <div>Member since {country.participant.membershipStart}</div>
                  </>
                )}
                <div>
                  Publihsers{' '}
                  <Count
                    v1Endpoint="/organization"
                    params={{ limit: 0, country: country.countryCode }}
                  />
                </div>
                <div>
                  Published datasets{' '}
                  <Count
                    v1Endpoint="/dataset/search"
                    params={{ limit: 0, publishingCountry: country.countryCode }}
                  />
                </div>
                <div>
                  Species occurrences about{' '}
                  <Count
                    v1Endpoint="/occurrence/search"
                    params={{ limit: 0, country: country.countryCode }}
                  />
                </div>
                <div>
                  Published species occurrences{' '}
                  <Count
                    v1Endpoint="/occurrence/search"
                    params={{ limit: 0, publishingCountry: country.countryCode }}
                  />
                </div>
              </div>
              <p className="g-font-normal g-text-slate-700 g-text-sm g-break-words">
                {country.excerpt}
              </p>
            </>

            {!country.participant && (
              <p className="g-font-normal g-text-slate-400 g-text-sm">
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}
          </div>
          <div className="g-max-w-32 md:g-max-w-48 g-flex-none">
            <img
              src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
              alt="Country Flag"
              style={{ width: '100%', height: 'auto' }}
              className="g-border g-border-slate-200"
            />
          </div>
        </div>
      </article>
    </Card>
  );
}
