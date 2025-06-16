import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useState } from 'react';
import { MdHome } from 'react-icons/md';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPageLayout } from '../shared/UserPageLayout';
import { LoadingState, SuccessState, ErrorState } from '../shared/StatusMessages';

export const ConfirmSkeleton = ArticleSkeleton;

export function ConfirmPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  );
  const [error, setError] = useState('');

  const confirmationCode = searchParams.get('code');
  const userName = searchParams.get('username');

  useEffect(() => {
    if (confirmationCode && userName) {
      confirmUser(confirmationCode, userName);
    } else {
      setConfirmationStatus('error');
      setError('INVALID_CONFIRMATION_LINK');
    }
  }, [confirmationCode, userName]);

  const confirmUser = async (code: string, username: string) => {
    setIsConfirming(true);
    try {
      const response = await fetch('/api/user/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmationKey: code,
          userName: username,
        }),
      });

      if (response.ok) {
        setConfirmationStatus('success');
      } else {
        setConfirmationStatus('error');
        setError('CONFIRMATION_FAILED');
      }
    } catch (err) {
      setConfirmationStatus('error');
      setError('CONFIRMATION_FAILED');
    } finally {
      setIsConfirming(false);
    }
  };

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'INVALID_CONFIRMATION_LINK':
        return 'profile.invalidLink';
      case 'CONFIRMATION_FAILED':
        return 'profile.confirmationFailed';
      default:
        return 'An error occurred while confirming your account';
    }
  };

  const renderContent = () => {
    if (isConfirming) {
      return (
        <LoadingState
          title="Confirming Account"
          message="Please wait while we confirm your account..."
        />
      );
    }

    if (confirmationStatus === 'success') {
      return (
        <SuccessState
          title="Welcome!"
          message="Your account has been successfully confirmed"
          successMessage="Your account is now active and you can start using GBIF services."
          successMessageId="profile.accountConfirmed"
          primaryAction={{
            to: "/user/login",
            text: "Sign In to Your Account"
          }}
          secondaryAction={{
            to: "/",
            text: "Go to Homepage",
            icon: MdHome
          }}
        />
      );
    }

    // Error state
    const errorMessage = getErrorMessage(error);
    return (
      <ErrorState
        title="Confirmation Failed"
        message="We were unable to confirm your account"
        error={errorMessage}
        errorMessageId={errorMessage}
        helpText="If you continue to have problems, please contact support or try registering again."
        primaryAction={{
          to: "/user/register",
          text: "Register New Account"
        }}
        secondaryAction={{
          to: "/",
          text: "Go to Homepage",
          icon: MdHome
        }}
      />
    );
  };

  return (
    <UserPageLayout title="Confirm Account">
      {renderContent()}
    </UserPageLayout>
  );
}