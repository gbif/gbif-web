import { useUser } from '@/contexts/UserContext';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useState } from 'react';
import { MdHome, MdLock } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ErrorMessage, FormButton, FormInput } from '../shared/FormComponents';
import { FormHeader } from '../shared/PageHeader';
import { ErrorState, LoadingState, SuccessState } from '../shared/StatusMessages';
import { UserPageLayout } from '../shared/UserPageLayout';

export const UpdatePasswordSkeleton = ArticleSkeleton;

export function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [error, setError] = useState('');
  const { updateForgottenPassword } = useUser();

  const challengeCode = searchParams.get('code');
  const userName = searchParams.get('username');

  const [touched, setTouched] = useState({
    password: false,
    repeatPassword: false,
  });

  const [values, setValues] = useState({
    password: '',
    repeatPassword: '',
  });

  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!challengeCode || !userName) {
      setUpdateStatus('error');
      setError('INVALID_UPDATE_LINK');
    }
  }, [challengeCode, userName]);

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

  const updatePassword = async (password: string) => {
    if (!challengeCode || !userName) return;

    setIsUpdating(true);
    try {
      const response = await updateForgottenPassword({
        password,
        challengeCode,
        userName,
      });
      if (response.error) {
        setError('LOGIN_FAILED');
        return;
      } else {
        // Redirect to the page user was trying to access, or profile page by default
        const returnTo = '/user/profile';
        navigate(returnTo);
      }
    } catch (err) {
      setError('LOGIN_FAILED');
    } finally {
      setIsUpdating(false);
    }

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

    updatePassword(values.password);
  };

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'INVALID_UPDATE_LINK':
        return 'profile.invalidLink';
      case 'UPDATE_FAILED':
        return 'profile.updateFailed';
      default:
        return 'An error occurred while updating your password';
    }
  };

  const renderContent = () => {
    if (isUpdating) {
      return (
        <LoadingState
          title="Updating Password"
          message="Please wait while we update your password..."
        />
      );
    }

    if (updateStatus === 'success') {
      return (
        <SuccessState
          title="Password Updated!"
          message="Your password has been successfully updated"
          successMessage="Your new password is now active. You can now sign in with your new password."
          successMessageId="profile.passwordUpdated"
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
          message="We were unable to update your password"
          error={errorMessage}
          errorMessageId={errorMessage}
          helpText="If you continue to have problems, please contact support or try the password reset process again."
          primaryAction={{
            to: '/user/login',
            text: 'Back to Sign In',
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
          title="Set New Password"
          subtitle="Please enter your new password below"
          icon={MdLock}
        />

        <ErrorMessage error={formError} />
        {error && (
          <ErrorMessage error="Unable to update password" errorMessageId="profile.updateFailed" />
        )}

        <form className="g-space-y-4" onSubmit={handleSubmit}>
          <div className="g-text-left">
            <FormInput
              id="password"
              label="New Password"
              type="password"
              value={values.password}
              onChange={(value) => setValues((prev) => ({ ...prev, password: value }))}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your new password"
              icon={MdLock}
              error={errors.password}
              touched={touched.password}
              autoComplete="new-password"
            />
          </div>

          <div className="g-text-left">
            <FormInput
              id="repeatPassword"
              label="Repeat Password"
              type="password"
              value={values.repeatPassword}
              onChange={(value) => setValues((prev) => ({ ...prev, repeatPassword: value }))}
              onBlur={() => handleBlur('repeatPassword')}
              placeholder="Repeat your new password"
              icon={MdLock}
              error={errors.repeatPassword}
              touched={touched.repeatPassword}
              autoComplete="new-password"
            />
          </div>

          <div className="g-pt-4">
            <FormButton
              type="submit"
              className="g-w-full"
              isLoading={isUpdating}
              disabled={isUpdating}
            >
              <FormattedMessage id="profile.setPassword" defaultMessage="Set Password" />
            </FormButton>
          </div>
        </form>
      </div>
    );
  };

  return <UserPageLayout title="Update Password">{renderContent()}</UserPageLayout>;
}
