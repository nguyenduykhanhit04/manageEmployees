import { renderHook, waitFor, act } from '@testing-library/react';
import { useAdm003 } from '@/hooks/useAdm003';
import { getEmployee } from '@/lib/api/employee';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

// Mock dependencies
jest.mock('@/lib/api/employee');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

const mockedGetEmployee = getEmployee as jest.Mock;
const mockedUseSearchParams = useSearchParams as jest.Mock;

describe('useAdm003 Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger system error if no id is provided in searchParams', async () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'returnTo' ? '/employees/adm002' : null),
    });

    const { result } = renderHook(() => useAdm003());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isSystemError).toBe(true);
    expect(result.current.errorMessage).toBe('システムエラーが発生しました。');
    expect(result.current.employee).toBeNull();
  });

  it('should fetch and set employee details successfully when valid id is provided', async () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => {
        if (key === 'id') return '1';
        if (key === 'returnTo') return '/employees/adm002';
        return null;
      },
    });

    const mockEmployeeData = {
      code: 200,
      employeeId: 1,
      employeeName: 'Nguyễn Văn A',
      employeeNameKana: 'グエン ヴァン A',
      employeeBirthDate: '1990/01/01',
      departmentId: 1,
      departmentName: 'Phòng DEVN',
      employeeEmail: 'nguyenvana@luvina.net',
      employeeTelephone: '0123456789',
      employeeLoginId: 'nguyenvana',
      certifications: [
        {
          certificationId: 1,
          certificationName: 'N1',
          startDate: '2020/01/01',
          endDate: '2025/01/01',
          score: 180,
        },
      ],
    };

    mockedGetEmployee.mockResolvedValue(mockEmployeeData);

    const { result } = renderHook(() => useAdm003());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.employee).toEqual(mockEmployeeData);
    expect(result.current.isSystemError).toBe(false);
    expect(result.current.errorMessage).toBe('');
  });

  it('should trigger system error when employee not found (ER013) or API error', async () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => (key === 'id' ? '999' : null),
    });

    mockedGetEmployee.mockRejectedValue({
      response: {
        data: {
          code: 500,
          message: {
            code: 'ER013',
            params: ['ＩＤ'],
          },
        },
      },
    });

    const { result } = renderHook(() => useAdm003());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.isSystemError).toBe(true);
    expect(result.current.errorMessage).toBe('システムエラーが発生しました。');
    expect(result.current.employee).toBeNull();
  });

  it('should handle navigation buttons correctly', async () => {
    mockedUseSearchParams.mockReturnValue({
      get: (key: string) => {
        if (key === 'id') return '1';
        if (key === 'returnTo') return '/employees/adm002?employee_name=test';
        return null;
      },
    });

    mockedGetEmployee.mockResolvedValue({
      code: 200,
      employeeId: 1,
      employeeName: 'Nguyễn Văn A',
    });

    const { result } = renderHook(() => useAdm003());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Test handleBack
    act(() => {
      result.current.handleBack();
    });
    expect(mockPush).toHaveBeenCalledWith('/employees/adm002?employee_name=test');

    // Test handleEdit
    act(() => {
      result.current.handleEdit();
    });
    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.EMPLOYEE_EDIT}?mode=edit&id=1&returnTo=${encodeURIComponent('/employees/adm002?employee_name=test')}`
    );

    // Test handleDelete
    act(() => {
      result.current.handleDelete();
    });
    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.EMPLOYEE_CONFIRM}?mode=delete&id=1&returnTo=${encodeURIComponent('/employees/adm002?employee_name=test')}`
    );
  });
});
