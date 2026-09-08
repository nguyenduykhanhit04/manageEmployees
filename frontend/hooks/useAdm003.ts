'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EmployeeDetailResponse } from '@/types/employee';
import { getEmployee } from '@/lib/api/employee';
import { ROUTES } from '@/lib/constants';
import { formatErrorMessage, ERROR_MESSAGES } from '@/lib/constants/messages';

/**
 * Custom Hook quản lý dữ liệu và các hành động của màn hình Chi tiết nhân viên (ADM003).
 *
 * @author nguyenduykhanh2
 * @return Các state dữ liệu nhân viên, trạng thái tải và các hàm handler điều hướng
 */
export function useAdm003() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Đọc employeeId và returnTo từ URLSearchParams
  const employeeId = searchParams.get('id') || searchParams.get('employeeId');
  const returnTo = searchParams.get('returnTo') || ROUTES.EMPLOYEE_LIST;

  // 2. Khai báo các state quản lý
  const [employee, setEmployee] = useState<EmployeeDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSystemError, setIsSystemError] = useState<boolean>(false);

  // 3. Hàm gọi API lấy chi tiết nhân viên
  const fetchEmployeeDetail = useCallback(async (id: string) => {
    setIsLoading(true);
    setErrorMessage('');
    setIsSystemError(false);
    try {
      const data = await getEmployee(id);
      if (data && data.code === 200) {
        setEmployee(data);
      } else {
        setIsSystemError(true);
        setErrorMessage(ERROR_MESSAGES.ER015);
      }
    } catch (error: any) {
      setIsSystemError(true);
      setErrorMessage(ERROR_MESSAGES.ER015);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 4. Kích hoạt lấy dữ liệu khi component được mount hoặc khi employeeId thay đổi
  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetail(employeeId);
    } else {
      setIsSystemError(true);
      setErrorMessage(ERROR_MESSAGES.ER015);
      setIsLoading(false);
    }
  }, [employeeId, fetchEmployeeDetail]);

  // 5. Xử lý khi nhấn nút "Quay lại" (戻る) hoặc nút "OK" trên màn hình System Error
  const handleBack = useCallback(() => {
    router.push(returnTo);
  }, [returnTo, router]);

  // 6. Xử lý khi nhấn nút "Chỉnh sửa" (編集) -> Chuyển sang ADM004 (mode=edit)
  const handleEdit = useCallback(() => {
    if (!employeeId) return;
    const editUrl = `${ROUTES.EMPLOYEE_EDIT}?mode=edit&id=${employeeId}&returnTo=${encodeURIComponent(returnTo)}`;
    router.push(editUrl);
  }, [employeeId, returnTo, router]);

  // 7. Xử lý khi nhấn nút "Xóa" (削除) -> Chuyển sang ADM005 (mode=delete)
  const handleDelete = useCallback(() => {
    if (!employeeId) return;
    const deleteUrl = `${ROUTES.EMPLOYEE_CONFIRM}?mode=delete&id=${employeeId}&returnTo=${encodeURIComponent(returnTo)}`;
    router.push(deleteUrl);
  }, [employeeId, returnTo, router]);

  return {
    employee,
    loading: isLoading,
    errorMessage,
    isSystemError,
    returnTo,
    handleBack,
    handleEdit,
    handleDelete,
    refetch: () => employeeId && fetchEmployeeDetail(employeeId),
  };
}
