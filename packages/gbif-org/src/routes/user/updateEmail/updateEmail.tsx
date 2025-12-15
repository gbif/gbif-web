import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useCallback, useEffect, useState } from 'react';
import { MdEmail, MdHome } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { FormButton } from '../shared/FormComponents';
import { FormHeader } from '../shared/PageHeader';
import { ErrorState, LoadingState, SuccessState } from '../shared/StatusMessages';
import { UserPageLayout } from '../shared/UserPageLayout';
import { useUser } from '@/contexts/UserContext';

export const UpdateEmailSkeleton = ArticleSkeleton;
// TODO: this file has hardcoded texts that should go into the translation files
export function UpdateEmailPage() {
  const { formatMessage } = useIntl();
  const { changeEmail } = useUser();
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState('');

  const challengeCode = searchParams.get('code');
  const userName = searchParams.get('username');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!challengeCode || !userName || !email) {
      setUpdateStatus('error');
      setError('INVALID_UPDATE_LINK');
    }
  }, [challengeCode, userName, email]);

  const updateEmail = useCallback(() => {
    if (!challengeCode || !userName || !email) return;

    setIsUpdating(true);
    try {
      changeEmail(challengeCode, email, userName)
        .then(() => {
          setUpdateStatus('success');
        })
        .catch(() => {
          setUpdateStatus('error');
          setError('UPDATE_FAILED');
        })
        .finally(() => {
          setIsUpdating(false);
        });
    } catch (e) {
      setUpdateStatus('error');
      setError('UPDATE_FAILED');
      setIsUpdating(false);
    }
  }, [challengeCode, email, userName, setUpdateStatus, changeEmail]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'INVALID_UPDATE_LINK':
        return 'profile.invalidLink';
      case 'UPDATE_FAILED':
        return 'profile.updateFailed';
      default:
        return 'profile.updateFailed';
    }
  };

  const renderContent = () => {
    if (isUpdating) {
      return (
        <LoadingState
          title={<FormattedMessage id="profile.updatingEmail" defaultMessage="Updating Email" />}
          message={
            <FormattedMessage
              id="profile.updatingEmailMessage"
              defaultMessage="Please wait while we update your email address..."
            />
          }
        />
      );
    }

    if (updateStatus === 'success') {
      return (
        <SuccessState
          title={
            <FormattedMessage id="profile.emailUpdatedTitle" defaultMessage="Email Updated!" />
          }
          message={
            <FormattedMessage
              id="profile.emailUpdatedMessage"
              defaultMessage="Your email address has been successfully updated"
            />
          }
          primaryAction={{
            to: '/user/profile',
            text: formatMessage({ id: 'profile.goToProfile' }),
          }}
          secondaryAction={{
            to: '/',
            text: formatMessage({ id: 'profile.goToHomepage' }),
            icon: MdHome,
          }}
        />
      );
    }

    if (updateStatus === 'error') {
      const errorMessage = getErrorMessage(error);
      return (
        <ErrorState
          title={<FormattedMessage id="profile.updateFailedTitle" defaultMessage="Update Failed" />}
          message={
            <FormattedMessage
              id="profile.updateFailedMessage"
              defaultMessage="We were unable to update your email address"
            />
          }
          error={<FormattedMessage id={errorMessage} defaultMessage={errorMessage} />}
          helpText={
            <FormattedMessage
              id="profile.updateEmailHelpText"
              defaultMessage="If you continue to have problems, please contact support or try the update process again."
            />
          }
          primaryAction={{
            to: '/user/profile',
            text: formatMessage({ id: 'profile.goToProfile' }),
          }}
          secondaryAction={{
            to: '/',
            text: formatMessage({ id: 'profile.goToHomepage' }),
            icon: MdHome,
          }}
        />
      );
    }

    // Default pending state - show form
    return (
      <div className="g-text-center g-space-y-6">
        <FormHeader
          title={
            <FormattedMessage id="profile.updateEmailTitle" defaultMessage="Update Email Address" />
          }
          subtitle={
            <FormattedMessage
              id="profile.updateEmailSubtitle"
              defaultMessage="Confirm your new email address below"
            />
          }
          icon={MdEmail}
        />

        <form
          className="g-space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            updateEmail();
          }}
        >
          <div className="g-text-left">
            <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
              <span className="g-text-xs g-uppercase g-text-gray-500">
                <FormattedMessage id="profile.newEmail" defaultMessage="NEW EMAIL" />
              </span>
            </label>
            <input
              type="email"
              value={email || ''}
              disabled
              className="g-w-full g-px-3 g-py-2 g-border-0 g-border-b g-border-gray-300 g-bg-gray-50 g-text-gray-600 focus:g-outline-none focus:g-border-gray-500 g-text-sm"
              autoComplete="off"
            />
          </div>

          <div className="g-pt-4">
            <FormButton type="submit" isLoading={isUpdating} className="g-w-full">
              <FormattedMessage id="profile.updateEmail" defaultMessage="Update Email" />
            </FormButton>
          </div>
        </form>
      </div>
    );
  };

  return <UserPageLayout title="Update Email Address">{renderContent()}</UserPageLayout>;
}
