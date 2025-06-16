import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdCheckCircle, MdHome } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginBox } from '../login/login';

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

  return (
    <>
      <Helmet>
        <title>Confirm Account</title>
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex g-gap-4 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-1">
                <LoginBox>
                  <ConfirmationContent
                    status={confirmationStatus}
                    isConfirming={isConfirming}
                    error={error}
                  />
                </LoginBox>
              </div>
              <div
                className="g-flex-1 g-rounded-2xl g-bg-slate-100 g-shadow-xl g-bg-cover g-bg-center g-hidden md:g-block"
                style={{
                  backgroundImage:
                    'url("https://inaturalist-open-data.s3.amazonaws.com/photos/612156/original.JPG")',
                }}
              ></div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}

function ConfirmationContent({
  status,
  isConfirming,
  error,
}: {
  status: 'pending' | 'success' | 'error';
  isConfirming: boolean;
  error: string;
}) {
  if (isConfirming) {
    return (
      <div className="g-text-center g-space-y-6">
        <div className="g-flex g-justify-center">
          <svg className="g-animate-spin g-h-12 g-w-12 g-text-indigo-600" viewBox="0 0 24 24">
            <circle
              className="g-opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="g-opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Confirming Account</h1>
        <p className="g-text-gray-500">Please wait while we confirm your account...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="g-text-center g-space-y-6">
        <div className="g-flex g-justify-center">
          <MdCheckCircle className="g-h-16 g-w-16 g-text-green-500" />
        </div>
        <div>
          <h1 className="g-text-3xl g-font-bold g-text-gray-900">Welcome!</h1>
          <p className="g-text-gray-500 g-mt-2">Your account has been successfully confirmed</p>
        </div>
        <div className="g-bg-green-50 g-border g-border-green-200 g-text-green-700 g-rounded-lg g-p-4 g-text-sm">
          <FormattedMessage
            id="profile.accountConfirmed"
            defaultMessage="Your account is now active and you can start using GBIF services."
          />
        </div>
        <div className="g-space-y-3">
          <Link
            to="/user/login"
            className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
          >
            Sign In to Your Account
          </Link>
          <Link
            to="/"
            className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white g-text-gray-700 hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
          >
            <MdHome className="g-mr-2 g-h-4 g-w-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Error state
  let errorMessage = 'Unable to confirm account';
  switch (error) {
    case 'INVALID_CONFIRMATION_LINK':
      errorMessage = 'profile.invalidLink';
      break;
    case 'CONFIRMATION_FAILED':
      errorMessage = 'profile.confirmationFailed';
      break;
    default:
      errorMessage = 'An error occurred while confirming your account';
  }

  return (
    <div className="g-text-center g-space-y-6">
      <div>
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Confirmation Failed</h1>
        <p className="g-text-gray-500 g-mt-2">We were unable to confirm your account</p>
      </div>
      <div className="g-bg-red-50 g-border g-border-red-200 g-text-red-600 g-rounded-lg g-p-4 g-text-sm">
        <FormattedMessage id={errorMessage} defaultMessage={errorMessage} />
      </div>
      <div className="g-space-y-3">
        <p className="g-text-sm g-text-gray-600">
          If you continue to have problems, please contact support or try registering again.
        </p>
        <div className="g-space-y-2">
          <Link
            to="/user/register"
            className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
          >
            Register New Account
          </Link>
          <Link
            to="/"
            className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white g-text-gray-700 hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
          >
            <MdHome className="g-mr-2 g-h-4 g-w-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
