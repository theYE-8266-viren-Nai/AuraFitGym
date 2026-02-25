import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authApi } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ⭐ OPTIMIZED: Only load from localStorage, don't call API on every mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []); // ⭐ Only run once on mount, not on token change!

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      
      setToken(response.token);
      setUser(response.user);
      
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};