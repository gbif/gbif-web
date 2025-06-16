import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdCheckCircle, MdHome, MdEmail } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginBox } from '../login/login';

export const UpdateEmailSkeleton = ArticleSkeleton;

export function UpdateEmailPage() {
  const navigate = useNavigate();
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

  return (
    <>
      <Helmet>
        <title>Update Email Address</title>
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex g-gap-4 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-1">
                <LoginBox>
                  <UpdateEmailContent
                    status={updateStatus}
                    isUpdating={isUpdating}
                    error={error}
                    email={email}
                    onUpdate={updateEmail}
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

function UpdateEmailContent({
  status,
  isUpdating,
  error,
  email,
  onUpdate,
}: {
  status: 'pending' | 'success' | 'error';
  isUpdating: boolean;
  error: string;
  email: string | null;
  onUpdate: () => void;
}) {
  if (isUpdating) {
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
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Updating Email</h1>
        <p className="g-text-gray-500">Please wait while we update your email address...</p>
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
          <h1 className="g-text-3xl g-font-bold g-text-gray-900">Email Updated!</h1>
          <p className="g-text-gray-500 g-mt-2">Your email address has been successfully updated</p>
        </div>
        <div className="g-bg-green-50 g-border g-border-green-200 g-text-green-700 g-rounded-lg g-p-4 g-text-sm">
          <FormattedMessage
            id="profile.emailUpdated"
            defaultMessage="Your new email address is now active for your GBIF account."
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

  if (status === 'error') {
    let errorMessage = 'Unable to update email address';
    switch (error) {
      case 'INVALID_UPDATE_LINK':
        errorMessage = 'profile.invalidLink';
        break;
      case 'UPDATE_FAILED':
        errorMessage = 'profile.updateFailed';
        break;
      default:
        errorMessage = 'An error occurred while updating your email address';
    }

    return (
      <div className="g-text-center g-space-y-6">
        <div>
          <h1 className="g-text-3xl g-font-bold g-text-gray-900">Update Failed</h1>
          <p className="g-text-gray-500 g-mt-2">We were unable to update your email address</p>
        </div>
        <div className="g-bg-red-50 g-border g-border-red-200 g-text-red-600 g-rounded-lg g-p-4 g-text-sm">
          <FormattedMessage id={errorMessage} defaultMessage={errorMessage} />
        </div>
        <div className="g-space-y-3">
          <p className="g-text-sm g-text-gray-600">
            If you continue to have problems, please contact support or try the update process again.
          </p>
          <div className="g-space-y-2">
            <Link
              to="/user/profile"
              className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
            >
              Go to Profile
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

  // Default pending state - show form
  return (
    <div className="g-text-center g-space-y-6">
      <div className="g-flex g-justify-center">
        <MdEmail className="g-h-16 g-w-16 g-text-indigo-600" />
      </div>
      <div>
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Update Email Address</h1>
        <p className="g-text-gray-500 g-mt-2">Confirm your new email address below</p>
      </div>
      
      <form className="g-space-y-4" onSubmit={(e) => { e.preventDefault(); onUpdate(); }}>
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
          <button
            type="submit"
            className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
          >
            <FormattedMessage id="profile.updateEmail" defaultMessage="Update Email" />
          </button>
        </div>
      </form>
    </div>
  );
}