import { useUser } from '@/contexts/UserContext';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useState } from 'react';
import { MdHome, MdLock } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { LoaderFunctionArgs, useLoaderData } from 'react-router-dom';
import { ErrorMessage, FormButton, FormInput } from '../shared/FormComponents';
import { FormHeader } from '../shared/PageHeader';
import { ErrorState, LoadingState, SuccessState } from '../shared/StatusMessages';
import { UserPageLayout } from '../shared/UserPageLayout';

export interface UpdatePasswordLoaderData {
  challengeCode: string | null;
  userName: string | null;
  error: string | null;
}

export async function updatePasswordLoader({
  request,
}: LoaderFunctionArgs): Promise<UpdatePasswordLoaderData> {
  const url = new URL(request.url);
  const challengeCode = url.searchParams.get('code');
  const userName = url.searchParams.get('username');

  let error: string | null = null;
  if (!challengeCode || !userName) {
    error = 'MISSING_PARAMETERS';
  }

  return {
    challengeCode,
    userName,
    error,
  };
}

export const UpdatePasswordSkeleton = ArticleSkeleton;

export function UpdatePasswordPage() {
  return (
    <UserPageLayout title="Update Password">
      <UpdatePasswordForm />
    </UserPageLayout>
  );
}

function UpdatePasswordForm() {
  const { formatMessage } = useIntl();
  const { updateForgottenPassword } = useUser();
  const loaderData = useLoaderData() as UpdatePasswordLoaderData;

  const { challengeCode, userName, error: loaderError } = loaderData;

  const [isLoading, setIsLoading] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'pending' | 'success' | 'error'>(
    loaderError ? 'error' : 'pending'
  );
  const [error, setError] = useState(loaderError || '');

  const [touched, setTouched] = useState({
    password: false,
    repeatPassword: false,
  });

  const [values, setValues] = useState({
    password: '',
    repeatPassword: '',
  });

  const errors = {
    password: !values.password
      ? formatMessage({ id: 'profile.passwordRequired' })
      : values.password.length < 6
      ? formatMessage({ id: 'profile.passwordLength' })
      : values.password.length > 256
      ? formatMessage({ id: 'profile.passwordMaxLength' })
      : '',
    repeatPassword: !values.repeatPassword
      ? formatMessage({ id: 'profile.repeatPassword' })
      : values.password !== values.repeatPassword
      ? formatMessage({ id: 'profile.passwordsNotIdentical' })
      : '',
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.password || errors.repeatPassword) {
      setTouched({ password: true, repeatPassword: true });
      return;
    }

    if (!challengeCode || !userName) {
      setError('MISSING_PARAMETERS');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await updateForgottenPassword({
        password: values.password,
        challengeCode,
        userName,
      });
      setUpdateStatus('success');
    } catch (err) {
      setUpdateStatus('error');
      setError('UPDATE_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: string) => {
    if (!error) return '';
    switch (error) {
      case 'MISSING_PARAMETERS':
        return 'profile.error.MISSING_PARAMETERS';
      case 'UPDATE_FAILED':
        return 'profile.error.FAILED';
      default:
        return 'profile.error.FAILED';
    }
  };

  // Initialize error state from loader data
  useEffect(() => {
    if (loaderError) {
      setError(loaderError);
      setUpdateStatus('error');
    }
  }, [loaderError]);

  if (isLoading) {
    return (
      <LoadingState
        title={<FormattedMessage id="profile.updatingPassword" />}
        message={<FormattedMessage id="profile.updatingPasswordMessage" />}
      />
    );
  }

  if (updateStatus === 'success') {
    return (
      <SuccessState
        title={<FormattedMessage id="profile.passwordUpdated" />}
        message={<FormattedMessage id="profile.passwordUpdatedMessage" />}
        successMessage="Password successfully updated."
        successMessageId="profile.passwordUpdatedSuccess"
        primaryAction={{
          to: '/user/login',
          text: formatMessage({ id: 'profile.signIn' }),
        }}
        secondaryAction={{
          to: '/',
          text: formatMessage({ id: 'profile.backToHome' }),
          icon: MdHome,
        }}
      />
    );
  }

  if (updateStatus === 'error') {
    const errorMessage = getErrorMessage(error);
    return (
      <ErrorState
        title={<FormattedMessage id="profile.invalidLink" />}
        message={<FormattedMessage id="profile.updateFailedMessage" />}
        error={errorMessage}
        errorMessageId={errorMessage}
        helpText={<FormattedMessage id="profile.updateFailedHelp" />}
        primaryAction={{
          to: '/user/login',
          text: formatMessage({ id: 'profile.backToLogin' }),
        }}
        secondaryAction={{
          to: '/',
          text: formatMessage({ id: 'profile.backToHome' }),
          icon: MdHome,
        }}
      />
    );
  }

  // Default pending state - show form
  return (
    <div className="g-text-center g-space-y-6">
      <FormHeader
        title={<FormattedMessage id="profile.setPassword" />}
        subtitle={<FormattedMessage id="profile.setPasswordSubtitle" />}
        icon={MdLock}
      />

      <ErrorMessage errorMessageId={getErrorMessage(error)} />

      <form className="g-space-y-4" onSubmit={handleSubmit}>
        <div className="g-text-left">
          <FormInput
            id="password"
            label={formatMessage({ id: 'profile.newPassword' })}
            type="password"
            value={values.password}
            onChange={(value) => setValues((prev) => ({ ...prev, password: value }))}
            onBlur={() => handleBlur('password')}
            placeholder={formatMessage({ id: 'profile.createPassword' })}
            icon={MdLock}
            error={errors.password}
            touched={touched.password}
            autoComplete="new-password"
          />
        </div>

        <div className="g-text-left">
          <FormInput
            id="repeatPassword"
            label={formatMessage({ id: 'profile.repeatNewPassword' })}
            type="password"
            value={values.repeatPassword}
            onChange={(value) => setValues((prev) => ({ ...prev, repeatPassword: value }))}
            onBlur={() => handleBlur('repeatPassword')}
            placeholder={formatMessage({ id: 'profile.repeatNewPassword' })}
            icon={MdLock}
            error={errors.repeatPassword}
            touched={touched.repeatPassword}
            autoComplete="new-password"
          />
        </div>

        <div className="g-pt-4">
          <FormButton type="submit" className="g-w-full" isLoading={isLoading} disabled={isLoading}>
            <FormattedMessage id="profile.setPassword" />
          </FormButton>
        </div>
      </form>
    </div>
  );
}
