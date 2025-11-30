import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { meRequest, loginRequest, registerRequest, AuthTokens, LoginPayload, RegisterPayload } from '../api/auth';
import { apiClient, setAuthToken } from '../api/client';

export interface AuthUser {
  id: number;
  email: string;
  role: 'ADMIN' | 'PROFESOR' | 'ALUMNO';
  displayName: string;
}

interface AuthContextValue {
  user?: AuthUser;
  tokens?: AuthTokens;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_KEY = 'edu-marketplace-access';
const REFRESH_KEY = 'edu-marketplace-refresh';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>();
  const [tokens, setTokens] = useState<AuthTokens>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [storedAccess, storedRefresh] = await Promise.all([
          SecureStore.getItemAsync(ACCESS_KEY),
          SecureStore.getItemAsync(REFRESH_KEY),
        ]);

        if (storedAccess) {
          setAuthToken(storedAccess);
          setTokens({ accessToken: storedAccess, refreshToken: storedRefresh ?? '' });
          await refreshProfile();
        }
      } catch (err) {
        console.warn('Error loading auth tokens', err);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistTokens = async (nextTokens: AuthTokens) => {
    setTokens(nextTokens);
    setAuthToken(nextTokens.accessToken);
    await SecureStore.setItemAsync(ACCESS_KEY, nextTokens.accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, nextTokens.refreshToken);
  };

  const login = async (payload: LoginPayload) => {
    const authTokens = await loginRequest(payload);
    await persistTokens(authTokens);
    await refreshProfile();
  };

  const register = async (payload: RegisterPayload) => {
    const authTokens = await registerRequest(payload);
    await persistTokens(authTokens);
    await refreshProfile();
  };

  const logout = async () => {
    setTokens(undefined);
    setUser(undefined);
    setAuthToken(undefined);
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  };

  const refreshProfile = async () => {
    const profile = await meRequest();
    setUser(profile);
  };

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      },
    );
    return () => apiClient.interceptors.response.eject(interceptor);
  }, []);

  const value: AuthContextValue = {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
