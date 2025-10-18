// NOTE: This file previously mocked authentication.
// It now uses the real backend API via apiClient.

import apiClient from './api';

export type AuthUser = {
  id: string;
  email: string;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export async function signIn(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  if (!email || !password) {
    throw new Error("Missing credentials");
  }

  try {
    const res = await apiClient.login(email, password);

    // Expecting backend shape: { success, data: { user, token } }
    const payload: any = res as any;
    if (!payload?.success || !payload?.data?.token || !payload?.data?.user) {
      throw new Error(payload?.message || 'Login failed');
    }

    const token: string = payload.data.token as string;
    const user: AuthUser = {
      id: String(payload.data.user.id),
      email: String(payload.data.user.email)
    };

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Also update apiClient token for subsequent requests
    try {
      (apiClient as any).setToken?.(token);
    } catch {}

    return { user, token };
  } catch (error: any) {
    // Ensure no partial state is stored on failure
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    throw new Error(error?.message || 'Unable to login');
  }
}

export function signOut(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  try {
    (apiClient as any).setToken?.(null);
  } catch {}
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as AuthUser; } catch { return null; }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}


