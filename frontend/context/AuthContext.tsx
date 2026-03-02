'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { API_CONFIG } from '@/lib/config';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem(API_CONFIG.TOKEN_KEY);
    if (token) {
      const storedEmail = localStorage.getItem('user_email');
      if (storedEmail) {
        setUser({ email: storedEmail });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const result = await apiClient.login(email, password);
      localStorage.setItem('user_email', email);
      setUser({ email });
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    try {
      const result = await apiClient.register(email, password);
      localStorage.setItem('user_email', email);
      setUser({ email });
      router.push('/dashboard');
    } catch (err: any) {
      const message = err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    localStorage.removeItem('user_email');
    setUser(null);
    setError(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: apiClient.isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
