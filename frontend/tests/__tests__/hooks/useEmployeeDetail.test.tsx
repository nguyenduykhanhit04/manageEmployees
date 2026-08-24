import { renderHook, waitFor, act } from '@testing-library/react';
import { useEmployeeDetail } from '@/hooks/useEmployeeDetail';
import * as employeeApi from '@/lib/api/employee';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/lib/api/employee');

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe('useEmployeeDetail Hook', () => {
  const mockSearchParams = new Map<string, string>();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue({
      get: (key: string) => mockSearchParams.get(key) || null,
    });
  });

  it('should fetch and set employee details successfully', async () => {
    mockSearchParams.set('id', '1');

    const mockData = {
      code: 200,
      employeeId: 1,
      employeeName: 'Nguyễn Văn A',
      employeeBirthDate: '1990/01/01',
      departmentId: 1,
      departmentName: 'DEV1',
      employeeEmail: 'a@luvina.net',
      employeeTelephone: '0123456789',
      employeeNameKana: 'グエン ヴァン A',
      employeeLoginId: 'nguyenvana',
      certifications: [
        {
          certificationId: 1,
          certificationName: 'N1',
          startDate: '2023/01/01',
          endDate: '2025/01/01',
          score: 180,
        },
      ],
    };

    (employeeApi.getEmployeeById as jest.Mock).mockResolvedValue(mockData);

    const { result } = renderHook(() => useEmployeeDetail());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.employee).toEqual(mockData);
    expect(result.current.errorMessage).toBe('');
  });

  it('should display error message when employeeId is not provided', async () => {
    mockSearchParams.delete('id');

    const { result } = renderHook(() => useEmployeeDetail());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.errorMessage).toBeTruthy();
    expect(result.current.employee).toBeNull();
  });

  it('should handle navigation back to ADM002', () => {
    mockSearchParams.set('id', '1');
    const { result } = renderHook(() => useEmployeeDetail());

    act(() => {
      result.current.handleBack();
    });

    expect(mockPush).toHaveBeenCalledWith('/employees/adm002');
  });

  it('should handle navigation to edit page', () => {
    mockSearchParams.set('id', '1');
    const { result } = renderHook(() => useEmployeeDetail());

    act(() => {
      result.current.handleEdit();
    });

    expect(mockPush).toHaveBeenCalledWith('/employees/edit?id=1');
  });
});
