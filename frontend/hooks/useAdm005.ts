'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDepartments } from '@/hooks/useDepartments';
import { useCertifications } from '@/hooks/useCertifications';
import { ROUTES } from '@/lib/constants';
import { ADM004_STORAGE_KEY } from '@/hooks/useAdm004';
import { createEmployee, getEmployee, deleteEmployee } from '@/lib/api/employee.api';
import { formatErrorMessage, ERROR_MESSAGES } from '@/lib/constants/messages';

/**
 * Hàm đọc dữ liệu tạm đã lưu từ màn hình ADM004 trong sessionStorage.
 *
 * @return đối tượng dữ liệu form hoặc null nếu không tồn tại
 */
export const getAddStorageSession = () => {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(ADM004_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

/**
 * Custom Hook quản lý hiển thị dữ liệu và xử lý lưu/xóa nhân viên cho màn hình Xác nhận thông tin nhân viên (ADM005).
 *
 * @author nguyenduykhanh2
 * @return Các state và hàm handler phục vụ cho ADM005
 */
export function useAdm005() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Đọc query params (mode, employeeId, returnTo)
  const mode = searchParams.get('mode') || 'add';
  const employeeId = searchParams.get('id') || searchParams.get('employeeId');
  const returnToParam = searchParams.get('returnTo');

  // 2. Khai báo các state quản lý
  const [formData, setFormData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
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
        router.push(ROUTES.EMPLOYEE_LIST);
        return;
      }

      setIsLoadingDetail(true);
      getEmployee(employeeId)
        .then((res) => {
          if (res && res.code === 200) {
            const cert = res.certifications && res.certifications.length > 0 ? res.certifications[0] : null;
            setFormData({
              employeeLoginId: res.employeeLoginId,
              departmentId: res.departmentId,
              employeeName: res.employeeName,
              employeeNameKana: res.employeeNameKana,
              employeeBirthDate: res.employeeBirthDate ? res.employeeBirthDate.replaceAll('-', '/') : '',
              employeeEmail: res.employeeEmail,
              employeeTelephone: res.employeeTelephone,
              certificationId: cert ? cert.certificationId : null,
              certificationStartDate: cert?.startDate ? cert.startDate.replaceAll('-', '/') : '',
              certificationEndDate: cert?.endDate ? cert.endDate.replaceAll('-', '/') : '',
              employeeCertificationScore: cert?.score !== null && cert?.score !== undefined ? String(cert.score) : '',
              returnTo: returnToParam || ROUTES.EMPLOYEE_LIST,
            });
          } else {
            setErrorMessage(ERROR_MESSAGES.ER015);
          }
        })
        .catch((err) => {
          console.error('Error fetching employee detail for delete confirm:', err);
          const errorData = err.response?.data;
          if (errorData?.message?.code) {
            setErrorMessage(formatErrorMessage(errorData.message.code, errorData.message.params || []));
          } else {
            setErrorMessage(ERROR_MESSAGES.ER015);
          }
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
  }, [mode, employeeId, returnToParam, router]);

  // 5. Map ID sang Tên hiển thị (Department Name & Certification Name)
  const departmentName =
    departments.find((d) => String(d.departmentId) === String(formData?.departmentId))
      ?.departmentName || '';

  const certificationName =
    certifications.find((c) => String(c.certificationId) === String(formData?.certificationId))
      ?.certificationName || '';

  // 6. Xử lý khi nhấn nút "OK" -> Thực hiện Thêm mới hoặc Xóa
  const handleOk = useCallback(async () => {
    if (!formData || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      // 6.1 Xử lý khi xác nhận XÓA nhân viên
      if (mode === 'delete' && employeeId) {
        const deleteResponse = await deleteEmployee(employeeId);
        if (deleteResponse && deleteResponse.code === 200) {
          const returnTo = returnToParam || formData?.returnTo || ROUTES.EMPLOYEE_LIST;
          router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=delete&returnTo=${encodeURIComponent(returnTo)}`);
        }
        return;
      }

      // 6.2 Xử lý khi xác nhận THÊM MỚI nhân viên
      const payload = {
        employeeLoginId: formData.employeeLoginId,
        departmentId: Number(formData.departmentId),
        employeeName: formData.employeeName,
        employeeNameKana: formData.employeeNameKana,
        employeeBirthDate: formData.employeeBirthDate,
        employeeEmail: formData.employeeEmail,
        employeeTelephone: formData.employeeTelephone,
        employeeLoginPassword: formData.employeeLoginPassword,
        certificationId:
          formData.certificationId && formData.certificationId !== '' && formData.certificationId !== '0'
            ? Number(formData.certificationId)
            : null,
        certificationStartDate: formData.certificationStartDate || null,
        certificationEndDate: formData.certificationEndDate || null,
        employeeCertificationScore:
          formData.employeeCertificationScore && formData.employeeCertificationScore !== ''
            ? Number(formData.employeeCertificationScore)
            : null,
      };

      const response = await createEmployee(payload);

      if (response && response.code === 200) {
        sessionStorage.removeItem(ADM004_STORAGE_KEY);
        router.push(`${ROUTES.EMPLOYEE_COMPLETE}?mode=add`);
      }
    } catch (error: any) {
      const errorData = error.response?.data;
      if (errorData?.message?.code) {
        setErrorMessage(
          formatErrorMessage(errorData.message.code, errorData.message.params || [])
        );
      } else {
        setErrorMessage(ERROR_MESSAGES.ER015);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isSubmitting, mode, employeeId, returnToParam, router]);

  // 7. Xử lý khi nhấn nút "Quay lại" (戻る)
  const handleBack = useCallback(() => {
    const returnTo = returnToParam || formData?.returnTo || ROUTES.EMPLOYEE_LIST;

    // 7.1 Nếu đang ở mode delete -> Quay lại màn hình chi tiết ADM003
    if (mode === 'delete' && employeeId) {
      router.push(`${ROUTES.EMPLOYEE_DETAIL}?id=${employeeId}&returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }

    // 7.2 Nếu đang ở mode add/edit -> Quay về ADM004 kèm mode=back
    router.push(`${ROUTES.EMPLOYEE_EDIT}?mode=back&returnTo=${encodeURIComponent(returnTo)}`);
  }, [mode, employeeId, returnToParam, formData, router]);

  return {
    mode,
    formData,
    departmentName,
    certificationName,
    isLoading: isLoadingDept || isLoadingCert || isLoadingDetail || !formData,
    isSubmitting,
    errorMessage,
    setErrorMessage,
    handleOk,
    handleBack,
  };
}
