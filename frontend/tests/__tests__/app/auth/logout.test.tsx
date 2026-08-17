import LogoutPage from '@/app/(auth)/logout/page';
import { useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth/token';
import { render } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/lib/auth/token');

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe('LogoutPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove token and redirect to login', () => {
    render(<LogoutPage />);
    expect(removeToken).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/login');
  });

  it('should display logging out message', () => {
    const { getByText } = render(<LogoutPage />);
    expect(getByText('Logging out...')).toBeInTheDocument();
  });
});

