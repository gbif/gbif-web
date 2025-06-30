import { useUser } from '@/contexts/UserContext';
import { useI18n } from '@/reactRouterPlugins';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link, LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';
import { ErrorMessage, FormButton } from '../shared/FormComponents';
import { PageTitle } from '../shared/PageHeader';
import { UserPageLayout } from '../shared/UserPageLayout';

export interface ConfirmLoaderData {
  challengeCode: string | null;
  userName: string | null;
  error: string | null;
}

export async function confirmLoader({ request }: LoaderFunctionArgs): Promise<ConfirmLoaderData> {
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
  const { confirm } = useUser();
  const { localizeLink } = useI18n();
  const loaderData = useLoaderData() as ConfirmLoaderData;

  const { challengeCode, userName, error: loaderError } = loaderData;

  const [isLoading, setIsLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState(loaderError || '');

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
        navigate(localizeLink('/user/profile'));
      }, 2000);
    } catch (err) {
      setError('CONFIRMATION_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: string) => {
    if (!error) return '';
    switch (error) {
      case 'MISSING_PARAMETERS':
        return 'profile.error.MISSING_PARAMETERS';
      case 'CONFIRMATION_FAILED':
        return 'profile.error.CONFIRMATION_FAILED';
      default:
        return 'profile.error.FAILED';
    }
  };

  // Initialize error state from loader data
  useEffect(() => {
    if (loaderError) {
      setError(loaderError);
    }
  }, [loaderError]);

  if (confirmed) {
    return (
      <>
        <PageTitle
          title={<FormattedMessage id="profile.accountConfirmed" />}
          subtitle={<FormattedMessage id="profile.accountConfirmed" />}
        />

        <div className="g-rounded-md g-bg-green-50 g-p-4">
          <div className="g-flex">
            <div className="g-flex-shrink-0">
              <MdCheck className="g-h-5 g-w-5 g-text-green-400" />
            </div>
            <div className="g-ml-3">
              <p className="g-text-sm g-font-medium g-text-green-800">
                <FormattedMessage id="profile.welcome" />
              </p>
              <p className="g-mt-1 g-text-sm g-text-green-700">
                <FormattedMessage id="profile.accountConfirmed" />
              </p>
            </div>
          </div>
        </div>

        <div className="g-text-center">
          <Link
            to={localizeLink('/user/profile')}
            className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
          >
            <FormattedMessage id="profile.profile" />
          </Link>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PageTitle
          title={<FormattedMessage id="profile.invalidLink" />}
          subtitle={<FormattedMessage id="profile.invalidLinkMessage" />}
        />

        <ErrorMessage errorMessageId={getErrorMessage(error)} />

        <div className="g-text-center g-space-y-4">
          <div className="g-space-x-4">
            <Link
              to={localizeLink('/user/register')}
              className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
            >
              <FormattedMessage id="profile.register" />
            </Link>
            <Link
              to={localizeLink('/user/login')}
              className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
            >
              <FormattedMessage id="profile.signIn" />
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title={<FormattedMessage id="profile.verifyAccount" />}
        subtitle={<FormattedMessage id="profile.emailVerification" />}
      />

      <FormButton
        type="button"
        className="g-w-full"
        isLoading={isLoading}
        disabled={isLoading || !challengeCode || !userName}
        onClick={handleConfirm}
      >
        {isLoading ? (
          <FormattedMessage id="profile.verifyAccount" />
        ) : (
          <FormattedMessage id="profile.verifyAccount" />
        )}
      </FormButton>

      <p className="g-text-center g-text-sm g-text-gray-500">
        <FormattedMessage id="profile.alreadyHaveAccount" />{' '}
        <Link
          to={localizeLink('/user/login')}
          className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
        >
          <FormattedMessage id="profile.signIn" />
        </Link>
      </p>
    </>
  );
}
