import { storeToken, getToken, removeToken } from '@/lib/auth/token';

describe('Token Utilities', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  it('should store and retrieve the access token', () => {
    const token = 'test-token';
    const tokenType = 'Bearer';
    storeToken(token, tokenType);

    const stored = getToken();
    expect(stored).toEqual({
      accessToken: token,
      tokenType: tokenType,
    });
  });

  it('should return null if no token is stored', () => {
    const stored = getToken();
    expect(stored).toBeNull();
  });

  it('should remove the token from storage', () => {
    const token = 'test-token';
    const tokenType = 'Bearer';
    storeToken(token, tokenType);

    removeToken();

    const stored = getToken();
    expect(stored).toBeNull();
  });
});

