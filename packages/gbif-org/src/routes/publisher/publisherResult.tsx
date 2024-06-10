import { DynamicLink } from '@/components/dynamicLink';
import { PublisherResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { CountTag, Tag } from '@/components/resultCards';
import { Card } from '@/components/ui/largeCard';
import { defaultDateFormatProps } from '@/components/headerComponents';

fragmentManager.register(/* GraphQL */ `
  fragment PublisherResult on Organization {
    key
    title
    created
    country
    logoUrl
    excerpt
  }
`);

export function PublisherResult({ publisher }: { publisher: PublisherResultFragment }) {
  // if the publishers creation date is less than 90 days ago from today, it is considered new and the flag will be used for styling
  const days = 90;
  const isNew =
    publisher.created &&
    new Date(publisher.created) > new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return (
    <Card className='g-mb-4'>
      <article className='g-p-8'>
        <div className='g-flex g-flex-col md:g-flex-row g-gap-4'>
          <div className='g-flex-grow'>
            <h3 className='g-text-base g-font-semibold g-mb-1'>
              <DynamicLink to={`/publisher/${publisher.key}`}>{publisher.title}</DynamicLink>
            </h3>
            {publisher.created && (
              <p className='g-mb-4 g-text-sm g-text-slate-500'>
                <FormattedMessage
                  id="publisher.joinedDate"
                  values={{
                    date: <FormattedDate {...defaultDateFormatProps} value={publisher.created} />,
                  }}
                />
                {isNew && (
                  <span className='g-text-xs g-bg-primary-500 g-px-2 g-py-1 g-text-white g-ml-2 g-rounded'>
                    <FormattedMessage id="publisher.newPublisher" />
                  </span>
                )}
              </p>
            )}
            {publisher.excerpt && (
              <p className='g-font-normal g-text-slate-700 g-text-sm'>{publisher.excerpt}</p>
            )}
            {!publisher.excerpt && (
              <p className='g-font-normal g-text-slate-400 g-text-sm'>
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}
          </div>
          {publisher.logoUrl && (
            <div className='g-max-w-32 md:g-max-w-48 g-max-h-32 md:g-max-h-48 '>
              <img
                onError={(e) => {
                  // hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
                src={publisher.logoUrl}
                alt={'Publisher logo'}
                className='g-rounded g-border g-border-slate-100 g-p-1 g-w-full'
              />
            </div>
          )}
        </div>
        <div className='-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap'>
          <Tag>
            <FormattedMessage id={`enums.countryCode.${publisher.country}`} />
          </Tag>
          <div className='g-flex-grow'></div>
          <CountTag
            v1Endpoint="/dataset/search"
            params={{ publishingOrg: publisher.key }}
            message="counts.nDatasets"
          />
          <CountTag
            v1Endpoint="/literature/search"
            params={{ publishingOrganizationKey: publisher.key }}
            message="counts.nCitations"
          />
        </div>
      </article>
    </Card>
  );
}
