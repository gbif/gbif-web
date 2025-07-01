import { UserError, useUser } from '@/contexts/UserContext';
import country from '@/enums/basic/country.json';
import React, { useEffect, useMemo, useState } from 'react';
import {
  LuCheckCircle as CheckCircle,
  LuLock as Lock,
  LuSave as Save,
  LuUser as User,
} from 'react-icons/lu';
import { MdEdit, MdLanguage, MdLocationOn, MdMail } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { useI18n } from '@/reactRouterPlugins';
import { useIntl } from 'react-intl';
import { ErrorMessage, FormButton, FormInput, FormSelect } from '../shared/FormComponents';
import {
  getErrorMessage,
  hasFormErrors,
  TouchedFields,
  validateEmail,
  validateName,
  validatePassword,
  validatePasswordConfirmation,
  validateRequired,
  ValidationErrors,
} from '../shared/validationUtils';
import { GitHubAccountItem } from './GitHubAccountItem';
import { GoogleAccountItem } from './GoogleAccountItem';
import { OrcidAccountItem } from './OrcidAccountItem';
import { ProfileSkeleton } from './profileLayout';

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  locale: string;
}

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, disconnectAccount } = useUser();
  const { formatMessage } = useIntl();
  const intlConfig = useI18n();
  intlConfig.availableLocales[0].code;

  // Language options from available locales
  const languageOptions = useMemo(() => {
    return intlConfig.availableLocales.map((locale) => ({
      value: locale.code,
      label: locale.label,
    }));
  }, [intlConfig.availableLocales, formatMessage]);

  // Country options
  const countryOptions = useMemo(() => {
    return country.map((code) => ({
      value: code,
      label: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
  }, [formatMessage]);

  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    country: user?.settings?.country || '',
    locale:
      user?.settings?.locale &&
      intlConfig.availableLocales.some((l) => l.code === user?.settings?.locale)
        ? user?.settings?.locale
        : 'en',
  });

  const [editedInfo, setEditedInfo] = useState<UserInfo>({
    ...userInfo,
    locale:
      userInfo.locale && intlConfig.availableLocales.some((l) => l.code === userInfo.locale)
        ? userInfo.locale
        : 'en',
  });

  const [passwordInfo, setPasswordInfo] = useState<PasswordInfo>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Form validation state
  const [profileTouched, setProfileTouched] = useState<TouchedFields>({
    firstName: false,
    lastName: false,
    email: false,
    country: false,
    locale: false,
  });

  const [passwordTouched, setPasswordTouched] = useState<TouchedFields>({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

  // Flash message state for connection errors
  const [flashError, setFlashError] = useState<{
    provider?: string;
    error?: string;
  } | null>(null);

  // Read flash cookie on component mount
  useEffect(() => {
    const readFlashCookie = () => {
      const cookies = document.cookie.split(';');
      const profileFlashCookie = cookies.find((cookie) =>
        cookie.trim().startsWith('profileFlashInfo=')
      );

      if (profileFlashCookie) {
        try {
          const cookieValue = profileFlashCookie.split('=')[1];
          const decodedValue = decodeURIComponent(cookieValue);
          const flashInfo = JSON.parse(decodedValue);

          if (flashInfo.error && flashInfo.authProvider) {
            setFlashError({
              provider: flashInfo.authProvider,
              error: flashInfo.error,
            });
          }

          // Clear the cookie by setting it to expire
          document.cookie = 'profileFlashInfo=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        } catch (e) {
          console.error('Failed to parse profileFlashInfo cookie:', e);
        }
      }
    };

    readFlashCookie();
  }, []);

  // Validation logic
  const profileErrors: ValidationErrors = {
    firstName: validateName(
      isEditing ? editedInfo.firstName : userInfo.firstName,
      'firstName',
      formatMessage
    ),
    lastName: validateName(
      isEditing ? editedInfo.lastName : userInfo.lastName,
      'lastName',
      formatMessage
    ),
    email: validateEmail(isEditing ? editedInfo.email : userInfo.email, formatMessage),
    country: validateRequired(
      isEditing ? editedInfo.country : userInfo.country,
      'country',
      formatMessage
    ),
    locale: validateRequired(
      isEditing ? editedInfo.locale : userInfo.locale,
      'language',
      formatMessage
    ),
  };

  const passwordErrors: ValidationErrors = {
    currentPassword: validateRequired(
      passwordInfo.currentPassword,
      'currentPassword',
      formatMessage
    ),
    newPassword: validatePassword(passwordInfo.newPassword, formatMessage),
    confirmPassword: validatePasswordConfirmation(
      passwordInfo.newPassword,
      passwordInfo.confirmPassword,
      formatMessage
    ),
  };

  const handleProfileBlur = (field: keyof TouchedFields) => {
    setProfileTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePasswordBlur = (field: keyof TouchedFields) => {
    setPasswordTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSave = async () => {
    // Validate all fields
    if (hasFormErrors(profileErrors)) {
      setProfileTouched({
        firstName: true,
        lastName: true,
        email: true,
        country: true,
        locale: true,
      });
      return;
    }

    setIsProfileLoading(true);
    setProfileError('');

    try {
      await updateProfile(editedInfo);

      setUserInfo(editedInfo);
      setIsEditing(false);
      setProfileTouched({
        firstName: false,
        lastName: false,
        email: false,
        country: false,
        locale: false,
      });
    } catch (error) {
      if (error instanceof UserError) {
        setProfileError(error.type);
      } else {
        setProfileError('UPDATE_FAILED');
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSave = async () => {
    // Validate all fields
    if (hasFormErrors(passwordErrors)) {
      setPasswordTouched({
        currentPassword: true,
        newPassword: true,
        confirmPassword: true,
      });
      return;
    }

    setIsPasswordLoading(true);
    setPasswordError('');

    try {
      await changePassword(passwordInfo.currentPassword, passwordInfo.newPassword);

      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordTouched({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
      });

      // Show success notification
      setPasswordUpdateSuccess(true);
    } catch (error) {
      if (error instanceof UserError && error.type === 'INVALID_PASSWORD') {
        setPasswordError('INVALID_CURRENT_PASSWORD');
      } else {
        setPasswordError('PASSWORD_UPDATE_FAILED');
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handlePasswordChange = (field: keyof PasswordInfo, value: string) => {
    setPasswordInfo((prev) => ({ ...prev, [field]: value }));
    // Clear success notification when user starts typing
    if (passwordUpdateSuccess) {
      setPasswordUpdateSuccess(false);
    }
  };

  const handleConnectAccount = (provider: 'google' | 'github' | 'orcid') => {
    // Clear flash error when attempting new connection
    setFlashError(null);
    // Redirect to OAuth connection endpoint
    window.location.href = `/auth/${provider}/connect`;
  };

  const handleDisconnectAccount = async (provider: 'google' | 'github' | 'orcid') => {
    try {
      await disconnectAccount(provider);
    } catch (error) {
      console.error(`Failed to disconnect from ${provider}:`, error);
    }
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <Card className="g-p-6">
        <div className="g-flex g-justify-between g-items-center g-mb-6">
          <h2 className="g-text-xl g-font-bold g-text-gray-900 g-flex g-items-center g-space-x-2">
            {/* <Settings className="g-w-5 g-h-5 g-text-primary-600" /> */}
            <span>{formatMessage({ id: 'profile.userProfile' })}</span>
          </h2>
          {!isEditing ? (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="g-flex g-items-center g-space-x-2"
            >
              <MdEdit className="g-w-4 g-h-4" />
              <span>{formatMessage({ id: 'profile.startEditing' })}</span>
            </Button>
          ) : (
            <div className="g-flex g-space-x-3">
              <Button variant="outline" onClick={handleCancel} disabled={isProfileLoading}>
                {formatMessage({ id: 'profile.cancel' })}
              </Button>
              <FormButton
                onClick={handleSave}
                className="g-flex g-items-center g-space-x-2"
                isLoading={isProfileLoading}
                disabled={isProfileLoading}
              >
                <Save className="g-w-4 g-h-4" />
                <span>{formatMessage({ id: 'profile.save' })}</span>
              </FormButton>
            </div>
          )}
        </div>

        <ErrorMessage errorMessageId={getErrorMessage(profileError)} className="g-mb-4" />

        <form
          className="g-space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
            <FormInput
              id="firstName"
              label={formatMessage({ id: 'profile.firstName' })}
              type="text"
              value={isEditing ? editedInfo.firstName : userInfo.firstName}
              onChange={(value) => handleInputChange('firstName', value)}
              onBlur={() => handleProfileBlur('firstName')}
              placeholder={formatMessage({ id: 'profile.firstName' })}
              icon={User}
              disabled={!isEditing}
              error={profileErrors.firstName}
              touched={profileTouched.firstName}
            />
            <FormInput
              id="lastName"
              label={formatMessage({ id: 'profile.lastName' })}
              type="text"
              value={isEditing ? editedInfo.lastName : userInfo.lastName}
              onChange={(value) => handleInputChange('lastName', value)}
              onBlur={() => handleProfileBlur('lastName')}
              placeholder={formatMessage({ id: 'profile.lastName' })}
              icon={User}
              disabled={!isEditing}
              error={profileErrors.lastName}
              touched={profileTouched.lastName}
            />
          </div>

          <FormInput
            id="email"
            label={formatMessage({ id: 'profile.email' })}
            type="email"
            value={isEditing ? editedInfo.email : userInfo.email}
            onChange={(value) => handleInputChange('email', value)}
            onBlur={() => handleProfileBlur('email')}
            placeholder={formatMessage({ id: 'profile.enterEmail' })}
            icon={MdMail}
            disabled={!isEditing}
            error={profileErrors.email}
            touched={profileTouched.email}
          />

          <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
            {isEditing ? (
              <FormSelect
                id="country"
                label={formatMessage({ id: 'profile.country' })}
                value={editedInfo.country}
                onChange={(value) => handleInputChange('country', value)}
                onBlur={() => handleProfileBlur('country')}
                options={countryOptions}
                placeholder={formatMessage({ id: 'profile.selectCountry' })}
                icon={MdLocationOn}
                error={profileErrors.country}
                touched={profileTouched.country}
              />
            ) : (
              <FormInput
                id="country"
                label={formatMessage({ id: 'profile.country' })}
                type="text"
                value={formatMessage({ id: `enums.countryCode.${userInfo.country}` })}
                onChange={() => {}}
                onBlur={() => {}}
                placeholder={formatMessage({ id: 'profile.country' })}
                icon={MdLocationOn}
                disabled={true}
              />
            )}

            {isEditing ? (
              <FormSelect
                id="locale"
                label={formatMessage({ id: 'profile.language' })}
                value={editedInfo.locale}
                onChange={(value) => handleInputChange('locale', value)}
                onBlur={() => handleProfileBlur('locale')}
                options={languageOptions}
                placeholder={formatMessage({ id: 'profile.language' })}
                icon={MdLanguage}
                error={profileErrors.locale}
                touched={profileTouched.locale}
              />
            ) : (
              <FormInput
                id="locale"
                label={formatMessage({ id: 'profile.language' })}
                type="text"
                value={
                  languageOptions.find((lang) => lang.value === userInfo.locale)?.label ||
                  formatMessage({ id: `enums.language.${userInfo.locale}` })
                }
                onChange={() => {}}
                onBlur={() => {}}
                placeholder={formatMessage({ id: 'profile.language' })}
                icon={MdLanguage}
                disabled={true}
              />
            )}
          </div>
        </form>

        {/* Connected Accounts Section */}
        <div className="g-mt-8 g-pt-6 g-border-gray-200">
          <div className="g-mb-6">
            <h3 className="g-text-lg g-font-bold g-text-gray-900 g-flex g-items-center g-space-x-2 g-mb-4">
              {/* <Link className="g-w-5 g-h-5 g-text-primary-600" /> */}
              <span>{formatMessage({ id: 'profile.connectedAccounts' })}</span>
            </h3>
            <p className="g-text-sm g-text-gray-600">
              {formatMessage({ id: 'profile.connectedAccountsDescription' })}
            </p>

            {/* Flash error message for connection failures */}
            {flashError && flashError.provider && flashError.error && (
              <div className="g-p-4 g-mt-4 g-text-red-800 g-border g-border-red-300 g-rounded-lg g-bg-red-50">
                <div className="g-text-sm">
                  <div className="g-font-medium g-mb-1">
                    {formatMessage({ id: `profile.connect.failed.${flashError.provider}` })}
                  </div>
                  <div>{formatMessage({ id: `profile.error.${flashError.error}` })}</div>
                </div>
              </div>
            )}
          </div>

          <div className="g-space-y-4">
            <GoogleAccountItem
              isConnected={!!user?.connectedAcounts?.google}
              onConnect={() => handleConnectAccount('google')}
              onDisconnect={() => handleDisconnectAccount('google')}
              isEditing={isEditing}
            />

            <GitHubAccountItem
              isConnected={!!user?.connectedAcounts?.github}
              githubUserName={user?.githubUserName}
              onConnect={() => handleConnectAccount('github')}
              onDisconnect={() => handleDisconnectAccount('github')}
              isEditing={isEditing}
            />

            <OrcidAccountItem
              isConnected={!!user?.connectedAcounts?.orcid}
              orcidId={user?.orcid}
              onConnect={() => handleConnectAccount('orcid')}
              onDisconnect={() => handleDisconnectAccount('orcid')}
              isEditing={isEditing}
            />
          </div>
        </div>
      </Card>
      {/* Password Change Section */}
      <Card className="g-mt-4 g-p-6">
        <div className="g-mb-6">
          <h3 className="g-text-lg g-font-bold g-text-gray-900 g-flex g-items-center g-space-x-2 g-mb-4">
            {/* <Lock className="g-w-5 g-h-5 g-text-primary-600" /> */}
            <span>{formatMessage({ id: 'profile.changePassword' })}</span>
          </h3>
          <p className="g-text-sm g-text-gray-600">
            {formatMessage({ id: 'profile.changePasswordDescription' })}
          </p>
        </div>

        <ErrorMessage errorMessageId={getErrorMessage(passwordError)} className="g-mb-4" />

        {passwordUpdateSuccess && (
          <div className="g-flex g-items-center g-p-4 g-mb-4 g-text-green-800 g-border g-border-green-300 g-rounded-lg g-bg-green-50">
            <CheckCircle className="g-w-5 g-h-5 g-mr-3 g-flex-shrink-0" />
            <span className="g-text-sm g-font-medium">
              {formatMessage({ id: 'profile.passwordUpdated' })}
            </span>
          </div>
        )}

        <form
          className="g-space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSave();
          }}
        >
          <FormInput
            id="currentPassword"
            label={formatMessage({ id: 'profile.currentPassword' })}
            type="password"
            value={passwordInfo.currentPassword}
            onChange={(value) => handlePasswordChange('currentPassword', value)}
            onBlur={() => handlePasswordBlur('currentPassword')}
            placeholder={formatMessage({ id: 'profile.enterPassword' })}
            icon={Lock}
            error={passwordErrors.currentPassword}
            touched={passwordTouched.currentPassword}
          />

          <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
            <FormInput
              id="newPassword"
              label={formatMessage({ id: 'profile.newPassword' })}
              type="password"
              value={passwordInfo.newPassword}
              onChange={(value) => handlePasswordChange('newPassword', value)}
              onBlur={() => handlePasswordBlur('newPassword')}
              placeholder={formatMessage({ id: 'profile.createPassword' })}
              icon={Lock}
              error={passwordErrors.newPassword}
              touched={passwordTouched.newPassword}
            />
            <FormInput
              id="confirmPassword"
              label={formatMessage({ id: 'profile.repeatNewPassword' })}
              type="password"
              value={passwordInfo.confirmPassword}
              onChange={(value) => handlePasswordChange('confirmPassword', value)}
              onBlur={() => handlePasswordBlur('confirmPassword')}
              placeholder={formatMessage({ id: 'profile.repeatNewPassword' })}
              icon={Lock}
              error={passwordErrors.confirmPassword}
              touched={passwordTouched.confirmPassword}
            />
          </div>

          <div className="g-flex g-justify-end g-pt-4">
            <FormButton
              type="submit"
              className="g-flex g-items-center g-space-x-2"
              isLoading={isPasswordLoading}
              disabled={isPasswordLoading || hasFormErrors(passwordErrors)}
            >
              <Save className="g-w-4 g-h-4" />
              <span>{formatMessage({ id: 'profile.changePassword' })}</span>
            </FormButton>
          </div>
        </form>
      </Card>
    </>
  );
};

export default Profile;
