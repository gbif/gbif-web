import { Count } from '@/components/count';
import { Tag } from '@/components/resultCards';
import { ResultCardHeaderBasic } from '@/components/resultCards/resultCardHeader';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { CrossSearchParticipant } from './OtherParticipantResult';

export function CountryResult({
  country,
}: {
  country: { countryCode: string; participant: CrossSearchParticipant };
}) {
  const messageId = country?.participant?.participationStatus
    ? `participant.participationStatus.longForm.${country.participant.participationStatus}`
    : undefined;

  return (
    <Card className="g-mb-4">
      <article className="g-p-4 lg:g-p-8">
        <ResultCardHeaderBasic>
          <DynamicLink
            className="hover:g-text-primary-500 g-flex g-items-center g-gap-2"
            pageId="countryKey"
            variables={{ key: country.countryCode }}
          >
            <div className="g-flex-1">
              <FormattedMessage id={`enums.countryCode.${country.countryCode}`} />
            </div>
            <img
              src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
              alt="Country Flag"
              style={{ width: '48px', height: 'auto' }}
              className="g-border g-border-slate-200 g-inline-block"
            />
          </DynamicLink>
        </ResultCardHeaderBasic>
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <>
              <div className="g-font-normal g-text-slate-800 g-text-sm">
                {country.participant && (
                  <>
                    <div>
                      <span className="g-font-semibold">Member since</span>{' '}
                      {country.participant.membershipStart}
                    </div>
                  </>
                )}
                <div>
                  <span className="g-font-semibold">Publishers</span>{' '}
                  <Count
                    v1Endpoint="/organization"
                    params={{ limit: 0, country: country.countryCode }}
                  />
                </div>
                <div>
                  <span className="g-font-semibold">Published datasets</span>{' '}
                  <Count
                    v1Endpoint="/dataset/search"
                    params={{ limit: 0, publishingCountry: country.countryCode }}
                  />
                </div>
                <div>
                  <span className="g-font-semibold">Published occurrence records</span>{' '}
                  <Count
                    v1Endpoint="/occurrence/search"
                    params={{ limit: 0, publishingCountry: country.countryCode }}
                  />
                </div>
              </div>
            </>
          </div>
          {/* <div className="g-max-w-24 md:g-max-w-32 g-flex-none">
            <img
              src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
              alt="Country Flag"
              style={{ width: '100%', height: 'auto' }}
              className="g-border g-border-slate-200"
            />
          </div> */}
        </div>
        {messageId && (
          <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
            <Tag>
              <FormattedMessage id={messageId} />
            </Tag>
          </div>
        )}
      </article>
    </Card>
  );
}
