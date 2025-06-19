import { JazzIcon } from '@/components/JazzIcon/index';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/contexts/UserContext';
import country from '@/enums/basic/country.json';
import React, { useMemo, useState } from 'react';
import {
  LuCalendar as Calendar,
  LuCamera as Camera,
  LuCheckCircle as CheckCircle,
  LuDownload as Download,
  LuFileText as FileText,
  LuLock as Lock,
  LuSave as Save,
  LuSettings as Settings,
  LuUser as User,
  LuX as X,
} from 'react-icons/lu';
import { MdEdit, MdLanguage, MdLocationOn, MdMail } from 'react-icons/md';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormButton, FormInput, FormSelect } from '../shared/FormComponents';

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
  const languageOptions = useMemo(() => [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
    { value: 'zh', label: '中文' },
    { value: 'ar', label: 'العربية' },
    { value: 'ru', label: 'Русский' },
  ], []);

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

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSave = () => {
    // Basic validation
    if (!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordInfo.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }
    
    // TODO: Implement password change logic
    console.log('Password change:', passwordInfo);
    setPasswordInfo({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    alert('Password updated successfully!');
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
              <JazzIcon
                seed={user?.userName || 'user'}
                className="g-w-20 g-h-20 g-overflow-hidden g-rounded-full"
              />
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
                  <button
                    onClick={() => setIsEditing(true)}
                    className="g-bg-primary-600 g-text-white g-px-4 g-py-2 g-rounded-md g-hover:bg-primary-700 g-transition-colors g-font-medium g-text-sm g-flex g-items-center g-space-x-2"
                  >
                    <MdEdit className="g-w-4 g-h-4" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="g-flex g-space-x-3">
                    <button
                      onClick={handleCancel}
                      className="g-bg-gray-200 g-text-gray-700 g-px-4 g-py-2 g-rounded-md g-hover:bg-gray-300 g-transition-colors g-font-medium g-text-sm"
                    >
                      Cancel
                    </button>
                    <FormButton onClick={handleSave} className="g-flex g-items-center g-space-x-2">
                      <Save className="g-w-4 g-h-4" />
                      <span>Save Changes</span>
                    </FormButton>
                  </div>
                )}
              </div>

              <form className="g-space-y-4">
                <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
                  <FormInput
                    id="firstName"
                    label="First Name"
                    type="text"
                    value={isEditing ? editedInfo.firstName : userInfo.firstName}
                    onChange={(value) => handleInputChange('firstName', value)}
                    onBlur={() => {}}
                    placeholder="Enter first name"
                    icon={User}
                    disabled={!isEditing}
                  />
                  <FormInput
                    id="lastName"
                    label="Last Name"
                    type="text"
                    value={isEditing ? editedInfo.lastName : userInfo.lastName}
                    onChange={(value) => handleInputChange('lastName', value)}
                    onBlur={() => {}}
                    placeholder="Enter last name"
                    icon={User}
                    disabled={!isEditing}
                  />
                </div>

                <FormInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={isEditing ? editedInfo.email : userInfo.email}
                  onChange={(value) => handleInputChange('email', value)}
                  onBlur={() => {}}
                  placeholder="Enter email address"
                  icon={MdMail}
                  disabled={!isEditing}
                />

                <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
                  {isEditing ? (
                    <FormSelect
                      id="country"
                      label="Country"
                      value={editedInfo.country}
                      onChange={(value) => handleInputChange('country', value)}
                      onBlur={() => {}}
                      options={countryOptions}
                      placeholder="Select country"
                      icon={MdLocationOn}
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
                      onBlur={() => {}}
                      options={languageOptions}
                      placeholder="Select language"
                      icon={MdLanguage}
                    />
                  ) : (
                    <FormInput
                      id="language"
                      label="Language"
                      type="text"
                      value={languageOptions.find(lang => lang.value === userInfo.language)?.label || userInfo.language}
                      onChange={() => {}}
                      onBlur={() => {}}
                      placeholder="Language"
                      icon={MdLanguage}
                      disabled={true}
                    />
                  )}
                </div>
              </form>

              {/* Password Change Section */}
              <div className="g-mt-8 g-pt-6 g-border-t g-border-gray-200">
                <div className="g-mb-6">
                  <h3 className="g-text-lg g-font-bold g-text-gray-900 g-flex g-items-center g-space-x-2 g-mb-4">
                    <Lock className="g-w-5 g-h-5 g-text-primary-600" />
                    <span>Change Password</span>
                  </h3>
                  <p className="g-text-sm g-text-gray-600">
                    Update your password to keep your account secure. Make sure your new password is strong and unique.
                  </p>
                </div>

                <form className="g-space-y-4" onSubmit={(e) => { e.preventDefault(); handlePasswordSave(); }}>
                  <FormInput
                    id="currentPassword"
                    label="Current Password"
                    type="password"
                    value={passwordInfo.currentPassword}
                    onChange={(value) => handlePasswordChange('currentPassword', value)}
                    onBlur={() => {}}
                    placeholder="Enter your current password"
                    icon={Lock}
                  />
                  
                  <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 g-gap-4">
                    <FormInput
                      id="newPassword"
                      label="New Password"
                      type="password"
                      value={passwordInfo.newPassword}
                      onChange={(value) => handlePasswordChange('newPassword', value)}
                      onBlur={() => {}}
                      placeholder="Enter new password"
                      icon={Lock}
                    />
                    <FormInput
                      id="confirmPassword"
                      label="Confirm New Password"
                      type="password"
                      value={passwordInfo.confirmPassword}
                      onChange={(value) => handlePasswordChange('confirmPassword', value)}
                      onBlur={() => {}}
                      placeholder="Confirm new password"
                      icon={Lock}
                    />
                  </div>

                  <div className="g-flex g-justify-end g-pt-4">
                    <FormButton
                      type="submit"
                      className="g-flex g-items-center g-space-x-2"
                      disabled={!passwordInfo.currentPassword || !passwordInfo.newPassword || !passwordInfo.confirmPassword || passwordInfo.newPassword !== passwordInfo.confirmPassword}
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