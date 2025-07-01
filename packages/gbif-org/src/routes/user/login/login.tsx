import { buttonVariants } from '@/components/ui/button';
import { UserError, useUser } from '@/contexts/UserContext';
import country from '@/enums/basic/country.json';
import { useI18n } from '@/reactRouterPlugins';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useState } from 'react';
import { FaGithub as SocialIconGithub, FaGoogle as SocialIconGoogle } from 'react-icons/fa';
import { IoMdGlobe } from 'react-icons/io';
import { MdArrowRight, MdLock, MdMail, MdPerson } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ErrorMessage, FormButton, FormInput, FormSelect } from '../shared/FormComponents';
import { PageTitle } from '../shared/PageHeader';
import { UserPageLayout } from '../shared/UserPageLayout';
import {
  hasFormErrors,
  validateEmail,
  validatePassword,
  validateUsername,
} from '../shared/validationUtils';
import {
  checkBrowserCryptoSupport,
  getChallenge,
  solveProofOfWork,
  type ProofOfWorkResult,
} from './proofOfWork';

export const LoginSkeleton = ArticleSkeleton;

type ErrorType =
  | 'CRYPTO_NOT_SUPPORTED'
  | 'PROOF_OF_WORK_FAILED'
  | 'INVALID_SOLUTION'
  | 'REGISTRATION_SUCCESS_CHECK_EMAIL'
  | 'REGISTRATION_FAILED'
  | 'INVALID_INPUT'
  | 'PROOF_OF_WORK_NOT_READY'
  | undefined;

export function LoginPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useUser();
  const { localizeLink } = useI18n();

  useEffect(() => {
    // Check if user is already logged in
    if (!isLoading && isLoggedIn) {
      // User is already logged in, redirect to profile. We can use the localizeLink to ensure the URL is correct for the current locale
      navigate(localizeLink(`/user/profile`));
    }
  }, [navigate, isLoggedIn, isLoading, localizeLink]);

  return (
    <UserPageLayout title="Login">
      <LoginForm />
    </UserPageLayout>
  );
}

export function RegistrationPage() {
  const navigate = useNavigate();
  const { isLoggedIn, isLoading } = useUser();
  const { localizeLink } = useI18n();

  useEffect(() => {
    // Check if user is already logged in
    if (!isLoading && isLoggedIn) {
      // User is already logged in, redirect to profile. We can use the localizeLink to ensure the URL is correct for the current locale
      navigate(localizeLink(`/user/profile`));
    }
  }, [navigate, isLoggedIn, isLoading, localizeLink]);

  return (
    <UserPageLayout title="Register" backgroundImage="/img/frog.jpeg">
      <RegisterForm />
    </UserPageLayout>
  );
}

export function LoginForm() {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const location = useLocation();
  const { login, resetPassword } = useUser();
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  // generate statis translations for error messages
  const translations = useMemo(() => {
    return {
      ENTER_EMAIL: formatMessage({ id: 'profile.enterEmail' }),
    };
  }, [formatMessage]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const errors = {
    email: !values.email && formatMessage({ id: 'profile.emailRequired' }),
    password: !values.password && formatMessage({ id: 'profile.passwordRequired' }),
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.email || errors.password) {
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await login(values);
      const state = location.state as LocationState | null;
      const returnTo = state?.from || '/user/profile';
      navigate(returnTo);
    } catch (err) {
      if (err instanceof UserError && err.type === 'INVALID_REQUEST') {
        setError('INVALID_LOGIN');
      } else {
        setError('SERVER_ERROR');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!values.email) {
      setTouched((prev) => ({ ...prev, email: true }));
      return;
    }

    setIsResettingPassword(true);
    setError('');

    try {
      await resetPassword(values.email);
      setResetEmailSent(true);
    } catch (err) {
      setError('RESET_PASSWORD_FAILED');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleBackToLogin = () => {
    setResetEmailSent(false);
    setError('');
  };

  const getLoginErrorMessage = (error: string) => {
    if (!error) return '';
    switch (error) {
      case 'INVALID_LOGIN':
        return 'profile.unknownUser';
      case 'RESET_PASSWORD_FAILED':
        return 'profile.error.FAILED';
      default:
        return 'profile.error.FAILED';
    }
  };

  if (resetEmailSent) {
    return (
      <>
        <PageTitle
          title={<FormattedMessage id="profile.resetPasswordRequest" />}
          subtitle={<FormattedMessage id="profile.resetPasswordSubtitle" />}
        />

        <div className="g-rounded-md g-bg-green-50 g-p-4">
          <div className="g-flex">
            <div className="g-flex-shrink-0">
              <MdMail className="g-h-5 g-w-5 g-text-green-400" />
            </div>
            <div className="g-ml-3">
              <p className="g-mt-1 g-text-sm g-text-green-700">
                <FormattedMessage id="profile.resetPasswordMessage" />
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleBackToLogin}
          className="g-w-full g-flex g-justify-center g-items-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-md g-shadow-sm g-bg-white g-text-sm g-font-medium g-text-gray-700 hover:g-bg-gray-50 g-transition-colors g-duration-200"
        >
          <FormattedMessage id="profile.backToLogin" />
        </button>
      </>
    );
  }

  return (
    <>
      <PageTitle
        title={<FormattedMessage id="profile.welcomeBack" />}
        subtitle={<FormattedMessage id="profile.signInToAccount" />}
      />

      {error && <ErrorMessage errorMessageId={getLoginErrorMessage(error)} />}

      <form className="g-space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="email"
          autoComplete="email"
          label={formatMessage({ id: 'profile.usernameEmail' })}
          type="text"
          value={values.email}
          onChange={(value) => setValues((prev) => ({ ...prev, email: value }))}
          onBlur={() => handleBlur('email')}
          placeholder={translations.ENTER_EMAIL}
          icon={MdMail}
          error={errors.email}
          touched={touched.email}
        />

        <FormInput
          id="password"
          label={formatMessage({ id: 'profile.password' })}
          type="password"
          value={values.password}
          onChange={(value) => setValues((prev) => ({ ...prev, password: value }))}
          onBlur={() => handleBlur('password')}
          placeholder={formatMessage({ id: 'profile.enterPassword' })}
          icon={MdLock}
          error={errors.password}
          touched={touched.password}
        />

        <div className="g-flex g-items-center g-justify-between">
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={isResettingPassword || !values.email}
            className="g-text-sm g-font-medium g-text-primary-700 hover:g-text-primary-600 disabled:g-text-gray-400 disabled:g-cursor-not-allowed g-transition-colors g-duration-200"
            title={
              !values.email
                ? formatMessage({ id: 'profile.enterEmailFirst' })
                : formatMessage({ id: 'profile.sendPasswordReset' })
            }
          >
            {isResettingPassword
              ? formatMessage({ id: 'profile.sendingResetEmail' })
              : formatMessage({ id: 'profile.forgotPassword' })}
          </button>
        </div>

        <FormButton type="submit" isLoading={isLoading} disabled={isLoading} className="g-w-full">
          {isLoading
            ? formatMessage({ id: 'profile.signingIn' })
            : formatMessage({ id: 'profile.signIn' })}
        </FormButton>
      </form>

      <div className="g-relative">
        <div className="g-absolute g-inset-0 g-flex g-items-center">
          <div className="g-w-full g-border-t g-border-gray-300"></div>
        </div>
        <div className="g-relative g-flex g-justify-center g-text-sm">
          <span className="g-px-2 g-bg-white g-text-gray-500">
            <FormattedMessage id="profile.orContinueWith" />
          </span>
        </div>
      </div>
      <div className="g-grid g-grid-cols-2 g-gap-3">
        <a
          href="/auth/google/login"
          className={cn(buttonVariants({ variant: 'outline' }), 'g-w-auto')}
        >
          <SocialIconGoogle className="g-h-5 g-w-5 g-text-gray-700" />
          <span className="g-ml-2 g-text-gray-700">Google</span>
        </a>
        <a
          href="/auth/github/login"
          className={cn(buttonVariants({ variant: 'outline' }), 'g-w-auto')}
        >
          <SocialIconGithub className="g-h-5 g-w-5 g-text-gray-700" />
          <span className="g-ml-2 g-text-gray-700">GitHub</span>
        </a>
      </div>
      <p className="g-text-center g-text-sm g-text-gray-500">
        <FormattedMessage id="profile.dontHaveAccount" />{' '}
        <Link
          to="/user/register"
          className="g-font-medium g-text-primary-700 hover:g-text-primary-600"
        >
          <FormattedMessage id="profile.registerNow" />
        </Link>
      </p>
    </>
  );
}

function RegisterForm() {
  const { formatMessage } = useIntl();
  const { localizeLink, locale } = useI18n();
  const { register } = useUser();
  const countryOptions = useMemo(() => {
    return country.map((code) => ({
      value: code,
      label: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
  }, [formatMessage]);

  const [touched, setTouched] = useState({
    username: false,
    email: false,
    country: false,
    password: false,
  });

  const [values, setValues] = useState({
    username: '',
    email: '',
    country: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorType>(undefined);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Proof of work state
  const [powState, setPowState] = useState<{
    status: 'idle' | 'solving' | 'ready' | 'error';
    cancel?: () => void;
    promise?: Promise<ProofOfWorkResult>;
  }>({
    status: 'idle',
  });

  const errors = {
    username: validateUsername(values.username, formatMessage),
    email: validateEmail(values.email, formatMessage),
    country: !values.country ? formatMessage({ id: 'profile.countryRequired' }) : false,
    password: validatePassword(values.password, formatMessage),
  } as { [key: string]: string | false };

  // Start proof of work challenge when component mounts or when retrying
  useEffect(() => {
    const cryptoSupport = checkBrowserCryptoSupport();
    if (!cryptoSupport.supported) {
      setError('CRYPTO_NOT_SUPPORTED');
      setPowState({
        status: 'error',
        cancel: undefined,
        promise: undefined,
      });
      return;
    }

    if (powState.status === 'idle') {
      setPowState({
        status: 'solving',
        cancel: undefined, // Clear old cancel function
        promise: undefined, // Clear old promise
      });
      getChallenge()
        .then((challenge) => {
          const { cancel, promise } = solveProofOfWork(challenge);
          setPowState({
            status: 'solving',
            cancel,
            promise,
          });
        })
        .catch((error) => {
          if (error.code === 'CRYPTO_NOT_SUPPORTED') {
            setError('CRYPTO_NOT_SUPPORTED');
          } else {
            setError('PROOF_OF_WORK_FAILED');
          }
          setPowState({
            status: 'error',
            promise: undefined,
            cancel: undefined,
          });
        });
    }

    return () => {
      if (powState.cancel) {
        powState.cancel();
      }
    };
  }, [powState.status, powState]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasFormErrors(errors)) {
      setTouched({ username: true, email: true, country: true, password: true });
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const attemptRegistration = async (): Promise<void> => {
      // Wait for proof of work to complete if it's still processing
      const solution = powState.promise ? await powState.promise : undefined;

      // If crypto is not supported, there isn't much we can do other than tell the user to retry or contact helpdesk
      if (error === 'CRYPTO_NOT_SUPPORTED') {
        setIsLoading(false);
        return;
      }

      if (!solution) {
        setError('PROOF_OF_WORK_FAILED');
        setIsLoading(false);
        return;
      }

      try {
        // Send registration data with proof-of-work directly to backend for validation
        const registrationData = {
          user: {
            email: values.email,
            username: values.username,
            password: values.password,
            settings: {
              locale: locale.code,
              country: values.country,
            },
          },
          challengeId: solution.challengeId,
          nonce: solution.nonce,
        };

        await register(registrationData);

        // Show confirmation message instead of redirecting
        setRegistrationSuccess(true);
        setError(undefined);
        setIsLoading(false);
      } catch (err) {
        // Check if this is a server validation failure that we should retry
        const isServerValidationFailure =
          err instanceof UserError && err.type === 'INVALID_SOLUTION';

        // No matter why it failed, we will need a new proof-of-work challenge
        setPowState((prev) => ({
          ...prev,
          status: 'idle',
          result: undefined,
          promise: undefined, // Clear the old promise
        }));

        if (isServerValidationFailure) {
          setError('INVALID_SOLUTION');
          setIsLoading(false);
          return;
        }

        // show error message
        setError(err.type ?? 'REGISTRATION_FAILED');
        setIsLoading(false);
        return;
      }
    };

    await attemptRegistration();
    setIsLoading(false);
  };

  // Show success message if registration was successful
  if (registrationSuccess) {
    return (
      <>
        <PageTitle
          title={<FormattedMessage id="profile.registrationComplete" />}
          subtitle={<FormattedMessage id="profile.checkYourEmail" />}
        />

        <div className="g-rounded-md g-bg-green-50 g-p-4">
          <div className="g-flex">
            <div className="g-flex-shrink-0">
              <MdMail className="g-h-5 g-w-5 g-text-green-400" />
            </div>
            <div className="g-ml-3">
              <p className="g-text-sm g-text-green-700">
                <FormattedMessage id="profile.registrationSuccessCheckEmail" />
              </p>
            </div>
          </div>
        </div>

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

  return (
    <>
      <PageTitle
        title={<FormattedMessage id="profile.createAccount" />}
        subtitle={<FormattedMessage id="profile.signUpForAccount" />}
      />

      {/* Show verification message only when form is submitted and waiting for proof-of-work */}
      {isLoading && powState.status === 'solving' && (
        <div className="g-rounded-md g-bg-blue-50 g-p-4">
          <div className="g-flex">
            <div className="g-flex-shrink-0">
              <div className="g-h-5 g-w-5 g-border-2 g-border-blue-400 g-border-t-transparent g-rounded-full g-animate-spin"></div>
            </div>
            <div className="g-ml-3">
              <p className="g-text-sm g-text-blue-700">
                <FormattedMessage id="profile.waitingForServer" />
              </p>
            </div>
          </div>
        </div>
      )}

      {error && <ErrorMessage errorMessageId={`profile.error.${error}`} />}

      <form className="g-space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="username"
          label={formatMessage({ id: 'profile.username' })}
          type="text"
          value={values.username}
          onChange={(value) => setValues((prev) => ({ ...prev, username: value }))}
          onBlur={() => handleBlur('username')}
          placeholder={formatMessage({ id: 'profile.chooseUsername' })}
          icon={MdPerson}
          error={errors.username}
          touched={touched.username}
        />

        <FormInput
          id="email"
          label={formatMessage({ id: 'profile.email' })}
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(value) => setValues((prev) => ({ ...prev, email: value }))}
          onBlur={() => handleBlur('email')}
          placeholder={formatMessage({ id: 'profile.enterEmail' })}
          icon={MdMail}
          error={errors.email}
          touched={touched.email}
        />

        <FormSelect
          id="country"
          label={formatMessage({ id: 'profile.country' })}
          value={values.country}
          onChange={(value) => setValues((prev) => ({ ...prev, country: value }))}
          onBlur={() => handleBlur('country')}
          options={countryOptions}
          placeholder={formatMessage({ id: 'profile.selectCountry' })}
          icon={IoMdGlobe}
          error={errors.country}
          touched={touched.country}
        />

        <FormInput
          id="password"
          label={formatMessage({ id: 'profile.password' })}
          type="password"
          value={values.password}
          onChange={(value) => setValues((prev) => ({ ...prev, password: value }))}
          onBlur={() => handleBlur('password')}
          placeholder={formatMessage({ id: 'profile.createPassword' })}
          icon={MdLock}
          error={errors.password}
          touched={touched.password}
        />

        <FormButton
          type="submit"
          className="g-w-full"
          isLoading={isLoading}
          disabled={
            isLoading ||
            (powState.status === 'error' && error === 'CRYPTO_NOT_SUPPORTED') ||
            (powState.status === 'error' && error === 'PROOF_OF_WORK_FAILED') ||
            (powState.status === 'error' && error === 'PROOF_OF_WORK_NOT_READY')
          }
        >
          {isLoading
            ? formatMessage({ id: 'profile.creatingAccount' })
            : formatMessage({ id: 'profile.createAccount' })}
          {!isLoading && <MdArrowRight className="g-ml-2 g-h-4 g-w-4" />}
        </FormButton>
      </form>

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

type LocationState = {
  from?: string;
};
