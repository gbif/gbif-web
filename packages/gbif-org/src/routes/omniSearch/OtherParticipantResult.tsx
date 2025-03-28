import { Count } from '@/components/count';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';

export function OtherParticipantResult({ participant }: { country: unknown }) {
  return (
    <Card className="g-mb-4">
      <article className="g-p-4 lg:g-p-8">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <h3 className="g-text-base g-font-semibold g-mb-2">
              <DynamicLink
                className="hover:g-text-primary-500"
                pageId="countryKey"
                variables={{ key: participant.countryCode }}
              >
                {participant.name}
              </DynamicLink>
            </h3>
            <div className="g-font-normal g-text-slate-700 g-text-sm">
              <div>Participation status {participant.participationStatus}</div>
              <div>Member since {participant.membershipStart}</div>
              <div>
                Publihsers{' '}
                <Count
                  v1Endpoint="/organization"
                  params={{ limit: 0, country: participant.countryCode }}
                />
              </div>
              <div>
                Published datasets{' '}
                <Count
                  v1Endpoint="/dataset/search"
                  params={{ limit: 0, publishingCountry: participant.countryCode }}
                />
              </div>
              <div>
                Species occurrences about{' '}
                <Count
                  v1Endpoint="/occurrence/search"
                  params={{ limit: 0, country: participant.countryCode }}
                />
              </div>
              <div>
                Published species occurrences{' '}
                <Count
                  v1Endpoint="/occurrence/search"
                  params={{ limit: 0, publishingCountry: participant.countryCode }}
                />
              </div>
            </div>
            <p className="g-font-normal g-text-slate-700 g-text-sm g-break-words">
              {participant.excerpt}
            </p>
          </div>
        </div>
      </article>
    </Card>
  );
}
