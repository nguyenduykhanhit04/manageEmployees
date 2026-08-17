import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/auth/LoginForm';
import { apiClient } from '@/lib/api/client';
import { storeToken } from '@/lib/auth/token';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('@/lib/api/client');
jest.mock('@/lib/auth/token');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;
const mockedStoreToken = storeToken as jest.Mock;

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form correctly', () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText('アカウント名:')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('パスワード:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Username is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('calls the login API and redirects on successful login', async () => {
    const mockResponse = { data: { accessToken: 'fake-token', tokenType: 'Bearer' } };
    mockedApiClient.post.mockResolvedValue(mockResponse);

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('アカウント名:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('パスワード:'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    await waitFor(() => {
      expect(mockedApiClient.post).toHaveBeenCalledWith('/login', {
        username: 'testuser',
        password: 'password123',
      });
      expect(mockedStoreToken).toHaveBeenCalledWith('fake-token', 'Bearer');
      expect(mockPush).toHaveBeenCalledWith('/employees/list');
    });
  });

  it('shows an error message on failed login', async () => {
    // Suppress expected console.error from the error handling
    const originalError = console.error;
    console.error = jest.fn();

    mockedApiClient.post.mockRejectedValue(new Error('Login failed'));

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('アカウント名:'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('パスワード:'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    await waitFor(() => {
      expect(screen.getByText('ログインに失敗しました。アカウント名またはパスワードを確認してください。')).toBeInTheDocument();
    });

    console.error = originalError;
  });
});

