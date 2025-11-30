import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const loginRequest = async (payload: LoginPayload) => {
  const { data } = await apiClient.post<AuthTokens>('/auth/login', payload);
  return data;
};

export const registerRequest = async (payload: RegisterPayload) => {
  const { data } = await apiClient.post<AuthTokens>('/auth/register', payload);
  return data;
};

export const meRequest = async () => {
  const { data } = await apiClient.get('/auth/me');
  return data;
};
