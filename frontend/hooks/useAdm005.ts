'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { getEmployee, createEmployee, updateEmployee, deleteEmployee } from '@/lib/api/employee.api';
import { ROUTES } from '@/lib/constants/routes';
import { HTTP_STATUS } from '@/lib/constants/http';
import { formatErrorMessage, ERROR_MESSAGES } from '@/lib/constants/messages';
import { getStoredReturnUrl, STORAGE_KEYS } from '@/lib/constants/storage';

export const ADM004_STORAGE_KEY = STORAGE_KEYS.ADM004_TEMP_DATA;

const getAddStorageSession = () => {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(STORAGE_KEYS.ADM004_TEMP_DATA);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Error parsing ADM004_TEMP_DATA session:', e);
    return null;
  }
};

/**
 * Custom Hook quản lý dữ liệu và nghiệp vụ cho màn hình Xác nhận (ADM005).
 */
export function useAdm005() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Đọc query params từ URL
  const mode = (searchParams.get('mode') || 'add').toLowerCase();
  const employeeId = searchParams.get('id') || searchParams.get('employeeId');

  // 2. Khai báo các state quản lý
  const [formData, setFormData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSystemError, setIsSystemError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(mode === 'delete');

  // 3. Lấy Master Data (Phòng ban & Chứng chỉ tiếng Nhật)
  const { departments, isLoading: isLoadingDept } = useDepartments();
  const { certifications, isLoading: isLoadingCert } = useCertifications();

  // 4. Khởi tạo: Nạp dữ liệu form dựa theo mode
  useEffect(() => {
    // 4.1 Xử lý khi mode là XÓA (mode = delete)
    if (mode === 'delete') {
      if (!employeeId) {
        setIsSystemError(true);
        setIsLoadingDetail(false);
        return;
      }

      setIsLoadingDetail(true);
      setIsSystemError(false);
      getEmployee(employeeId)
        .then((res) => {
          if (res && res.code === HTTP_STATUS.OK) {
            const cert =
              res.certifications && res.certifications.length > 0
                ? res.certifications[0]
                : null;
            setFormData({
              employeeLoginId: res.employeeLoginId,
              departmentId: res.departmentId,
              employeeName: res.employeeName,
              employeeNameKana: res.employeeNameKana,
              employeeBirthDate: res.employeeBirthDate
                ? res.employeeBirthDate.replaceAll('-', '/')
                : '',
              employeeEmail: res.employeeEmail,
              employeeTelephone: res.employeeTelephone,
              certificationId: cert ? cert.certificationId : null,
              certificationStartDate: cert?.startDate
                ? cert.startDate.replaceAll('-', '/')
                : '',
              certificationEndDate: cert?.endDate
                ? cert.endDate.replaceAll('-', '/')
                : '',
              employeeCertificationScore:
                cert?.score !== null && cert?.score !== undefined
                  ? String(cert.score)
                  : '',
            });
          } else {
            setIsSystemError(true);
          }
        })
        .catch((err) => {
          console.error('Error fetching employee detail for delete confirm:', err);
          setIsSystemError(true);
        })
        .finally(() => {
          setIsLoadingDetail(false);
        });
      return;
    }

    // 4.2 Xử lý khi mode là THÊM MỚI hoặc CHỈNH SỬA (đọc từ sessionStorage)
    const data = getAddStorageSession();
    if (!data) {
      router.push(ROUTES.EMPLOYEE_LIST);
      return;
    }
    setFormData(data);
  }, [mode, employeeId, router]);

  // 5. Map ID sang Tên hiển thị (Department Name & Certification Name)
  const departmentName =
    departments.find((d) => String(d.departmentId) === String(formData?.departmentId))
      ?.departmentName || '';

  const certificationName =
    certifications.find(
      (c) => String(c.certificationId) === String(formData?.certificationId)
    )?.certificationName || '';

  // 6. Xử lý khi nhấn nút "OK" -> Thực hiện Thêm mới, Chỉnh sửa hoặc Xóa
  const handleOk = useCallback(async () => {
    if (!formData || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // 6.1 Xử lý khi xác nhận XÓA nhân viên
      if (mode === 'delete' && employeeId) {
        const deleteResponse = await deleteEmployee(employeeId);
        if (deleteResponse && deleteResponse.code === HTTP_STATUS.OK) {
          router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=delete`);
        }
        return;
      }

      // 6.2 Xử lý khi xác nhận CHỈNH SỬA thông tin nhân viên
      if (mode === 'edit' && employeeId) {
        const payload: any = {
          employeeId: Number(employeeId),
          employeeName: formData.employeeName,
          employeeNameKana: formData.employeeNameKana,
          employeeBirthDate: formData.employeeBirthDate.replaceAll('/', '-'),
          departmentId: Number(formData.departmentId),
          employeeEmail: formData.employeeEmail,
          employeeTelephone: formData.employeeTelephone,
          employeeLoginPassword: formData.employeeLoginPassword || undefined,
          certificationId:
            formData.certificationId && formData.certificationId !== '' && formData.certificationId !== '0'
              ? Number(formData.certificationId)
              : null,
          certificationStartDate:
            formData.certificationStartDate && formData.certificationStartDate.trim() !== ''
              ? formData.certificationStartDate.replaceAll('/', '-')
              : null,
          certificationEndDate:
            formData.certificationEndDate && formData.certificationEndDate.trim() !== ''
              ? formData.certificationEndDate.replaceAll('/', '-')
              : null,
          employeeCertificationScore:
            formData.employeeCertificationScore && formData.employeeCertificationScore !== ''
              ? Number(formData.employeeCertificationScore)
              : null,
        };

        const response = await updateEmployee(employeeId, payload);

        if (response && response.code === HTTP_STATUS.OK) {
          sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
          router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=edit`);
        }
        return;
      }

      // 6.3 Xử lý khi xác nhận THÊM MỚI nhân viên
      const payload: any = {
        employeeLoginId: formData.employeeLoginId,
        departmentId: Number(formData.departmentId),
        employeeName: formData.employeeName,
        employeeNameKana: formData.employeeNameKana,
        employeeBirthDate: formData.employeeBirthDate.replaceAll('/', '-'),
        employeeEmail: formData.employeeEmail,
        employeeTelephone: formData.employeeTelephone,
        employeeLoginPassword: formData.employeeLoginPassword,
        certificationId:
          formData.certificationId && formData.certificationId !== '' && formData.certificationId !== '0'
            ? Number(formData.certificationId)
            : null,
        certificationStartDate:
          formData.certificationStartDate && formData.certificationStartDate.trim() !== ''
            ? formData.certificationStartDate.replaceAll('/', '-')
            : null,
        certificationEndDate:
          formData.certificationEndDate && formData.certificationEndDate.trim() !== ''
            ? formData.certificationEndDate.replaceAll('/', '-')
            : null,
        employeeCertificationScore:
          formData.employeeCertificationScore && formData.employeeCertificationScore !== ''
            ? Number(formData.employeeCertificationScore)
            : null,
      };

      const response = await createEmployee(payload);

      if (response && response.code === HTTP_STATUS.OK) {
        sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
        router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=add`);
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      const msg = errorData?.message?.code
        ? formatErrorMessage(errorData.message.code, errorData.message.params || [])
        : ERROR_MESSAGES.ER015;

      // Nếu là Mode Add hoặc Edit: Lưu lỗi và điều hướng về ADM004
      if (mode === 'add' || mode === 'edit') {
        sessionStorage.setItem(STORAGE_KEYS.ADM004_ERROR_MESSAGE, msg);
        const backUrl =
          mode === 'edit' && employeeId
            ? `${ROUTES.EMPLOYEE_EDIT}?mode=back&id=${employeeId}`
            : `${ROUTES.EMPLOYEE_EDIT}?mode=back`;
        router.push(backUrl);
        return;
      }

      // Nếu là Mode Delete: Hiển thị lỗi hệ thống tại ADM005
      setIsSystemError(true);
      setErrorMessage(ERROR_MESSAGES.ER015);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, mode, employeeId, router]);

  // 7.1 Xử lý khi nhấn nút "OK" trên màn hình System Error
  const handleSystemErrorOk = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.ADM004_TEMP_DATA);
    router.push(getStoredReturnUrl());
  }, [router]);

  // 7.2 Xử lý khi nhấn nút "Quay lại" (戻る)
  const handleBack = useCallback(() => {
    // Nếu đang ở mode delete -> Quay lại màn hình chi tiết ADM003
    if (mode === 'delete' && employeeId) {
      router.push(`${ROUTES.EMPLOYEE_DETAIL}?id=${employeeId}`);
      return;
    }

    // Nếu đang ở mode edit -> Quay về ADM004 kèm mode=back&id=...
    if (mode === 'edit') {
      router.push(
        `${ROUTES.EMPLOYEE_EDIT}?mode=back${employeeId ? `&id=${employeeId}` : ''}`
      );
      return;
    }

    // Nếu đang ở mode add -> Quay về ADM004 kèm mode=back
    router.push(`${ROUTES.EMPLOYEE_EDIT}?mode=back`);
  }, [mode, employeeId, router]);

  return {
    mode,
    formData,
    departmentName,
    certificationName,
    isLoading:
      isLoadingDept || isLoadingCert || isLoadingDetail || (!isSystemError && !formData),
    isSubmitting,
    isSystemError,
    errorMessage,
    setErrorMessage,
    handleOk,
    handleBack,
    handleSystemErrorOk,
  };
}
