import { renderHook } from '@testing-library/react';
import { useAuth, useGuest } from '@/hooks/useAuth';
import { getToken } from '@/lib/auth/token';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/lib/auth/token');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const mockedGetToken = getToken as jest.Mock;

describe('Authentication Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useAuth', () => {
    it('should redirect to /login if no token is found', () => {
      mockedGetToken.mockReturnValue(null);
      renderHook(() => useAuth());
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should not redirect if a token is found', () => {
      mockedGetToken.mockReturnValue({ accessToken: 'fake-token', tokenType: 'Bearer' });
      renderHook(() => useAuth());
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('useGuest', () => {
    it('should redirect to /employees/list if a token is found', () => {
      mockedGetToken.mockReturnValue({ accessToken: 'fake-token', tokenType: 'Bearer' });
      renderHook(() => useGuest());
      expect(mockPush).toHaveBeenCalledWith('/employees/list');
    });

    it('should not redirect if no token is found', () => {
      mockedGetToken.mockReturnValue(null);
      renderHook(() => useGuest());
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

