import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface User {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  settings: {
    country: string;
    locale: string;
    has_read_gdpr_terms: string;
  };
  connectedAcounts: {
    google: boolean;
    github: boolean;
    orcid: boolean;
  };
  photo: string;
  githubUserName: string;
  orcid: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  user: {
    username: string;
    email: string;
    country: string;
    password: string;
    settings: {
      locale: string;
    };
  };
  challengeId?: string;
  nonce?: string;
}

interface ForgottenPassword {
  password: string;
  challengeCode: string;
  userName: string;
}

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  language: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<void>;
  updateForgottenPassword: (data: ForgottenPassword) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  disconnectAccount: (provider: 'google' | 'github' | 'orcid') => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirm: (code: string, username: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export type UserErrorType =
  | 'UNKNOWN_ERROR'
  | 'UNKNOWN_USER'
  | 'LOGIN_FAILED'
  | 'REGISTRATION_FAILED'
  | 'UNABLE_TO_LOGOUT'
  | 'INVALID_REQUEST'
  | 'INVALID_SOLUTION'
  | 'INVALID_PASSWORD';
export class UserError extends Error {
  type: UserErrorType;
  constructor(type: UserErrorType, message?: string) {
    super(message ?? type);
    this.type = type;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const whoAmI = useCallback(async () => {
    try {
      const response = await fetch('/api/user/who-am-i', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('UNKNOWN_USER');
      }

      return await response.json();
    } catch (error) {
      throw new Error('UNKNOWN_ERROR');
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await whoAmI();
      if (response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [whoAmI]);

  const login = async (data: LoginData): Promise<User> => {
    try {
      const response = await fetch('/auth/basic/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new UserError('INVALID_REQUEST');
        } else {
          throw new UserError('UNKNOWN_ERROR');
        }
      }

      const result = await response.json();

      // Refresh user data after successful login
      await refreshUser();
      return result;
    } catch (error) {
      if (error instanceof UserError) {
        throw error; // Re-throw known UserError
      }
      // Handle unexpected errors
      throw new UserError('UNKNOWN_ERROR');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/user/create', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const error = await response.json();
          if (error.needNewChallenge) {
            throw new UserError('INVALID_SOLUTION', 'Registration failed. Please try again.');
          }
        }
        throw new UserError('REGISTRATION_FAILED', 'Registration failed. Please check your input.');
      }

      const result = await response.json();

      // Refresh user data after successful registration
      await refreshUser();

      return result;
    } catch (error) {
      if (error instanceof UserError) {
        throw error;
      }
      throw new UserError('REGISTRATION_FAILED');
    }
  };

  const updateForgottenPassword = async (data: ForgottenPassword) => {
    try {
      const { password, challengeCode, userName } = data;
      if (!password || !challengeCode || !userName) {
        throw new Error('Missing required fields for password update');
      }
      const response = await fetch('/api/user/update-forgotten-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
          challengeCode,
          userName,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new UserError('INVALID_REQUEST', 'Invalid request. Please check your input.');
        }
        throw new UserError('UNKNOWN_ERROR');
      }

      const result = await response.json();

      // Refresh user data after successful registration
      await refreshUser();

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password update failed');
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
      });

      // Clear user state regardless of response
      setUser(null);

      if (!response.ok) {
        throw new UserError('UNABLE_TO_LOGOUT', 'Unable to log out. Please try again later.');
      }
      await refreshUser();

      return;
    } catch (error) {
      // Still clear user state even if logout request fails
      await refreshUser();
      throw new UserError('UNKNOWN_ERROR');
    }
  };

  const resetPassword = async (userNameOrEmail: string) => {
    try {
      const response = await fetch('/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userNameOrEmail }),
      });

      if (!response.ok) {
        //TODO check for specific error codes like invalid token vs server error
        throw new UserError('UNKNOWN_ERROR');
      }

      return await response.json();
    } catch (error) {
      throw new UserError('UNKNOWN_ERROR');
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      if (!user) {
        throw new UserError('UNKNOWN_USER', 'User not authenticated');
      }

      // Create basic auth header with current password (following portal16 pattern)
      const authData = btoa(`${user.userName}:${encodeURIComponent(currentPassword)}`);

      const response = await fetch('/api/user/update-known-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authData}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new UserError('INVALID_PASSWORD', 'Current password is incorrect');
        } else {
          throw new UserError('UNKNOWN_ERROR', 'Password change failed');
        }
      }

      return;
    } catch (error) {
      if (error instanceof UserError) {
        throw error;
      }
      throw new UserError('UNKNOWN_ERROR');
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          throw new UserError('INVALID_REQUEST', 'Invalid profile data. Please check your input.');
        } else if (response.status === 401) {
          await refreshUser();
          throw new UserError('UNKNOWN_USER', 'User not authenticated.');
        } else {
          throw new UserError('UNKNOWN_ERROR', 'Profile update failed.');
        }
      }

      const result = await response.json();

      // Refresh user data after successful profile update
      await refreshUser();

      return result;
    } catch (error) {
      if (error instanceof UserError) {
        throw error;
      }
      throw new UserError('UNKNOWN_ERROR');
    }
  };

  const disconnectAccount = async (provider: 'google' | 'github' | 'orcid') => {
    try {
      const response = await fetch(`/auth/${provider}/disconnect/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new UserError('UNKNOWN_ERROR', `Failed to disconnect from ${provider}`);
      }

      // Refresh user data to update connection status
      await refreshUser();
    } catch (error) {
      if (error instanceof UserError) {
        throw error;
      }
      throw new UserError('UNKNOWN_ERROR', `Failed to disconnect from ${provider}`);
    }
  };

  const confirm = async (code: string, username: string) => {
    try {
      const response = await fetch('/api/user/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, username }),
      });

      if (!response.ok) {
        throw new UserError('UNKNOWN_ERROR', 'Confirmation failed. Please check your input.');
      }

      const result = await response.json();

      // Refresh user data after successful confirmation
      await refreshUser();

      return result;
    } catch (error) {
      throw new UserError('UNKNOWN_ERROR');
    }
  };

  useEffect(() => {
    refreshUser();
  }, [refreshUser]); // Add refreshUser to the dependency array

  const value: UserContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
    updateForgottenPassword,
    updateProfile,
    changePassword,
    disconnectAccount,
    logout,
    refreshUser,
    resetPassword,
    confirm,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
