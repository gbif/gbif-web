import { useConfig } from '@/config/config';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaGithub as SocialIconGithub, FaGoogle as SocialIconGoogle } from 'react-icons/fa';
import { IoMdGlobe } from 'react-icons/io';
import { MdArrowRight, MdLock, MdMail, MdPerson } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { login, whoAmI } from '../auth';

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
    <>
      <Helmet>
        <title>Login</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl ">
            <div className="g-flex g-gap-4 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-1 ">
                <LoginBox>
                  <LoginForm />
                </LoginBox>
              </div>
              <div
                className="g-flex-1 g-rounded-2xl g-bg-slate-100 g-shadow-xl g-bg-cover g-bg-center g-hidden md:g-block"
                style={{
                  backgroundImage:
                    'url("https://inaturalist-open-data.s3.amazonaws.com/photos/612156/original.JPG")',
                  // 'url("https://inaturalist-open-data.s3.amazonaws.com/photos/612156/original.JPG")',
                }}
              ></div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}

export function RegistrationPage() {
  return (
    <>
      <Helmet>
        <title>Register</title>
        {/* TODO we need much richer meta data. Especially for datasets.  */}
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl ">
            <div className="g-flex g-gap-4 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-1">
                <LoginBox>
                  <RegisterForm />
                </LoginBox>
              </div>
              <div
                className="g-flex-1 g-bg-slate-100 g-rounded-2xl g-shadow-xl g-bg-cover g-bg-center g-hidden md:g-block"
                style={{
                  backgroundImage:
                    // 'url("https://inaturalist-open-data.s3.amazonaws.com/photos/260174073/original.jpg")',
                    'url("https://inaturalist-open-data.s3.amazonaws.com/photos/102008699/original.jpeg")',
                }}
              ></div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
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

  let errorMessage = 'Unable to log in';
  // switch based on the possible error enums
  switch (error) {
    case 'BASIC_LOGIN_FAILED':
      errorMessage = 'profile.unknownUser';
      break;
    default:
      errorMessage = 'Unable to log in'; // TODO replace with a generic transslation error message
  }

  return (
    <>
      <div className="g-text-center">
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Welcome back</h1>
        <p className="g-text-gray-500 g-mt-2">Please sign in to your account</p>
      </div>

      {error && (
        <div className="g-bg-red-50 g-border g-border-red-200 g-text-red-600 g-rounded-lg g-p-4 g-text-sm">
          {error && <FormattedMessage id={errorMessage} />}
        </div>
      )}

      <form className="g-space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1" htmlFor="email">
            Email
          </label>
          <div className="g-relative">
            <MdMail className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
            <input
              type="email"
              id="email"
              value={values.email}
              onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
              onBlur={() => handleBlur('email')}
              className="g-pl-10 g-w-full g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg focus:g-ring-2 focus:g-ring-indigo-500 focus:g-border-indigo-500"
              placeholder="Enter your email"
            />
          </div>
          {touched.email && errors.email && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <div className="g-relative">
            <MdLock className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
            <input
              type="password"
              id="password"
              value={values.password}
              onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
              onBlur={() => handleBlur('password')}
              className="g-pl-10 g-w-full g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg focus:g-ring-2 focus:g-ring-indigo-500 focus:g-border-indigo-500"
              placeholder="Enter your password"
            />
          </div>
          {touched.password && errors.password && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="g-flex g-items-center g-justify-between">
          {/* <div className="g-flex g-items-center">
            <input
              type="checkbox"
              id="remember"
              className="g-h-4 g-w-4 g-text-indigo-600 focus:g-ring-indigo-500 g-border-gray-300 g-rounded"
            />
            <label htmlFor="remember" className="g-ml-2 g-block g-text-sm g-text-gray-700">
              Remember me
            </label>
          </div> */}
          <button
            type="button"
            className="g-text-sm g-font-medium g-text-indigo-600 hover:g-text-indigo-500"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500 disabled:g-opacity-50 disabled:g-cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="g-flex g-items-center">
              <svg className="g-animate-spin g-h-5 g-w-5 g-mr-3" viewBox="0 0 24 24">
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
              Signing in...
            </span>
          ) : (
            <>Sign in</>
          )}
        </button>
      </form>

      <div className="g-relative">
        <div className="g-absolute g-inset-0 g-flex g-items-center">
          <div className="g-w-full g-border-t g-border-gray-300"></div>
        </div>
        <div className="g-relative g-flex g-justify-center g-text-sm">
          <span className="g-px-2 g-bg-white g-text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="g-grid g-grid-cols-2 g-gap-3">
        <a
          href="/auth/google/login"
          className="g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
        >
          <SocialIconGoogle className="g-h-5 g-w-5 g-text-gray-700" />
          <span className="g-ml-2 g-text-gray-700">Google</span>
        </a>
        <a
          href="/auth/github/login"
          className="g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-gray-300 g-rounded-lg g-shadow-sm g-bg-white hover:g-bg-gray-50 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
        >
          <SocialIconGithub className="g-h-5 g-w-5 g-text-gray-700" />
          <span className="g-ml-2 g-text-gray-700">GitHub</span>
        </a>
      </div>

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

  return (
    <>
      <div className="g-text-center">
        <h1 className="g-text-3xl g-font-bold g-text-gray-900">Create Account</h1>
        <p className="g-text-gray-500 g-mt-2">Sign up for your new account</p>
      </div>

      <form className="g-space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label
            className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1"
            htmlFor="username"
          >
            Username
          </label>
          <div className="g-relative">
            <MdPerson className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
            <input
              type="text"
              id="username"
              value={values.username}
              onChange={(e) => setValues((prev) => ({ ...prev, username: e.target.value }))}
              onBlur={() => handleBlur('username')}
              className={`g-pl-10 g-w-full g-px-4 g-py-2 g-border g-rounded-lg focus:g-ring-2 focus:g-ring-indigo-500 focus:g-border-indigo-500 ${
                touched.username && errors.username ? 'g-border-red-500' : 'g-border-gray-300'
              }`}
              placeholder="Choose a username"
            />
          </div>
          {touched.username && errors.username && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.username}</p>
          )}
        </div>

        <div>
          <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1" htmlFor="email">
            Email
          </label>
          <div className="g-relative">
            <MdMail className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
            <input
              type="email"
              id="email"
              value={values.email}
              onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
              onBlur={() => handleBlur('email')}
              className={`g-pl-10 g-w-full g-px-4 g-py-2 g-border g-rounded-lg focus:g-ring-2 focus:g-ring-indigo-500 focus:g-border-indigo-500 ${
                touched.email && errors.email ? 'g-border-red-500' : 'g-border-gray-300'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {touched.email && errors.email && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1"
            htmlFor="country"
          >
            Country
          </label>
          <div className="g-relative">
            <IoMdGlobe className="g-absolute g-left-3 g-top-1/2 g--translate-y-1/2 g-text-gray-400 g-h-5 g-w-5" />
            <select
              id="country"
              value={values.country}
              onChange={(e) => setValues((prev) => ({ ...prev, country: e.target.value }))}
              onBlur={() => handleBlur('country')}
              className={`g-pl-10 g-w-full g-px-4 g-py-2 g-border g-rounded-lg focus:g-ring-2 focus:g-ring-indigo-500 focus:g-border-indigo-500 g-bg-white ${
                touched.country && errors.country ? 'g-border-red-500' : 'g-border-gray-300'
              }`}
            >
              <option value="">Select your country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          {touched.country && errors.country && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.country}</p>
          )}
        </div>

        <div>
          <label
            className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-1"
            htmlFor="password"
          >
            Password
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
              placeholder="Create a password"
            />
          </div>
          {touched.password && errors.password && (
            <p className="g-mt-1 g-text-sm g-text-red-600">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="g-w-full g-flex g-items-center g-justify-center g-px-4 g-py-2 g-border g-border-transparent g-rounded-lg g-shadow-sm g-text-white g-bg-indigo-600 hover:g-bg-indigo-700 focus:g-outline-none focus:g-ring-2 focus:g-ring-offset-2 focus:g-ring-indigo-500"
        >
          Create Account
          <MdArrowRight className="g-ml-2 g-h-4 g-w-4" />
        </button>
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
