export type AuthUser = {
  id: string;
  email: string;
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export async function signIn(email: string, password: string): Promise<{ user: AuthUser; token: string }>{
  // Simulate network call. Replace with real API.
  await new Promise((r) => setTimeout(r, 400));

  if (!email || !password) {
    throw new Error("Missing credentials");
  }

  const token = btoa(`${email}:${Date.now()}`);
  const user: AuthUser = { id: "u_" + Math.random().toString(36).slice(2), email };

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return { user, token };
}

export function signOut(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
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


