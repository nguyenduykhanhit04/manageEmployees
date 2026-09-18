import { STORAGE_KEYS } from '@/lib/constants/storage';

export function storeToken(token: string, tokenType: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokenType);
  sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
  sessionStorage.setItem(STORAGE_KEYS.TOKEN_TYPE, tokenType);
}

export function getToken(): { accessToken: string; tokenType: string } | null {
  if (typeof window === 'undefined') return null;
  const accessToken =
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) ||
    sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const tokenType =
    localStorage.getItem(STORAGE_KEYS.TOKEN_TYPE) ||
    sessionStorage.getItem(STORAGE_KEYS.TOKEN_TYPE) ||
    'Bearer';

  if (accessToken && tokenType) {
    return { accessToken, tokenType };
  }
  return null;
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE);
  sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.TOKEN_TYPE);
}

export function isTokenExpired(token: string): boolean {
  try {
    if (!token) return true;
    const parts = token.split('.');
    if (parts.length < 2) return true;

    // Convert Base64URL to regular Base64
    let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const decoded = atob(base64);
    const payload = JSON.parse(decoded);
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}
