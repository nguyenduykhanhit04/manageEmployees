import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from '@/components/auth/LoginForm';
import { login } from '@/lib/api/auth.api';
import { storeToken } from '@/lib/auth/token';
import { useRouter } from 'next/navigation';
import { ERROR_MESSAGES, FIELD_LABELS, formatErrorMessage } from '@/lib/constants/messages';
import { ROUTES } from '@/lib/constants/routes';

// Mock dependencies
jest.mock('@/lib/api/auth.api');
jest.mock('@/lib/auth/token');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const mockedLogin = login as jest.MockedFunction<typeof login>;
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
      expect(screen.getByText(formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginId]))).toBeInTheDocument();
      expect(screen.getByText(formatErrorMessage('ER001', [FIELD_LABELS.employeeLoginPassword]))).toBeInTheDocument();
    });
  });

  it('calls the login API and redirects on successful login', async () => {
    const mockResponse = { accessToken: 'fake-token', tokenType: 'Bearer' };
    mockedLogin.mockResolvedValue(mockResponse);

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('アカウント名:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('パスワード:'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
      expect(mockedStoreToken).toHaveBeenCalledWith('fake-token', 'Bearer');
      expect(mockPush).toHaveBeenCalledWith(ROUTES.EMPLOYEE_LIST);
    });
  });

  it('shows an error message on failed login', async () => {
    mockedLogin.mockRejectedValue(new Error('Login failed'));

    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText('アカウント名:'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('パスワード:'), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.ER016)).toBeInTheDocument();
    });
  });
});
