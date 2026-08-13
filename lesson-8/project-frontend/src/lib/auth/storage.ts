export type AuthUser = { _id: string; username: string; email: string };

const storageKey = "contacts-api-user";

export function saveUser(user: AuthUser) {
  localStorage.setItem(storageKey, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  const value = localStorage.getItem(storageKey);
  if (!value) return null;

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    localStorage.removeItem(storageKey);
    return null;
  }
}

export function clearUser() {
  localStorage.removeItem(storageKey);
}
