import { JazzIcon } from '@/components/JazzIcon/index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import country from '@/enums/basic/country.json';
import React, { useMemo, useState } from 'react';
import {
  FaGithub as SocialIconGithub,
  FaGoogle as SocialIconGoogle,
  FaOrcid as SocialIconOrcid,
} from 'react-icons/fa';
import {
  LuCalendar as Calendar,
  LuCheckCircle as CheckCircle,
  LuDownload as Download,
  LuFileText as FileText,
  LuLink as Link,
  LuLock as Lock,
  LuSave as Save,
  LuSettings as Settings,
  LuUnlink as Unlink,
  LuUser as User,
  LuX as X,
} from 'react-icons/lu';
import { MdEdit, MdLanguage, MdLocationOn, MdMail } from 'react-icons/md';

import { Button } from '@/components/ui/button';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
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

interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  language: string;
}

interface PasswordInfo {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface DownloadItem {
  id: string;
  name: string;
  type: string;
  size: string;
  downloadDate: string;
  status: 'completed' | 'failed' | 'pending';
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
  const { formatMessage } = useIntl();

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

  // Determine active tab from route
  const getActiveTab = () => {
    if (location.pathname.includes('/downloads')) return 'downloads';
    return 'profile';
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'downloads'>(getActiveTab());
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Use real user data or fallback
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    country: user?.settings?.country || '',
    language: user?.settings?.locale || 'en',
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
    language: false,
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
    language: validateRequired(
      isEditing ? editedInfo.language : userInfo.language,
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

  const downloads: DownloadItem[] = [
    {
      id: '1',
      name: 'Species Occurrence Data.csv',
      type: 'CSV',
      size: '12.4 MB',
      downloadDate: '2024-01-15',
      status: 'completed',
    },
    {
      id: '2',
      name: 'Biodiversity Dataset.zip',
      type: 'ZIP',
      size: '45.7 MB',
      downloadDate: '2024-01-14',
      status: 'completed',
    },
    {
      id: '3',
      name: 'Research Data Export.xlsx',
      type: 'XLSX',
      size: '8.2 MB',
      downloadDate: '2024-01-13',
      status: 'failed',
    },
    {
      id: '4',
      name: 'Taxonomic Records.json',
      type: 'JSON',
      size: '3.1 MB',
      downloadDate: '2024-01-12',
      status: 'completed',
    },
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'profile' | 'downloads');
    if (value === 'downloads') {
      navigate('/user/profile/downloads');
    } else {
      navigate('/user/profile');
    }
  };

  const handleSave = async () => {
    // Validate all fields
    if (hasFormErrors(profileErrors)) {
      setProfileTouched({
        firstName: true,
        lastName: true,
        email: true,
        country: true,
        language: true,
      });
      return;
    }

    setIsProfileLoading(true);
    setProfileError('');

    try {
      // TODO: Implement actual API call to update user profile
      // await updateUserProfile(editedInfo);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setUserInfo(editedInfo);
      setIsEditing(false);
      setProfileTouched({
        firstName: false,
        lastName: false,
        email: false,
        country: false,
        language: false,
      });
    } catch (error) {
      setProfileError('UPDATE_FAILED');
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
      setIsEditingPassword(false);

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
    setIsEditingPassword(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'g-text-green-600 g-bg-green-50';
      case 'failed':
        return 'g-text-red-600 g-bg-red-50';
      case 'pending':
        return 'g-text-yellow-600 g-bg-yellow-50';
      default:
        return 'g-text-gray-600 g-bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="g-w-4 g-h-4" />;
      case 'failed':
        return <X className="g-w-4 g-h-4" />;
      case 'pending':
        return <Download className="g-w-4 g-h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="g-min-h-screen g-bg-gray-50">
      <div className="g-max-w-4xl g-mx-auto g-px-4 g-py-8">
        {/* Header */}
        <div className="g-bg-white g-rounded-lg g-shadow-sm g-p-6 g-mb-6">
          <div className="g-flex g-items-center g-space-x-4">
            <div className="g-relative">
              {user?.photo ? (
                <img
                  src={user.photo}
                  alt={`${userInfo.firstName} ${userInfo.lastName}`}
                  className="g-w-20 g-h-20 g-object-cover g-rounded-lg"
                />
              ) : (
                <JazzIcon
                  seed={user?.userName || 'user'}
                  className="g-w-20 g-h-20 g-overflow-hidden g-rounded-lg"
                />
              )}
            </div>
            <div className="g-flex-1">
              <h1 className="g-text-2xl g-font-bold g-text-gray-900 g-mb-1">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="g-text-sm g-text-gray-600 g-mb-2">{userInfo.email}</p>
              <p className="g-text-sm g-text-gray-700 g-leading-relaxed">{userInfo.bio}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="g-mb-6">
          <TabsList className="g-bg-transparent">
            <TabsTrigger value="profile" className="g-flex g-items-center g-space-x-2">
              <User className="g-w-4 g-h-4" />
              <span>Profile Information</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="g-flex g-items-center g-space-x-2">
              <Download className="g-w-4 g-h-4" />
              <span>My Downloads</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab Content */}
          <TabsContent value="profile">
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
                      id="language"
                      label="Language"
                      value={editedInfo.language}
                      onChange={(value) => handleInputChange('language', value)}
                      onBlur={() => handleProfileBlur('language')}
                      options={languageOptions}
                      placeholder="Select language"
                      icon={MdLanguage}
                      error={profileErrors.language}
                      touched={profileTouched.language}
                    />
                  ) : (
                    <FormInput
                      id="language"
                      label="Language"
                      type="text"
                      value={
                        languageOptions.find((lang) => lang.value === userInfo.language)?.label ||
                        userInfo.language
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
                    Update your password to keep your account secure. Make sure your new password is
                    strong and unique.
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
          </TabsContent>

          {/* Downloads Tab Content */}
          <TabsContent value="downloads">
            <div className="g-bg-white g-rounded-lg g-shadow-sm g-p-6">
              <div className="g-flex g-items-center g-space-x-2 g-mb-6">
                <Download className="g-w-5 g-h-5 g-text-primary-600" />
                <h2 className="g-text-xl g-font-bold g-text-gray-900">My Downloads</h2>
                <span className="g-bg-primary-100 g-text-primary-600 g-px-3 g-py-1 g-rounded-full g-text-sm g-font-medium">
                  {downloads.length} files
                </span>
              </div>

              <div className="g-space-y-3">
                {downloads.map((item) => (
                  <div
                    key={item.id}
                    className="g-border g-border-gray-200 g-rounded-lg g-p-4 g-hover:shadow-sm g-transition-shadow g-duration-200"
                  >
                    <div className="g-flex g-items-center g-justify-between">
                      <div className="g-flex g-items-center g-space-x-3">
                        <div className="g-w-10 g-h-10 g-bg-primary-50 g-rounded-lg g-flex g-items-center g-justify-center">
                          <FileText className="g-w-5 g-h-5 g-text-primary-600" />
                        </div>
                        <div>
                          <h3 className="g-font-medium g-text-gray-900 g-text-sm g-mb-1">
                            {item.name}
                          </h3>
                          <div className="g-flex g-items-center g-space-x-3 g-text-xs g-text-gray-500">
                            <span>{item.type}</span>
                            <span>•</span>
                            <span>{item.size}</span>
                            <span>•</span>
                            <div className="g-flex g-items-center g-space-x-1">
                              <Calendar className="g-w-3 g-h-3" />
                              <span>{item.downloadDate}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`g-flex g-items-center g-space-x-2 g-px-2 g-py-1 g-rounded-full g-text-xs g-font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="g-capitalize">{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {downloads.length === 0 && (
                <div className="g-text-center g-py-8">
                  <Download className="g-w-12 g-h-12 g-text-gray-300 g-mx-auto g-mb-3" />
                  <h3 className="g-text-lg g-font-medium g-text-gray-900 g-mb-2">
                    No downloads yet
                  </h3>
                  <p className="g-text-gray-500 g-text-sm">
                    Your downloaded files will appear here.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
