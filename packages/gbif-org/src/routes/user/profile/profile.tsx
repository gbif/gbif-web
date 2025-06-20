import { UserError, useUser } from '@/contexts/UserContext';
import country from '@/enums/basic/country.json';
import React, { useMemo, useState } from 'react';
import {
  FaGithub as SocialIconGithub,
  FaGoogle as SocialIconGoogle,
  FaOrcid as SocialIconOrcid,
} from 'react-icons/fa';
import {
  LuCheckCircle as CheckCircle,
  LuLink as Link,
  LuLock as Lock,
  LuSave as Save,
  LuSettings as Settings,
  LuUnlink as Unlink,
  LuUser as User,
} from 'react-icons/lu';
import { MdEdit, MdLanguage, MdLocationOn, MdMail } from 'react-icons/md';

import { Button } from '@/components/ui/button';
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
  const { user, updateProfile } = useUser();
  const { formatMessage } = useIntl();
  const intlConfig = useI18n();
  intlConfig.availableLocales[0].code;

  // Language options (main UN languages)
  const languageOptions = useMemo(
    () => [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'Français' },
      { value: 'es', label: 'Español' },
      { value: 'zh', label: '中文' },
      { value: 'ar', label: 'العربية' },
      { value: 'ru', label: 'Русский' },
    ],
    []
  );

  // Country options
  const countryOptions = useMemo(() => {
    return country.map((code) => ({
      value: code,
      label: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
  }, [formatMessage]);

  const [isEditing, setIsEditing] = useState(false);

  // Use real user data or fallback
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    country: user?.settings?.country || '',
    locale: user?.settings?.locale || 'en',
  });

  const [editedInfo, setEditedInfo] = useState<UserInfo>(userInfo);

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
      // TODO: Implement actual API call to update password
      // await updateUserPassword(passwordInfo);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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

      // Show success message (you could use a toast notification here)
      console.log('Password updated successfully!');
    } catch (error) {
      setPasswordError('PASSWORD_UPDATE_FAILED');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordInfo({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handlePasswordChange = (field: keyof PasswordInfo, value: string) => {
    setPasswordInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleConnectAccount = (provider: 'google' | 'github' | 'orcid') => {
    // Redirect to OAuth connection endpoint
    window.location.href = `/auth/${provider}/connect`;
  };

  const handleDisconnectAccount = async (provider: 'google' | 'github' | 'orcid') => {
    try {
      const response = await fetch(`/api/user/disconnect/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Refresh user data to update connection status
        // In a real implementation, you'd update the user context
        console.log(`Disconnected from ${provider}`);
      }
    } catch (error) {
      console.error(`Failed to disconnect from ${provider}:`, error);
    }
  };

  if (!user) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="g-bg-white g-rounded-lg g-shadow-sm g-p-6">
      <div className="g-flex g-justify-between g-items-center g-mb-6">
        <h2 className="g-text-xl g-font-bold g-text-gray-900 g-flex g-items-center g-space-x-2">
          <Settings className="g-w-5 g-h-5 g-text-primary-600" />
          <span>Profile Settings</span>
        </h2>
        {!isEditing ? (
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="g-flex g-items-center g-space-x-2"
          >
            <MdEdit className="g-w-4 g-h-4" />
            <span>Edit Profile</span>
          </Button>
        ) : (
          <div className="g-flex g-space-x-3">
            <Button variant="outline" onClick={handleCancel} disabled={isProfileLoading}>
              Cancel
            </Button>
            <FormButton
              onClick={handleSave}
              className="g-flex g-items-center g-space-x-2"
              isLoading={isProfileLoading}
              disabled={isProfileLoading}
            >
              <Save className="g-w-4 g-h-4" />
              <span>Save Changes</span>
            </FormButton>
          </div>
        )}
      </div>

      <ErrorMessage errorMessageId={getErrorMessage(profileError)} />

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
            label="First Name"
            type="text"
            value={isEditing ? editedInfo.firstName : userInfo.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            onBlur={() => handleProfileBlur('firstName')}
            placeholder="Enter first name"
            icon={User}
            disabled={!isEditing}
            error={profileErrors.firstName}
            touched={profileTouched.firstName}
          />
          <FormInput
            id="lastName"
            label="Last Name"
            type="text"
            value={isEditing ? editedInfo.lastName : userInfo.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            onBlur={() => handleProfileBlur('lastName')}
            placeholder="Enter last name"
            icon={User}
            disabled={!isEditing}
            error={profileErrors.lastName}
            touched={profileTouched.lastName}
          />
        </div>

        <FormInput
          id="email"
          label="Email Address"
          type="email"
          value={isEditing ? editedInfo.email : userInfo.email}
          onChange={(value) => handleInputChange('email', value)}
          onBlur={() => handleProfileBlur('email')}
          placeholder="Enter email address"
          icon={MdMail}
          disabled={!isEditing}
          error={profileErrors.email}
          touched={profileTouched.email}
        />

        <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
          {isEditing ? (
            <FormSelect
              id="country"
              label="Country"
              value={editedInfo.country}
              onChange={(value) => handleInputChange('country', value)}
              onBlur={() => handleProfileBlur('country')}
              options={countryOptions}
              placeholder="Select country"
              icon={MdLocationOn}
              error={profileErrors.country}
              touched={profileTouched.country}
            />
          ) : (
            <FormInput
              id="country"
              label="Country"
              type="text"
              value={formatMessage({ id: `enums.countryCode.${userInfo.country}` })}
              onChange={() => {}}
              onBlur={() => {}}
              placeholder="Country"
              icon={MdLocationOn}
              disabled={true}
            />
          )}

          {isEditing ? (
            <FormSelect
              id="locale"
              label="Language"
              value={editedInfo.locale}
              onChange={(value) => handleInputChange('locale', value)}
              onBlur={() => handleProfileBlur('locale')}
              options={languageOptions}
              placeholder="Select language"
              icon={MdLanguage}
              error={profileErrors.locale}
              touched={profileTouched.locale}
            />
          ) : (
            <FormInput
              id="locale"
              label="Language"
              type="text"
              value={
                languageOptions.find((lang) => lang.value === userInfo.locale)?.label ||
                userInfo.locale
              }
              onChange={() => {}}
              onBlur={() => {}}
              placeholder="Language"
              icon={MdLanguage}
              disabled={true}
            />
          )}
        </div>
      </form>

      {/* Connected Accounts Section */}
      <div className="g-mt-8 g-pt-6 g-border-t g-border-gray-200">
        <div className="g-mb-6">
          <h3 className="g-text-lg g-font-bold g-text-gray-900 g-flex g-items-center g-space-x-2 g-mb-4">
            <Link className="g-w-5 g-h-5 g-text-primary-600" />
            <span>Connected Accounts</span>
          </h3>
          <p className="g-text-sm g-text-gray-600">
            Connect your social accounts to enable quick sign-in and enhanced features.
          </p>
        </div>

        <div className="g-space-y-4">
          {/* Google Connection */}
          <div className="g-flex g-items-center g-justify-between g-p-4 g-border g-border-gray-200 g-rounded-lg">
            <div className="g-flex g-items-center g-space-x-3">
              <div className="g-w-10 g-h-10 g-bg-red-50 g-rounded-lg g-flex g-items-center g-justify-center">
                <SocialIconGoogle className="g-w-5 g-h-5 g-text-red-600" />
              </div>
              <div>
                <h4 className="g-font-medium g-text-gray-900">Google</h4>
                <p className="g-text-sm g-text-gray-500">
                  {user?.connectedAcounts?.google
                    ? 'Connected to your Google account'
                    : 'Connect your Google account for easy sign-in'}
                </p>
              </div>
            </div>
            <div>
              {user?.connectedAcounts?.google ? (
                <div className="g-flex g-items-center g-space-x-2">
                  <span className="g-inline-flex g-items-center g-px-2 g-py-1 g-rounded-full g-text-xs g-font-medium g-bg-green-100 g-text-green-800">
                    <CheckCircle className="g-w-3 g-h-3 g-mr-1" />
                    Connected
                  </span>
                  {isEditing && (
                    <Button
                      variant="linkDestructive"
                      size="sm"
                      onClick={() => handleDisconnectAccount('google')}
                      className="g-flex g-items-center g-space-x-1"
                    >
                      <Unlink className="g-w-4 g-h-4" />
                      <span>Disconnect</span>
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  variant="default"
                  onClick={() => handleConnectAccount('google')}
                  className="g-flex g-items-center g-space-x-2"
                >
                  <Link className="g-w-4 g-h-4" />
                  <span>Connect</span>
                </Button>
              )}
            </div>
          </div>

          {/* GitHub Connection */}
          <div className="g-flex g-items-center g-justify-between g-p-4 g-border g-border-gray-200 g-rounded-lg">
            <div className="g-flex g-items-center g-space-x-3">
              <div className="g-w-10 g-h-10 g-bg-gray-50 g-rounded-lg g-flex g-items-center g-justify-center">
                <SocialIconGithub className="g-w-5 g-h-5 g-text-gray-700" />
              </div>
              <div>
                <h4 className="g-font-medium g-text-gray-900">GitHub</h4>
                <p className="g-text-sm g-text-gray-500">
                  {user?.connectedAcounts?.github
                    ? `Connected to ${user?.githubUserName || 'your GitHub account'}`
                    : 'Connect your GitHub account for easy sign-in'}
                </p>
              </div>
            </div>
            <div>
              {user?.connectedAcounts?.github ? (
                <div className="g-flex g-items-center g-space-x-2">
                  <span className="g-inline-flex g-items-center g-px-2 g-py-1 g-rounded-full g-text-xs g-font-medium g-bg-green-100 g-text-green-800">
                    <CheckCircle className="g-w-3 g-h-3 g-mr-1" />
                    Connected
                  </span>
                  {isEditing && (
                    <Button
                      variant="linkDestructive"
                      size="sm"
                      onClick={() => handleDisconnectAccount('github')}
                      className="g-flex g-items-center g-space-x-1"
                    >
                      <Unlink className="g-w-4 g-h-4" />
                      <span>Disconnect</span>
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => handleConnectAccount('github')}
                  className="g-bg-gray-800 g-text-white hover:g-bg-gray-900 g-flex g-items-center g-space-x-2"
                >
                  <Link className="g-w-4 g-h-4" />
                  <span>Connect</span>
                </Button>
              )}
            </div>
          </div>

          {/* ORCID Connection */}
          <div className="g-flex g-items-center g-justify-between g-p-4 g-border g-border-gray-200 g-rounded-lg">
            <div className="g-flex g-items-center g-space-x-3">
              <div className="g-w-10 g-h-10 g-bg-green-50 g-rounded-lg g-flex g-items-center g-justify-center">
                <SocialIconOrcid className="g-w-5 g-h-5 g-text-green-600" />
              </div>
              <div>
                <h4 className="g-font-medium g-text-gray-900">ORCID</h4>
                <p className="g-text-sm g-text-gray-500">
                  {user?.connectedAcounts?.orcid
                    ? `Connected to ORCID ${user?.orcid || ''}`
                    : 'Connect your ORCID for research identification'}
                </p>
              </div>
            </div>
            <div>
              {user?.connectedAcounts?.orcid ? (
                <div className="g-flex g-items-center g-space-x-2">
                  <span className="g-inline-flex g-items-center g-px-2 g-py-1 g-rounded-full g-text-xs g-font-medium g-bg-green-100 g-text-green-800">
                    <CheckCircle className="g-w-3 g-h-3 g-mr-1" />
                    Connected
                  </span>
                  {isEditing && (
                    <Button
                      variant="linkDestructive"
                      size="sm"
                      onClick={() => handleDisconnectAccount('orcid')}
                      className="g-flex g-items-center g-space-x-1"
                    >
                      <Unlink className="g-w-4 g-h-4" />
                      <span>Disconnect</span>
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => handleConnectAccount('orcid')}
                  className="g-bg-green-600 g-text-white hover:g-bg-green-700 g-flex g-items-center g-space-x-2"
                >
                  <Link className="g-w-4 g-h-4" />
                  <span>Connect</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="g-mt-8 g-pt-6 g-border-t g-border-gray-200">
        <div className="g-mb-6">
          <h3 className="g-text-lg g-font-bold g-text-gray-900 g-flex g-items-center g-space-x-2 g-mb-4">
            <Lock className="g-w-5 g-h-5 g-text-primary-600" />
            <span>Change Password</span>
          </h3>
          <p className="g-text-sm g-text-gray-600">
            Update your password to keep your account secure. Make sure your new password is strong
            and unique.
          </p>
        </div>

        <ErrorMessage errorMessageId={getErrorMessage(passwordError)} />

        <form
          className="g-space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSave();
          }}
        >
          <FormInput
            id="currentPassword"
            label="Current Password"
            type="password"
            value={passwordInfo.currentPassword}
            onChange={(value) => handlePasswordChange('currentPassword', value)}
            onBlur={() => handlePasswordBlur('currentPassword')}
            placeholder="Enter your current password"
            icon={Lock}
            error={passwordErrors.currentPassword}
            touched={passwordTouched.currentPassword}
          />

          <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
            <FormInput
              id="newPassword"
              label="New Password"
              type="password"
              value={passwordInfo.newPassword}
              onChange={(value) => handlePasswordChange('newPassword', value)}
              onBlur={() => handlePasswordBlur('newPassword')}
              placeholder="Enter new password"
              icon={Lock}
              error={passwordErrors.newPassword}
              touched={passwordTouched.newPassword}
            />
            <FormInput
              id="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={passwordInfo.confirmPassword}
              onChange={(value) => handlePasswordChange('confirmPassword', value)}
              onBlur={() => handlePasswordBlur('confirmPassword')}
              placeholder="Confirm new password"
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
              <span>Update Password</span>
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
