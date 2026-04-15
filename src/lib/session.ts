export type SessionUser = {
  id: string;
  email: string;
  phone?: string | null;
  role?: string;
  name?: string;
  loyaltyPoints?: number;
};

const USER_KEY = "glh_user";

export function getSessionUser(): SessionUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function setSessionUser(user: SessionUser | null) {
  if (!user) localStorage.removeItem(USER_KEY);
  else localStorage.setItem(USER_KEY, JSON.stringify(user));
}

