import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdCheckCircle, MdHome, MdLock } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LoginBox } from '../login/login';

export const UpdatePasswordSkeleton = ArticleSkeleton;

export function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState('');

  const challengeCode = searchParams.get('challengeCode');
  const userName = searchParams.get('userName');

  useEffect(() => {
    if (!challengeCode || !userName) {
      setUpdateStatus('error');
      setError('INVALID_UPDATE_LINK');
    }
  }, [challengeCode, userName]);

  const updatePassword = async (password: string) => {
    if (!challengeCode || !userName) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/user/updatePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          challengeCode,
          userName,
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
        <title>Update Password</title>
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex g-gap-4 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-1">
                <LoginBox>
                  <UpdatePasswordContent
                    status={updateStatus}
                    isUpdating={isUpdating}
                    error={error}
                    onUpdate={updatePassword}
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

function UpdatePasswordContent({
  status,
  isUpdating,
  error,
  onUpdate,
}: {
  status: 'pending' | 'success' | 'error';
  isUpdating: boolean;
  error: string;
  onUpdate: (password: string) => void;
}) {
  const [touched, setTouched] = useState({
    password: false,
    repeatPassword: false,
  });

  const [values, setValues] = useState({
    password: '',
    repeatPassword: '',
  });

  const [formError, setFormError] = useState('');

  const errors = {
    password: !values.password
      ? 'Password is required'
      : values.password.length < 6
      ? 'Password must be at least 6 characters'
      : values.password.length > 256
      ? 'Password must be less than 256 characters'
      : '',
    repeatPassword: !values.repeatPassword
      ? 'Please repeat your password'
      : values.password !== values.repeatPassword
      ? 'Passwords do not match'
      : '',
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (errors.password || errors.repeatPassword) {
      setTouched({ password: true, repeatPassword: true });
      return;
    }

    if (values.password !== values.repeatPassword) {
      setFormError('Passwords do not match');
      return;
    }

    onUpdate(values.password);
  };

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
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Updating Password</h1>
        <p className="g-text-gray-500">Please wait while we update your password...</p>
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
          <h1 className="g-text-3xl g-font-bold g-text-gray-900">Password Updated!</h1>
          <p className="g-text-gray-500 g-mt-2">Your password has been successfully updated</p>
        </div>
        <div className="g-bg-green-50 g-border g-border-green-200 g-text-green-700 g-rounded-lg g-p-4 g-text-sm">
          <FormattedMessage
            id="profile.passwordUpdated"
            defaultMessage="Your new password is now active. You can now sign in with your new password."
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
    let errorMessage = 'Unable to update password';
    switch (error) {
      case 'INVALID_UPDATE_LINK':
        errorMessage = 'profile.invalidLink';
        break;
      case 'UPDATE_FAILED':
        errorMessage = 'profile.updateFailed';
        break;
      default:
        errorMessage = 'An error occurred while updating your password';
    }

    return (
      <div className="g-text-center g-space-y-6">
        <div>
          <h1 className="g-text-3xl g-font-bold g-text-gray-900">Update Failed</h1>
          <p className="g-text-gray-500 g-mt-2">We were unable to update your password</p>
        </div>
        <div className="g-bg-red-50 g-border g-border-red-200 g-text-red-600 g-rounded-lg g-p-4 g-text-sm">
          <FormattedMessage id={errorMessage} defaultMessage={errorMessage} />
        </div>
        <div className="g-space-y-3">
          <p className="g-text-sm g-text-gray-600">
            If you continue to have problems, please contact support or try the password reset
            process again.
          </p>
          <div className="g-space-y-2">
            <Link
              to="/user/login"
              className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
            >
              Back to Sign In
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
        <MdLock className="g-h-16 g-w-16 g-text-indigo-600" />
      </div>
      <div>
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Set New Password</h1>
        <p className="g-text-gray-500 g-mt-2">Please enter your new password below</p>
      </div>

      {(formError || error) && (
        <div className="g-bg-red-50 g-border g-border-red-200 g-text-red-600 g-rounded-lg g-p-4 g-text-sm">
          {formError || (
            <FormattedMessage
              id="profile.updateFailed"
              defaultMessage="Unable to update password"
            />
          )}
        </div>
      )}

      <form className="g-space-y-4" onSubmit={handleSubmit}>
        <div className="g-text-left">
          <label
            className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1"
            htmlFor="password"
          >
            <span className="g-text-xs g-uppercase g-text-gray-500">New Password</span>
          </label>
          <div className="g-relative">
            <MdLock className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
            <input
              type="password"
              id="password"
              value={values.password}
              onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
              onBlur={() => handleBlur('password')}
              className={`g-pl-10 g-w-full g-px-4 g-py-2 g-border g-rounded-lg focus:g-ring-2 focus:g-ring-indigo-500 focus:g-border-indigo-500 ${
                touched.password && errors.password ? 'g-border-red-500' : 'g-border-gray-300'
              }`}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />
          </div>
          {touched.password && errors.password && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="g-text-left">
          <label
            className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1"
            htmlFor="repeatPassword"
          >
            <span className="g-text-xs g-uppercase g-text-gray-500">Repeat Password</span>
          </label>
          <div className="g-relative">
            <MdLock className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
            <input
              type="password"
              id="repeatPassword"
              value={values.repeatPassword}
              onChange={(e) => setValues((prev) => ({ ...prev, repeatPassword: e.target.value }))}
              onBlur={() => handleBlur('repeatPassword')}
              className={`g-pl-10 g-w-full g-px-4 g-py-2 g-border g-rounded-lg focus:g-ring-2 focus:g-ring-indigo-500 focus:g-border-indigo-500 ${
                touched.repeatPassword && errors.repeatPassword
                  ? 'g-border-red-500'
                  : 'g-border-gray-300'
              }`}
              placeholder="Repeat your new password"
              autoComplete="new-password"
            />
          </div>
          {touched.repeatPassword && errors.repeatPassword && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.repeatPassword}</p>
          )}
        </div>

        <div className="g-pt-4">
          <button
            type="submit"
            className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500 disabled:g-opacity-50 disabled:g-cursor-not-allowed"
            disabled={isUpdating}
          >
            <FormattedMessage id="profile.setPassword" defaultMessage="Set Password" />
          </button>
        </div>
      </form>
    </div>
  );
}
