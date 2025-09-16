import { FeedbackQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import { MdMailOutline, MdOpenInNew } from 'react-icons/md';

interface DataProviderFeedbackProps {
  feedbackOptions: NonNullable<FeedbackQuery['feedbackOptions']>;
}

export function DataProviderFeedback({ feedbackOptions }: DataProviderFeedbackProps) {
  if (!feedbackOptions?.externalServiceUrl && !feedbackOptions?.contactEmail) return null;

  return (
    <div>
      <a
        href={feedbackOptions.externalServiceUrl ?? `mailto:${feedbackOptions.contactEmail}`}
        target="_blank"
        rel="noopener noreferrer"
        className="g-block g-w-full g-p-4 g-text-left g-border g-rounded-lg g-bg-gray-50 hover:g-bg-gray-100 g-transition-colors"
      >
        <h4 className="g-font-medium g-mb-1">
          <FormattedMessage
            id="feedback.contactDataProvider"
            defaultMessage="Contact data provider"
          />
          {feedbackOptions.externalServiceUrl && <MdOpenInNew className="g-ms-2 g-h-4 g-w-4" />}
          {!feedbackOptions.externalServiceUrl && <MdMailOutline className="g-ms-2 g-h-4 g-w-4" />}
        </h4>
        <p className="g-text-sm g-text-muted-foreground">
          <FormattedMessage
            id="feedback.contactDataProviderDescription"
            defaultMessage="For questions about data quality, species information, or dataset-specific issues"
          />
        </p>
        {!feedbackOptions.externalServiceUrl && (
          <p className="g-text-sm g-text-muted-foreground g-mt-2">
            <FormattedMessage
              id="feedback.sendEmailTo"
              defaultMessage="Send email to {emailLink}"
              values={{
                emailLink: feedbackOptions.contactName ?? feedbackOptions.contactEmail,
              }}
            />
          </p>
        )}
      </a>
      {feedbackOptions.externalServiceUrl && feedbackOptions.contactEmail && (
        <div className="g-text-xs g-text-muted-foreground g-mt-1">
          <FormattedMessage
            id="feedback.orWriteMailTo"
            defaultMessage="Or write a mail to {contactLink}"
            values={{
              contactLink: (
                <a
                  href={`mailto:${feedbackOptions.contactEmail}`}
                  className="g-underline g-pointer-events-auto"
                >
                  {feedbackOptions.contactName ?? feedbackOptions.contactEmail}
                </a>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
}
