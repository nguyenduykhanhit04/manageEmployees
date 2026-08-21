export function storeToken(token: string, tokenType: string) {
  sessionStorage.setItem('access_token', token);
  sessionStorage.setItem('token_type', tokenType);
}

export function getToken(): { accessToken: string; tokenType: string } | null {
  if (typeof window === 'undefined') return null;
  const accessToken = sessionStorage.getItem('access_token');
  const tokenType = sessionStorage.getItem('token_type');

  if (accessToken && tokenType) {
    return { accessToken, tokenType };
  }
  return null;
}

export function removeToken() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('token_type');
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
