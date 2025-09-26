import { FormattedMessage } from 'react-intl';
import { CheckboxField } from '../mdtForm';
import { DynamicLink } from '@/reactRouterPlugins';

export function Terms() {
  return (
    <div className="g-space-y-4 g-pt-2">
      <CheckboxField
        name="have_read_the_service_agreement"
        label={
          <FormattedMessage
            id="mdt.termsServiceAgreement"
            values={{
              a: (text) => (
                <DynamicLink
                  className="g-text-primary-500 hover:g-underline"
                  to="/terms/hosted-repository-service"
                >
                  {text}
                </DynamicLink>
              ),
            }}
          />
        }
      />

      <CheckboxField
        name="will_ensure_datasets_published_will_remain_online"
        label={<FormattedMessage id="mdt.termsCommitHelp" />}
      />

      <CheckboxField
        name="will_participate_in_quarterly_webinars"
        label={<FormattedMessage id="mdt.termsQuarterlyWebinars" />}
      />

      <CheckboxField
        name="will_provide_feedback"
        label={<FormattedMessage id="mdt.termsEnsureOnline" />}
      />

      <p className="g-pb-2 g-text-sm">
        <FormattedMessage id="mdt.followingSubmission" />
      </p>
    </div>
  );
}
