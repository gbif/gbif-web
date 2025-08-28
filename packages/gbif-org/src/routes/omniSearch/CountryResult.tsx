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
      <DynamicLink
        className=""
        pageId="countryKey"
        variables={{ countryCode: country.countryCode }}
      >
        <article className="g-p-4">
          <div className="g-flex g-flex-row g-gap-4">
            <img
              src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
              alt="Country Flag"
              style={{ width: '92px', height: 'auto' }}
              className="g-border g-border-solid g-border-slate-200 g-inline-block"
            />
            <div className="g-flex-1">
              <ResultCardHeaderBasic messageId={messageId}>
                <FormattedMessage id={`enums.countryCode.${country.countryCode}`} />
              </ResultCardHeaderBasic>
              <div className="g-font-normal g-text-slate-800 g-text-sm">
                {country.participant && (
                  <>
                    <div>
                      <span className="g-font-semibold">Member since</span>{' '}
                      {country.participant.membershipStart}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* <ResultCardHeaderBasic>
          <DynamicLink
            className="hover:g-text-primary-500 g-flex g-items-center g-gap-2 g-flex-row-reverse"
            pageId="countryKey"
            variables={{ countryCode: country.countryCode }}
          >
            <div className="g-flex-1">
              <FormattedMessage id={`enums.countryCode.${country.countryCode}`} />
            </div>
            <img
              src={`https://flagcdn.com/${country.countryCode.toLowerCase()}.svg`}
              alt="Country Flag"
              style={{ width: '48px', height: 'auto' }}
              className="g-border g-border-solid g-border-slate-200 g-inline-block"
            />
          </DynamicLink>
        </ResultCardHeaderBasic> */}
        </article>
      </DynamicLink>
    </Card>
  );
}
