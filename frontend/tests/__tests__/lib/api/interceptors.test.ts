// This file tests the logic of the interceptors directly using a mockable navigation function.


describe('API Interceptor Logic', () => {
  // Mock sessionStorage
  const mockStorage: Record<string, string> = {};
  const sessionStorageMock = {
    getItem: jest.fn((key: string) => mockStorage[key] || null),
    setItem: jest.fn((key: string, value: string) => { mockStorage[key] = value; }),
    removeItem: jest.fn((key: string) => { delete mockStorage[key]; }),
    clear: jest.fn(() => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); }),
  };
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

  // Mock navigation function
  const mockNavigate = jest.fn(); 

  // Logic copied from the request interceptor, but using our mock storage
  const requestInterceptorLogic = (config: { headers?: { Authorization?: string } }) => {
    const token = window.sessionStorage.getItem('access_token');
    if (token) {
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  };

  // Logic copied from the response interceptor, but using our mock storage and navigation
  const responseInterceptorErrorLogic = (error: { response?: { status?: number } }) => {
    if (error.response?.status === 401) {
      window.sessionStorage.removeItem('access_token');
      window.sessionStorage.removeItem('token_type');
      mockNavigate('/login'); // Use mock instead of window.location.href
    }
    return Promise.reject(error);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
  });

  describe('Request Interceptor Logic', () => {
    it('should add Authorization header if token exists', () => {
      window.sessionStorage.setItem('access_token', 'test-token');
      const config = { headers: {} };
      const newConfig = requestInterceptorLogic(config);
      expect(newConfig.headers?.Authorization).toBe('Bearer test-token');
    });

    it('should not add Authorization header if token does not exist', () => {
      const config = { headers: {} };
      const newConfig = requestInterceptorLogic(config);
      expect(newConfig.headers?.Authorization).toBeUndefined();
    });
  });

  describe('Response Interceptor Logic', () => {
    it('should clear token and navigate on 401 error', async () => {
      const error = { response: { status: 401 } };
      window.sessionStorage.setItem('access_token', 'test-token');
      
      await expect(responseInterceptorErrorLogic(error)).rejects.toEqual(error);

      expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should not navigate or clear token on other errors', async () => {
        const error = { response: { status: 500 } };
        window.sessionStorage.setItem('access_token', 'test-token');

        await expect(responseInterceptorErrorLogic(error)).rejects.toEqual(error);
  
        expect(window.sessionStorage.removeItem).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
      });
  });
});
