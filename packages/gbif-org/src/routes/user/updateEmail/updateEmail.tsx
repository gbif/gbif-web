import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useState } from 'react';
import { MdEmail, MdHome } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useSearchParams } from 'react-router-dom';
import { FormButton } from '../shared/FormComponents';
import { FormHeader } from '../shared/PageHeader';
import { ErrorState, LoadingState, SuccessState } from '../shared/StatusMessages';
import { UserPageLayout } from '../shared/UserPageLayout';

export const UpdateEmailSkeleton = ArticleSkeleton;
// TODO: this file has hardcoded texts that should go into the translation files
export function UpdateEmailPage() {
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

  const updateEmail = async () => {
    if (!challengeCode || !userName || !email) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/user/updateEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeCode,
          userName,
          email,
        }),
      });

      if (response.ok) {
        setUpdateStatus('success');
      } else {
        setUpdateStatus('error');
        setError('UPDATE_FAILED');
      }
    } catch (err) {
      setUpdateStatus('error');
      setError('UPDATE_FAILED');
    } finally {
      setIsUpdating(false);
    }
  };

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'INVALID_UPDATE_LINK':
        return 'profile.invalidLink';
      case 'UPDATE_FAILED':
        return 'profile.updateFailed';
      default:
        return 'An error occurred while updating your email address';
    }
  };

  const renderContent = () => {
    if (isUpdating) {
      return (
        <LoadingState
          title="Updating Email"
          message="Please wait while we update your email address..."
        />
      );
    }

    if (updateStatus === 'success') {
      return (
        <SuccessState
          title="Email Updated!"
          message="Your email address has been successfully updated"
          successMessage="Your new email address is now active for your GBIF account."
          successMessageId="profile.emailUpdated"
          primaryAction={{
            to: '/user/login',
            text: 'Sign In to Your Account',
          }}
          secondaryAction={{
            to: '/',
            text: 'Go to Homepage',
            icon: MdHome,
          }}
        />
      );
    }

    if (updateStatus === 'error') {
      const errorMessage = getErrorMessage(error);
      return (
        <ErrorState
          title="Update Failed"
          message="We were unable to update your email address"
          error={errorMessage}
          errorMessageId={errorMessage}
          helpText="If you continue to have problems, please contact support or try the update process again."
          primaryAction={{
            to: '/user/profile',
            text: 'Go to Profile',
          }}
          secondaryAction={{
            to: '/',
            text: 'Go to Homepage',
            icon: MdHome,
          }}
        />
      );
    }

    // Default pending state - show form
    return (
      <div className="g-text-center g-space-y-6">
        <FormHeader
          title="Update Email Address"
          subtitle="Confirm your new email address below"
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
              <span className="g-text-xs g-uppercase g-text-gray-500">NEW EMAIL</span>
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
