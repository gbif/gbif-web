import { useConfig } from '@/config/config';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { useEffect, useState } from 'react';
import { IoMdGlobe } from 'react-icons/io';
import { MdArrowRight, MdLock, MdMail, MdPerson } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import { login, whoAmI } from '../auth';
import { ErrorMessage, FormButton, FormInput, FormSelect } from '../shared/FormComponents';
import { PageTitle } from '../shared/PageHeader';
import { UserPageLayout } from '../shared/UserPageLayout';

export const LoginSkeleton = ArticleSkeleton;

export function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    whoAmI()
      .then((response) => {
        if (response.user) {
          // User is already logged in, redirect to profile
          navigate('/user/profile');
        }
      })
      .catch(() => {
        // User is not logged in, stay on login page
      });
  }, [navigate]);

  return (
    <UserPageLayout title="Login">
      <LoginForm />
    </UserPageLayout>
  );
}

export function RegistrationPage() {
  return (
    <UserPageLayout
      title="Register"
      backgroundImage="https://inaturalist-open-data.s3.amazonaws.com/photos/102008699/original.jpeg"
    >
      <RegisterForm />
    </UserPageLayout>
  );
}

export function LoginBox({ children }: { children?: React.ReactNode }) {
  const config = useConfig();
  return (
    <div className="g-flex g-items-center g-justify-center g-p-4">
      <div className="g-max-w-md g-w-full g-bg-white g-p-8 g-space-y-6">{children}</div>
    </div>
  );
}

export function LoginForm() {
  const navigate = useNavigate();
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const errors = {
    email: !values.email && 'Email is required',
    password: !values.password && 'Password is required',
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
      // Redirect to user profile page after successful login
      navigate('/user/profile');
    } catch (err) {
      setError('BASIC_LOGIN_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'BASIC_LOGIN_FAILED':
        return 'profile.unknownUser';
      default:
        return 'Unable to log in';
    }
  };

  return (
    <>
      <PageTitle title="Welcome back" subtitle="Please sign in to your account" />

      <ErrorMessage
        error={error ? 'Unable to log in' : ''}
        errorMessageId={error ? getErrorMessage(error) : undefined}
      />

      <form className="g-space-y-4" onSubmit={handleSubmit}>
        <FormInput
          id="email"
          autoComplete="email"
          label="Email"
          type="email"
          value={values.email}
          onChange={(value) => setValues((prev) => ({ ...prev, email: value }))}
          onBlur={() => handleBlur('email')}
          placeholder="Enter your email"
          icon={MdMail}
          error={errors.email}
          touched={touched.email}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={(value) => setValues((prev) => ({ ...prev, password: value }))}
          onBlur={() => handleBlur('password')}
          placeholder="Enter your password"
          icon={MdLock}
          error={errors.password}
          touched={touched.password}
        />

        <div className="g-flex g-items-center g-justify-between">
          <button
            type="button"
            className="g-text-sm g-font-medium g-text-indigo-600 hover:g-text-indigo-500"
          >
            Forgot password?
          </button>
        </div>

        <FormButton type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </FormButton>
      </form>

      {/* <div className="g-relative">
        <div className="g-absolute g-inset-0 g-flex g-items-center">
          <div className="g-w-full g-border-t g-border-gray-300"></div>
        </div>
        <div className="g-relative g-flex g-justify-center g-text-sm">
          <span className="g-px-2 g-bg-white g-text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="g-grid g-grid-cols-2 g-gap-3">
        <a href="/auth/google/login" className={cn(commonClasses.button.secondary, 'g-w-auto')}>
          <SocialIconGoogle className="g-h-5 g-w-5 g-text-gray-700" />
          <span className="g-ml-2 g-text-gray-700">Google</span>
        </a>
        <a href="/auth/github/login" className={cn(commonClasses.button.secondary, 'g-w-auto')}>
          <SocialIconGithub className="g-h-5 g-w-5 g-text-gray-700" />
          <span className="g-ml-2 g-text-gray-700">GitHub</span>
        </a>
      </div> */}

      <p className="g-text-center g-text-sm g-text-gray-500">
        Don't have an account?{' '}
        <Link
          to="/user/register"
          className="g-font-medium g-text-indigo-600 hover:g-text-indigo-500"
        >
          Register now
        </Link>
      </p>
    </>
  );
}

function RegisterForm() {
  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Brazil',
    'India',
    'China',
    'South Korea',
    'Mexico',
    'Spain',
    'Italy',
    'Netherlands',
  ];

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

  const errors = {
    username: !values.username
      ? 'Username is required'
      : values.username.length < 3
      ? 'Username must be at least 3 characters'
      : values.username.includes(' ')
      ? 'Username cannot contain spaces'
      : '',
    email: !values.email ? 'Email is required' : '',
    country: !values.country ? 'Please select your country' : '',
    password: !values.password ? 'Password is required' : '',
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const countryOptions = countries.map((country) => ({
    value: country,
    label: country,
  }));

  return (
    <>
      <PageTitle title="Create Account" subtitle="Sign up for your new account" />

      <form className="g-space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FormInput
          id="username"
          autoComplete="username"
          label="Username"
          type="text"
          value={values.username}
          onChange={(value) => setValues((prev) => ({ ...prev, username: value }))}
          onBlur={() => handleBlur('username')}
          placeholder="Choose a username"
          icon={MdPerson}
          error={errors.username}
          touched={touched.username}
        />

        <FormInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(value) => setValues((prev) => ({ ...prev, email: value }))}
          onBlur={() => handleBlur('email')}
          placeholder="Enter your email"
          icon={MdMail}
          error={errors.email}
          touched={touched.email}
        />

        <FormSelect
          id="country"
          label="Country"
          value={values.country}
          onChange={(value) => setValues((prev) => ({ ...prev, country: value }))}
          onBlur={() => handleBlur('country')}
          options={countryOptions}
          placeholder="Select your country"
          icon={IoMdGlobe}
          error={errors.country}
          touched={touched.country}
        />

        <FormInput
          id="password"
          label="Password"
          type="password"
          value={values.password}
          onChange={(value) => setValues((prev) => ({ ...prev, password: value }))}
          onBlur={() => handleBlur('password')}
          placeholder="Create a password"
          icon={MdLock}
          error={errors.password}
          touched={touched.password}
        />

        <FormButton type="submit" variant="primary" className="g-w-full">
          Create Account
          <MdArrowRight className="g-ml-2 g-h-4 g-w-4" />
        </FormButton>
      </form>

      <p className="g-text-center g-text-sm g-text-gray-500">
        Already have an account?{' '}
        <Link to="/user/login" className="g-font-medium g-text-indigo-600 hover:g-text-indigo-500">
          Sign in
        </Link>
      </p>
    </>
  );
}
