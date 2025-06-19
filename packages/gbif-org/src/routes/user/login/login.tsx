// import { cn } from '@/utils/shadcn';
// import { FaGithub as SocialIconGithub, FaGoogle as SocialIconGoogle } from 'react-icons/fa';
// import { buttonVariants } from '@/components/ui/button';
import { UserError, useUser } from '@/contexts/UserContext';
import country from '@/enums/basic/country.json';
import { useI18n } from '@/reactRouterPlugins';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useMemo, useState } from 'react';
import { IoMdGlobe } from 'react-icons/io';
import { MdArrowRight, MdLock, MdMail, MdPerson } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ErrorMessage, FormButton, FormInput, FormSelect } from '../shared/FormComponents';
import { PageTitle } from '../shared/PageHeader';
import { UserPageLayout } from '../shared/UserPageLayout';

export const LoginSkeleton = ArticleSkeleton;

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
    <UserPageLayout
      title="Register"
      backgroundImage="https://inaturalist-open-data.s3.amazonaws.com/photos/102008699/original.jpeg"
    >
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

  const getErrorMessage = (error: string) => {
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

      <ErrorMessage errorMessageId={getErrorMessage(error)} />

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

      {/* <div className="g-relative">
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
      </p> */}
    </>
  );
}

function RegisterForm() {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
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
  const [error, setError] = useState('');

  const errors = {
    username: !values.username
      ? formatMessage({ id: 'profile.usernameRequired' })
      : values.username.length < 3
      ? formatMessage({ id: 'profile.usernameMinLength' })
      : values.username.includes(' ')
      ? formatMessage({ id: 'profile.usernameNoSpaces' })
      : '',
    email: !values.email ? formatMessage({ id: 'profile.emailRequired' }) : '',
    country: !values.country ? formatMessage({ id: 'profile.countryRequired' }) : '',
    password: !values.password ? formatMessage({ id: 'profile.passwordRequired' }) : '',
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error)) {
      setTouched({ username: true, email: true, country: true, password: true });
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(values);
      // Redirect to user profile page after successful registration
      navigate('/user/profile');
    } catch (err) {
      setError('REGISTRATION_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title={<FormattedMessage id="profile.createAccount" />}
        subtitle={<FormattedMessage id="profile.signUpForAccount" />}
      />

      <ErrorMessage errorMessageId={error} />

      <form className="g-space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="username"
          autoComplete="username"
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

        <FormButton type="submit" className="g-w-full" isLoading={isLoading} disabled={isLoading}>
          {isLoading
            ? formatMessage({ id: 'profile.creatingAccount' })
            : formatMessage({ id: 'profile.createAccount' })}
          {!isLoading && <MdArrowRight className="g-ml-2 g-h-4 g-w-4" />}
        </FormButton>
      </form>

      <p className="g-text-center g-text-sm g-text-gray-500">
        <FormattedMessage id="profile.alreadyHaveAccount" />{' '}
        <Link
          to="/user/login"
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
