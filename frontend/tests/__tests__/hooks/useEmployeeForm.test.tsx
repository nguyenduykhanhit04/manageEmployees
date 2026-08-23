/**
 * Copyright(C) 2026 Luvina Software Company
 *
 * useEmployeeForm.test.tsx, 23/8/2026 nguyenduykhanh2
 */
import { renderHook, act } from '@testing-library/react';
import { useEmployeeForm, formatErrorMessage } from '@/hooks/useEmployeeForm';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock departments & certifications hooks
jest.mock('@/hooks/useDepartments', () => ({
  useDepartments: () => ({
    departments: [{ departmentId: 1, departmentName: 'Phòng DEV1' }],
    loading: false,
  }),
}));

jest.mock('@/hooks/useCertifications', () => ({
  useCertifications: () => ({
    certifications: [{ certificationId: 1, certificationName: 'N1' }],
    loading: false,
  }),
}));

describe('useEmployeeForm Hook & Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('formats error message correctly', () => {
    const msg = formatErrorMessage('ER001', 'employeeName');
    expect(msg).toBe('氏名を入力してください。');
  });

  it('updates form fields and removes field error on change', () => {
    const { result } = renderHook(() => useEmployeeForm());

    act(() => {
      result.current.handleFieldChange('employeeName', 'Nguyễn Văn A');
    });

    expect(result.current.formData.employeeName).toBe('Nguyễn Văn A');
  });

  it('fails validation and sets errors when required fields are empty', () => {
    const { result } = renderHook(() => useEmployeeForm());

    act(() => {
      result.current.handleConfirm();
    });

    expect(mockPush).not.toHaveBeenCalled();
    expect(result.current.generalError).toBeTruthy();
  });

  it('passes validation and navigates to confirm screen when all inputs are valid', () => {
    const { result } = renderHook(() => useEmployeeForm());

    act(() => {
      result.current.handleFieldChange('employeeLoginId', 'duykhanh_01');
      result.current.handleFieldChange('departmentId', '1');
      result.current.handleFieldChange('employeeName', 'Nguyễn Duy Khánh');
      result.current.handleFieldChange('employeeNameKana', 'グエン ズイ カイン');
      result.current.handleFieldChange('employeeBirthDate', '2000/01/01');
      result.current.handleFieldChange('employeeEmail', 'khanh@luvina.net');
      result.current.handleFieldChange('employeeTelephone', '0987654321');
      result.current.handleFieldChange('employeeLoginPassword', 'Password123');
      result.current.handleFieldChange('passwordConfirmation', 'Password123');
    });

    act(() => {
      result.current.handleConfirm();
    });

    expect(mockPush).toHaveBeenCalledWith('/employees/confirm');
  });
});
