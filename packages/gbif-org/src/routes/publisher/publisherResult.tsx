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
    <Card className="mb-4">
      <article className="p-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <h3 className="text-base font-semibold mb-1">
              <DynamicLink to={`/publisher/${publisher.key}`}>{publisher.title}</DynamicLink>
            </h3>
            {publisher.created && (
              <p className="mb-4 text-sm text-slate-500">
                <FormattedMessage
                  id="publisher.joinedDate"
                  values={{
                    date: <FormattedDate {...defaultDateFormatProps} value={publisher.created} />,
                  }}
                />
                {isNew && (
                  <span className="text-xs bg-primary-500 px-2 py-1 text-white ml-2 rounded">
                    <FormattedMessage id="publisher.newPublisher" />
                  </span>
                )}
              </p>
            )}
            {publisher.excerpt && (
              <p className="font-normal text-slate-700 text-sm">{publisher.excerpt}</p>
            )}
            {!publisher.excerpt && (
              <p className="font-normal text-slate-400 text-sm">
                <FormattedMessage id="phrases.noDescriptionProvided" />
              </p>
            )}
          </div>
          {publisher.logoUrl && (
            <div className="max-w-32 md:max-w-48 max-h-32 md:max-h-48 ">
              <img
                onError={(e) => {
                  // hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
                src={publisher.logoUrl}
                alt={'Publisher logo'}
                className="rounded border border-slate-100 p-1 w-full"
              />
            </div>
          )}
        </div>
        <div className="-m-1 mt-2 flex flex-row items-center flex-wrap">
          <Tag>
            <FormattedMessage id={`enums.countryCode.${publisher.country}`} />
          </Tag>
          <div className="flex-grow"></div>
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
