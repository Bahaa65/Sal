import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import apiClient from '../services/apiClient';

// Updated User interface to match the backend response
interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar?: string;
  job?: string;
  bio?: string;
}

// Type for registration data, based on API
type RegisterData = Omit<User, 'id' | 'avatar' | 'job' | 'bio'> & { password?: string };


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await apiClient.get('/profile');
      if (data && data.success) {
        setUser(data.data);
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Failed to fetch user', error);
      setUser(null);
      localStorage.removeItem('token');
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    const token = localStorage.getItem('token');
    if (token) {
      await fetchUser();
    }
    setIsLoading(false);
  }, [fetchUser]);
  
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  const logout = useCallback(async () => {
    try {
      await apiClient.delete('/logout');
    } catch (error) {
      console.error('Logout failed, clearing session anyway.', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  }, []);
  
  useEffect(() => {
    const handleAuthError = () => {
      logout();
    };
    window.addEventListener('auth-error', handleAuthError);
    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, [logout]);


  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/login', { username, password });
      if (data && data.success && data.token) {
        localStorage.setItem('token', data.token);
        await fetchUser();
      } else {
        throw new Error('Login failed: No token received');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post('/register', userData);
       if (data && data.success && data.token) {
        localStorage.setItem('token', data.token);
        // After registering, we need to fetch the newly created user's profile
        await fetchUser();
      } else {
        throw new Error('Registration failed: No token received');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}; 