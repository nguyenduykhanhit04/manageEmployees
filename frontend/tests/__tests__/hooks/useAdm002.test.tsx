import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdm002 } from '@/hooks/useAdm002';
import * as employeeApi from '@/lib/api/employee';
import * as departmentApi from '@/lib/api/department';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

jest.mock('@/lib/api/employee');
jest.mock('@/lib/api/department');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('useAdm002 Hook', () => {
  const mockPush = jest.fn();
  const mockGetEmployees = employeeApi.getEmployees as jest.Mock;
  const mockGetDepartments = departmentApi.getDepartments as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (usePathname as jest.Mock).mockReturnValue('/employees/adm002');
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());

    mockGetDepartments.mockResolvedValue({
      code: 200,
      departments: [{ departmentId: 1, departmentName: 'Dev 1' }],
    });

    mockGetEmployees.mockResolvedValue({
      code: 200,
      totalRecords: 1,
      employees: [
        {
          employeeId: 1,
          employeeName: 'Nguyen Van A',
          employeeBirthDate: '1990-01-01',
          departmentName: 'Dev 1',
          employeeEmail: 'a@luvina.net',
          employeeTelephone: '0123456789',
          certificationName: 'N1',
          endDate: '2025-01-01',
          score: 180,
        },
      ],
    });
  });

  it('should fetch departments and employees on mount', async () => {
    const { result } = renderHook(() => useAdm002());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.departments.length).toBe(1);
    expect(result.current.employees.length).toBe(1);
    expect(result.current.totalPages).toBe(1);
  });

  it('should update sort priority and toggle order when handleSort is called', async () => {
    const { result } = renderHook(() => useAdm002());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleSort('ord_employee_name');
    });

    expect(result.current.sortOrders.ord_employee_name).toBe('DESC');
    expect(result.current.sortPriority[0]).toBe('ord_employee_name');
  });

  it('should navigate to add employee with returnTo when handleAddNew is called', async () => {
    const { result } = renderHook(() => useAdm002());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.handleAddNew();
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('/employees/edit?returnTo=')
    );
  });
});
