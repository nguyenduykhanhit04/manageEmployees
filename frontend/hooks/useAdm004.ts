'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addEmployeeSchema,
  editEmployeeSchema,
  EmployeeFormData,
  AddEmployeeFormData,
} from '@/lib/validation/employee';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { getEmployee, checkEmployeeExist } from '@/lib/api/employee.api';
import { ROUTES } from '@/lib/constants/routes';
import { HTTP_STATUS } from '@/lib/constants/http';
import { ERROR_MESSAGES } from '@/lib/constants/messages';
import { getStoredReturnUrl, STORAGE_KEYS } from '@/lib/constants/storage';
import { mapEmployeeDetailToFormData } from '@/lib/utils/employeeMapper';

/**
 * Lấy chuỗi ngày hiện tại theo định dạng yyyy/MM/dd (dùng cho placeholder).
 */
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const getDefaultFormValues = (): AddEmployeeFormData => ({
  employeeLoginId: '',
  departmentId: '',
  employeeName: '',
  employeeNameKana: '',
  employeeBirthDate: '',
  employeeEmail: '',
  employeeTelephone: '',
  employeeLoginPassword: '',
  employeeLoginPasswordConfirm: '',
  certificationId: '',
  certificationStartDate: '',
  certificationEndDate: '',
  employeeCertificationScore: '',
});

/**
 * Custom Hook quản lý toàn bộ nghiệp vụ cho màn hình Thêm mới/Chỉnh sửa nhân viên (ADM004).
 *
 * @author nguyenduykhanh2
 */
export function useAdm004() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Lấy mode và employeeId từ URL
  const mode = searchParams.get('mode') || 'add';
  const employeeId = searchParams.get('id');

  // Có employeeId hoặc mode=edit -> là mode Chỉnh sửa
  const isEditMode = mode === 'edit' || Boolean(employeeId);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSystemError, setIsSystemError] = useState<boolean>(false);
  const [isLoadingEmployee, setIsLoadingEmployee] = useState<boolean>(false);

  // 2. Master Data phòng ban và chứng chỉ tiếng Nhật
  const { departments, isLoading: isLoadingDept } = useDepartments();
  const { certifications, isLoading: isLoadingCert } = useCertifications();

  // 3. Khởi tạo form với Schema tương ứng theo mode
  const currentSchema = isEditMode ? editEmployeeSchema : addEmployeeSchema;
  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(currentSchema) as any,
    defaultValues: getDefaultFormValues(),
    mode: 'all',
  });

  const { reset, handleSubmit, watch, setValue, clearErrors } = form;

  // Theo dõi trạng thái chọn chứng chỉ tiếng Nhật
  const selectedCertId = watch('certificationId');
  const isCertificationSelected = Boolean(
    selectedCertId && selectedCertId !== '' && selectedCertId !== '0'
  );

  // Tự động clear dữ liệu & lỗi của 3 trường chứng chỉ khi chọn "Không có chứng chỉ"
  useEffect(() => {
    if (!isCertificationSelected) {
      setValue('certificationStartDate', '');
      setValue('certificationEndDate', '');
      setValue('employeeCertificationScore', '');
      clearErrors([
        'certificationStartDate',
        'certificationEndDate',
        'employeeCertificationScore',
      ]);
    }
  }, [isCertificationSelected, setValue, clearErrors]);

  // 4. Khởi tạo dữ liệu form ban đầu
  useEffect(() => {
    // 4.1 Kiểm tra thông báo lỗi trả về từ ADM005 (nếu có)
    const storedError = sessionStorage.getItem(STORAGE_KEYS.ADM004_ERROR_MESSAGE);
    if (storedError) {
      setErrorMessage(storedError);
      sessionStorage.removeItem(STORAGE_KEYS.ADM004_ERROR_MESSAGE);
    }

    // 4.2 Xử lý khi quay lại từ màn hình Xác nhận ADM005 (mode=back)
    if (mode === 'back') {
      const storedDataStr = sessionStorage.getItem(STORAGE_KEYS.ADM004_TEMP_DATA);
      if (storedDataStr) {
        try {
          const storedData = JSON.parse(storedDataStr);
          reset({
            employeeLoginId: storedData.employeeLoginId || '',
            departmentId: String(storedData.departmentId || ''),
            employeeName: storedData.employeeName || '',
            employeeNameKana: storedData.employeeNameKana || '',
            employeeBirthDate: storedData.employeeBirthDate || '',
            employeeEmail: storedData.employeeEmail || '',
            employeeTelephone: storedData.employeeTelephone || '',
            employeeLoginPassword: storedData.employeeLoginPassword || '',
            employeeLoginPasswordConfirm: storedData.employeeLoginPasswordConfirm || '',
            certificationId: String(storedData.certificationId || ''),
            certificationStartDate: storedData.certificationStartDate || '',
            certificationEndDate: storedData.certificationEndDate || '',
            employeeCertificationScore: storedData.employeeCertificationScore || '',
          });
          return;
        } catch {
          // Bỏ qua nếu dữ liệu sessionStorage không hợp lệ
        }
      }
    }

    // 4.3 Xử lý khi là Mode Chỉnh sửa (mode=edit và có employeeId)
    if (isEditMode && employeeId) {
      setIsLoadingEmployee(true);
      setIsSystemError(false);
      getEmployee(employeeId)
        .then((emp) => {
          // 4.3.1 Map dữ liệu API response sang EmployeeFormData và reset form
          if (emp && emp.code === HTTP_STATUS.OK) {
            reset(mapEmployeeDetailToFormData(emp));
          } else {
            setIsSystemError(true);
            setErrorMessage(ERROR_MESSAGES.ER015);
          }
        })
        .catch(() => {
          setIsSystemError(true);
          setErrorMessage(ERROR_MESSAGES.ER015);
        })
        .finally(() => {
          setIsLoadingEmployee(false);
        });
      return;
    }

    // 4.4 Xử lý Mode Thêm mới (mode=add)
    if (mode === 'add') {
      sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
      reset(getDefaultFormValues());
    }
  }, [mode, employeeId, isEditMode, reset]);

  // 5. Xử lý khi Submit Form hợp lệ -> Điều hướng sang ADM005
  const onSubmit = handleSubmit(async (data) => {
    setErrorMessage('');
    setIsSystemError(false);
    const effectiveMode = isEditMode ? 'edit' : 'add';

    // 5.1 Nếu là Mode Edit: Kiểm tra nhân viên còn tồn tại trong DB không
    if (isEditMode && employeeId) {
      try {
        const empCheck = await checkEmployeeExist(employeeId);
        if (!empCheck || empCheck.code !== HTTP_STATUS.OK) {
          setIsSystemError(true);
          setErrorMessage(ERROR_MESSAGES.ER015);
          return;
        }
      } catch (err) {
        setIsSystemError(true);
        setErrorMessage(ERROR_MESSAGES.ER015);
        return;
      }
    }

    // 5.2 Lưu dữ liệu tạm vào sessionStorage
    sessionStorage.setItem(
      STORAGE_KEYS.ADM004_TEMP_DATA,
      JSON.stringify({ ...data, mode: effectiveMode, employeeId })
    );

    // 5.3 Chuyển hướng sang màn hình Xác nhận (ADM005)
    const confirmUrl = `${ROUTES.EMPLOYEE_CONFIRM}?mode=${effectiveMode}${
      employeeId ? `&id=${employeeId}` : ''
    }`;
    router.push(confirmUrl);
  });

  // 6.1 Xử lý khi nhấn nút "OK" trên màn hình System Error
  const handleSystemErrorOk = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
    router.push(getStoredReturnUrl());
  }, [router]);

  // 6.2 Xử lý khi nhấn nút "Quay lại" (戻る) trên Form
  const handleBack = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
    // Nếu là mode edit: Quay lại màn hình chi tiết nhân viên ADM003
    if (isEditMode && employeeId) {
      router.push(`${ROUTES.EMPLOYEE_DETAIL}?id=${employeeId}`);
      return;
    }
    // Nếu là mode add: Quay lại màn hình danh sách ADM002
    router.push(getStoredReturnUrl());
  }, [isEditMode, employeeId, router]);

  // 6.3 Xử lý ngăn chặn submit form khi nhấn phím Enter ở input thường
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'BUTTON') {
      e.preventDefault();
    }
  }, []);

  // 7. Quản lý Focus
  const formRef = useRef<HTMLFormElement>(null);
  const isLoading = isLoadingDept || isLoadingCert || isLoadingEmployee;

  useEffect(() => {
    if (!isLoading && !isSystemError && formRef.current) {
      const focusableSelector =
        'input:not([disabled]):not([tabindex="-1"]):not([type="hidden"]), select:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"])';
      const firstInput = formRef.current.querySelector<HTMLElement>(focusableSelector);
      if (firstInput) {
        firstInput.focus();
      }
    }
  }, [isLoading, isSystemError]);

  return {
    form,
    formRef,
    isEditMode,
    employeeId,
    mode,
    departments,
    certifications,
    isCertificationSelected,
    isLoading,
    isSystemError,
    errorMessage,
    setErrorMessage,
    handleConfirm: onSubmit,
    handleBack,
    handleSystemErrorOk,
    handleKeyDown,
  };
}
