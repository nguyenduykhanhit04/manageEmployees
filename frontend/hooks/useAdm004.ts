'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  addEmployeeSchema,
  editEmployeeSchema,
  AddEmployeeFormData,
} from '@/lib/validation/employee';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { ROUTES } from '@/lib/constants';

export const ADM004_STORAGE_KEY = 'ADM004_TEMP_DATA';

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
  employeeBirthDate: '', // Giá trị rỗng ban đầu để hiển thị placeholder ngày hiện tại
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
 * @return Các state, đối tượng form React Hook Form và các hàm handler phục vụ cho ADM004
 */
export function useAdm004() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Đọc mode, employeeId và returnTo từ URL
  const mode = (searchParams.get('mode') || 'add').toLowerCase(); // 'add' | 'edit' | 'back'
  const employeeId = searchParams.get('id');
  const returnTo = searchParams.get('returnTo') || ROUTES.EMPLOYEE_LIST;

  const [errorMessage, setErrorMessage] = useState<string>('');

  // 2. Lấy danh mục phòng ban và chứng chỉ tiếng Nhật dùng chung
  const { departments, isLoading: isLoadingDept } = useDepartments();
  const { certifications, isLoading: isLoadingCert } = useCertifications();

  // 3. Khởi tạo React Hook Form với Schema động theo mode (chạy validate realtime onChange)
  const currentSchema = mode === 'edit' ? editEmployeeSchema : addEmployeeSchema;
  const form = useForm<AddEmployeeFormData>({
    resolver: zodResolver(currentSchema) as any,
    defaultValues: getDefaultFormValues(),
    mode: 'onChange', // Validate tức thì khi người dùng gõ phím hoặc thay đổi giá trị
  });

  const { reset, handleSubmit } = form;

  // 4. Xử lý khởi tạo dữ liệu theo từng Mode
  useEffect(() => {
    if (mode === 'back') {
      // MODE BACK: Khôi phục dữ liệu từ sessionStorage
      const savedData = sessionStorage.getItem(ADM004_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          reset(parsed);
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    } else if (mode === 'edit' && employeeId) {
      // MODE EDIT: (Sẽ gọi API lấy chi tiết nhân viên khi triển khai luồng Edit)
    } else {
      // MODE ADD: Reset form rỗng
      reset(getDefaultFormValues());
    }
  }, [mode, employeeId, reset]);

  // 5. Xử lý khi nhấn nút "Xác nhận" (確認)
  const handleConfirm = handleSubmit((data) => {
    setErrorMessage('');
    // Lưu dữ liệu vào sessionStorage
    sessionStorage.setItem(
      ADM004_STORAGE_KEY,
      JSON.stringify({ ...data, mode, employeeId, returnTo })
    );
    // Chuyển hướng sang màn hình Xác nhận (ADM005)
    router.push(`${ROUTES.EMPLOYEE_CONFIRM}?returnTo=${encodeURIComponent(returnTo)}`);
  });

  // 6. Xử lý khi nhấn nút "Quay lại" (戻る)
  const handleBack = useCallback(() => {
    sessionStorage.removeItem(ADM004_STORAGE_KEY);
    router.push(returnTo);
  }, [returnTo, router]);

  return {
    form,
    mode,
    employeeId,
    returnTo,
    departments,
    certifications,
    isLoading: isLoadingDept || isLoadingCert,
    errorMessage,
    setErrorMessage,
    handleConfirm,
    handleBack,
  };
}
