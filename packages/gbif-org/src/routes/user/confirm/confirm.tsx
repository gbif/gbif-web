import { useUser } from '@/contexts/UserContext';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useState } from 'react';
import { MdCheck, MdError } from 'react-icons/md';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FormButton } from '../shared/FormComponents';
import { PageTitle } from '../shared/PageHeader';
import { UserPageLayout } from '../shared/UserPageLayout';

export const ConfirmSkeleton = ArticleSkeleton;

export function ConfirmPage() {
  return (
    <UserPageLayout title="Confirm Account">
      <ConfirmForm />
    </UserPageLayout>
  );
}

export function ConfirmForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { confirm } = useUser();

  const challengeCode = searchParams.get('code');
  const userName = searchParams.get('username');

  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!challengeCode || !userName) {
      setError('MISSING_PARAMETERS');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await confirm(challengeCode, userName);
      setConfirmed(true);
      // Redirect to profile after a short delay to show success message
      setTimeout(() => {
        navigate('/user/profile');
      }, 2000);
    } catch (err) {
      setError('CONFIRMATION_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'MISSING_PARAMETERS':
        return 'Invalid confirmation link. The confirmation code or username is missing.';
      case 'CONFIRMATION_FAILED':
        return 'Invalid or expired confirmation code. Please check your email or request a new confirmation.';
      default:
        return 'Unable to confirm account. Please try again.';
    }
  };

  // Show error immediately if parameters are missing
  useEffect(() => {
    if (!challengeCode || !userName) {
      setError('MISSING_PARAMETERS');
    }
  }, [challengeCode, userName]);

  if (confirmed) {
    return (
      <>
        <PageTitle
          title="Account Confirmed!"
          subtitle="Your account has been successfully activated"
        />

        <div className="g-rounded-md g-bg-green-50 g-p-4">
          <div className="g-flex">
            <div className="g-flex-shrink-0">
              <MdCheck className="g-h-5 g-w-5 g-text-green-400" />
            </div>
            <div className="g-ml-3">
              <p className="g-text-sm g-font-medium g-text-green-800">Welcome to GBIF!</p>
              <p className="g-mt-1 g-text-sm g-text-green-700">
                Your account has been confirmed and you are now logged in. You will be redirected to
                your profile shortly.
              </p>
            </div>
          </div>
        </div>

        <div className="g-text-center">
          <Link
            to="/user/profile"
            className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
          >
            Go to your profile now
          </Link>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageTitle
          title="Confirmation Error"
          subtitle="There was a problem confirming your account"
        />

        <div className="g-rounded-md g-bg-red-50 g-p-4">
          <div className="g-flex">
            <div className="g-flex-shrink-0">
              <MdError className="g-h-5 g-w-5 g-text-red-400" />
            </div>
            <div className="g-ml-3">
              <p className="g-text-sm g-font-medium g-text-red-800">Confirmation Failed</p>
              <p className="g-mt-1 g-text-sm g-text-red-700">{getErrorMessage(error)}</p>
            </div>
          </div>
        </div>

        <div className="g-text-center g-space-y-4">
          <p className="g-text-sm g-text-gray-500">
            Need help? Contact support or try registering again.
          </p>
          <div className="g-space-x-4">
            <Link
              to="/user/register"
              className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
            >
              Register Again
            </Link>
            <Link
              to="/user/login"
              className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
            >
              Sign In
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="Confirm Your Account"
        subtitle="Click the button below to activate your account"
      />

      <div className="g-bg-blue-50 g-border g-border-blue-200 g-rounded-md g-p-4">
        <p className="g-text-sm g-text-blue-700">
          <strong>Username:</strong> {userName}
        </p>
        <p className="g-text-sm g-text-blue-700 g-mt-1">
          Click confirm to activate your account and sign in automatically.
        </p>
      </div>

      <FormButton
        type="button"
        className="g-w-full"
        isLoading={isLoading}
        disabled={isLoading || !challengeCode || !userName}
        onClick={handleConfirm}
      >
        {isLoading ? 'Confirming Account...' : 'Confirm Account'}
      </FormButton>

      <p className="g-text-center g-text-sm g-text-gray-500">
        Already have an account?{' '}
        <Link
          to="/user/login"
          className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
