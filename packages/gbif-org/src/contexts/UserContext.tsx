import React, { createContext, useContext, useEffect, useState } from 'react';

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
  username: string;
  email: string;
  country: string;
  password: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirm: (code: string, username: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const whoAmI = async () => {
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
      throw new Error('UNKNOWN_USER');
    }
  };

  const refreshUser = async () => {
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
  };

  const login = async (data: LoginData) => {
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
          return {
            // TODO needs translations
            error: 'LOGIN_FAILED',
            message: 'Login failed. Please check your credentials.',
          };
        } else {
          return {
            error: 'UNKNOWN_ERROR',
            message: 'We are unable to log you in at this time. Please try again later.',
          };
        }
      }

      const result = await response.json();

      // Refresh user data after successful login
      await refreshUser();
      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const result = await response.json();

      // Refresh user data after successful registration
      await refreshUser();

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/user/logout', {
        method: 'POST',
      });

      // Clear user state regardless of response
      setUser(null);

      return { success: response.ok };
    } catch (error) {
      // Still clear user state even if logout request fails
      setUser(null);
      throw new Error('UNABLE_TO_LOGOUT');
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
        throw new Error('Password reset failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password reset failed');
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
        throw new Error('User confirmation failed');
      }

      const result = await response.json();

      // Refresh user data after successful confirmation
      await refreshUser();

      return result;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'User confirmation failed');
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const value: UserContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    register,
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
